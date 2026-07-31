// Vercel serverless function — handles TWO actions on one endpoint:
//   1. { action: "auth", code }  -> validate an engineer passcode, return a device token
//   2. a submission (default)     -> verify token, then email the inspection via Resend
//
// ENVIRONMENT VARIABLES to set in Vercel (Settings -> Environment Variables):
//   RESEND_API_KEY   = your Resend API key
//   RECIPIENT_EMAIL  = where completed inspections are emailed
//   APP_TOKEN        = a shared secret; must EXACTLY match APP_TOKEN in index.html
//   TOKEN_SECRET     = any long random string (used to sign engineer tokens; never shared)
//   ENGINEERS        = approved engineers as  Name|passcode  pairs, separated by ; e.g.
//                      John Doe|4471;Jane Smith|8823;Captain A|9910
//   ALLOWED_ORIGIN   = (optional) your custom domain, e.g. https://checklist.flybird.com
//
// To REVOKE an engineer: delete their entry from ENGINEERS and redeploy. Their next
// sync fails and they're locked out — even though their phone still holds a token.

import crypto from "node:crypto";

/* ---- best-effort in-memory rate limit (per warm instance; raises the bar, not bulletproof) ---- */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now(), WINDOW = 60000, MAX = 20;
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX;
}

/* ---- approved-engineer list from the ENGINEERS env var ---- */
function engineers() {
  return (process.env.ENGINEERS || "")
    .split(";").map((s) => s.trim()).filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf("|");
      return { name: pair.slice(0, i).trim(), code: pair.slice(i + 1).trim() };
    })
    .filter((e) => e.name && e.code);
}

/* ---- stateless, offline-safe engineer tokens (HMAC-signed name) ---- */
function signToken(name) {
  const p = Buffer.from(name).toString("base64url");
  const sig = crypto.createHmac("sha256", process.env.TOKEN_SECRET || "").update(name).digest("hex");
  return p + "." + sig;
}
function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [p, sig] = token.split(".");
  let name;
  try { name = Buffer.from(p, "base64url").toString("utf8"); } catch { return null; }
  const expect = crypto.createHmac("sha256", process.env.TOKEN_SECRET || "").update(name).digest("hex");
  try {
    const a = Buffer.from(sig || "", "hex"), b = Buffer.from(expect, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  } catch { return null; }
  return name;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  // 1) Shared app-token gate (fail closed if not configured).
  if (!process.env.APP_TOKEN || (req.headers["x-app-token"] || "") !== process.env.APP_TOKEN) {
    return res.status(401).json({ error: "unauthorised (app token)" });
  }

  // 2) Soft origin check — block browser-based cross-site abuse.
  const origin = req.headers.origin || "";
  const allowed = process.env.ALLOWED_ORIGIN || "";
  if (origin && !origin.endsWith(".vercel.app") && (!allowed || origin !== allowed)) {
    return res.status(403).json({ error: "bad origin" });
  }

  // 3) Rate limit by IP.
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "too many requests, slow down" });

  const body = req.body || {};

  // ---- ACTION: authenticate an engineer passcode ----
  if (body.action === "auth") {
    const match = engineers().find((e) => e.code === String(body.code || "").trim());
    if (!match) return res.status(401).json({ error: "Passcode not recognised." });
    return res.status(200).json({ ok: true, name: match.name, token: signToken(match.name) });
  }

  // ---- ACTION: submit an inspection ----
  try {
    const r = body;

    // Verify the engineer token, then confirm they're still approved (revocation).
    const name = verifyToken(r.authToken);
    if (!name) return res.status(401).json({ error: "invalid or missing engineer token" });
    if (!engineers().some((e) => e.name === name)) {
      return res.status(403).json({ error: "engineer no longer approved" });
    }

    // Save durably to Supabase FIRST. This is the system of record — email is
    // just a notification on top of it. `on_conflict=id` + ignore-duplicates
    // means a retried submission is a no-op here (idempotent) instead of a
    // second row.
    let isDuplicate = false;
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const dbResp = await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/submissions?on_conflict=id`,
          {
            method: "POST",
            headers: {
              apikey: process.env.SUPABASE_SERVICE_KEY,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "resolution=ignore-duplicates,return=representation",
            },
            body: JSON.stringify({
              id: r.id,
              check_type: r.checkType,
              airworthy: r.airworthy,
              unserviceable_reason: r.unserviceableReason,
              registration: r.registration,
              tsn: r.tsn,
              date: r.date,
              engineer: name,
              remarks: r.remarks,
              items: r.items,
              signature: r.signature,
              images: r.images,
              voice: r.voice,
              voice_mime: r.voiceMime,
            }),
          }
        );
        const inserted = await dbResp.json().catch(() => []);
        // Empty array back = the row already existed (ignore-duplicates fired) = this is a retry.
        isDuplicate = Array.isArray(inserted) && inserted.length === 0;
      } catch (e) {
        // Storage being unreachable should not block the email — log and continue.
        console.error("Supabase insert failed:", e);
      }
    }
    if (isDuplicate) {
      return res.status(200).json({ ok: true, id: r.id, duplicate: true });
    }

    const rows = (r.items || [])
      .map(
        (i) =>
          `<tr><td style="padding:4px 8px;border-bottom:1px solid #eee">${escape(i.item)}${
            i.comment
              ? `<br><span style="color:#666;font-size:12px">&#8627; ${escape(i.comment)}</span>`
              : ""
          }</td>
           <td style="text-align:center;border-bottom:1px solid #eee">${i.eng ? "\u2713" : ""}</td>
           <td style="text-align:center;border-bottom:1px solid #eee">${i.tech ? "\u2713" : ""}</td></tr>`
      )
      .join("");

    const remarksHtml = r.remarks
      ? `<div style="margin:14px 0;padding:12px 14px;border-left:4px solid #C9A84C;background:#FAF6EC">
           <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#974706;font-weight:700;margin-bottom:4px">General Remarks & Notes</div>
           <div style="white-space:pre-wrap;font-size:13px">${escape(r.remarks)}</div>
         </div>`
      : "";

    // Airworthiness banner — green for serviceable, red for unserviceable (with reason).
    const awColor = r.airworthy === "Serviceable" ? "#2E8B6F" : "#B23A48";
    const awBanner = r.airworthy
      ? `<div style="background:${awColor};color:#fff;padding:12px 16px;border-radius:8px;font-weight:700;font-size:15px;margin:12px 0">
           ${escape(r.airworthy)}${r.unserviceableReason ? ` &mdash; ${escape(r.unserviceableReason)}` : ""}
         </div>`
      : "";

    const html = `
      <div style="font-family:Arial,sans-serif;color:#0d1526">
        <h2 style="color:#071A5A">Gulfstream ${escape(r.checkType || "Pre-flight")} Checklist</h2>
        <p><b>Registration:</b> ${escape(r.registration)} &nbsp; <b>TSN/CSN:</b> ${escape(r.tsn)} &nbsp; <b>Date:</b> ${escape(r.date)}</p>
        <p><b>Engineer:</b> ${escape(name)} <span style="color:#2E8B6F">&#10003; verified</span> &nbsp; <b>Submission ID:</b> ${escape(r.id)}</p>
        ${awBanner}
        <table style="border-collapse:collapse;width:100%;font-size:13px">
          <tr><th style="text-align:left;padding:4px 8px;background:#071A5A;color:#fff">Item</th>
              <th style="background:#071A5A;color:#fff">ENG</th><th style="background:#071A5A;color:#fff">TECH</th></tr>
          ${rows}
        </table>
        ${remarksHtml}
        <p style="margin-top:14px;color:#5a6577;font-size:12px">${attachSummary(r)}</p>
      </div>`;

    // Build attachments defensively. A data URL looks like "data:<mime>;base64,<DATA>".
    // If DATA is missing/empty (malformed capture), skip that attachment rather than
    // letting Resend reject the entire email with "invalid_attachment".
    const b64 = (dataUrl) => {
      if (typeof dataUrl !== "string") return null;
      const comma = dataUrl.indexOf(",");
      if (comma === -1) return null;
      const data = dataUrl.slice(comma + 1).trim();
      return data.length ? data : null;
    };

    const attachments = [];
    const sig = b64(r.signature);
    if (sig) attachments.push({ filename: "signature.png", content: sig });
    (r.images || []).forEach((img, idx) => {
      const content = b64(img);
      if (!content) return;
      const ext = (img.split(";")[0].split("/")[1] || "jpg");
      attachments.push({ filename: `photo-${idx + 1}.${ext}`, content });
    });
    const voice = b64(r.voice);
    if (voice) {
      const raw = (r.voiceMime || (r.voice.split(";")[0].split(":")[1]) || "audio/webm");
      const ext = raw.includes("mp4") || raw.includes("m4a") ? "m4a" : raw.includes("ogg") ? "ogg" : "webm";
      attachments.push({ filename: `voice-note.${ext}`, content: voice });
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Flybird Inspections <onboarding@resend.dev>",
        to: [process.env.RECIPIENT_EMAIL],
        subject: `${r.checkType || "Pre-flight"} — ${r.registration || "aircraft"} — ${r.date || ""}${r.airworthy ? " — " + r.airworthy.toUpperCase() : ""}`,
        html,
        attachments,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      // The record is already safely stored above — a failed email does NOT lose the
      // inspection. It just means this one needs a resend once the config is fixed.
      return res.status(422).json({ error: "email failed", detail });
    }

    // Mark as emailed (best-effort — a failure here doesn't affect the saved record).
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      fetch(`${process.env.SUPABASE_URL}/rest/v1/submissions?id=eq.${r.id}`, {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailed_at: new Date().toISOString() }),
      }).catch(() => {});
    }

    return res.status(200).json({ ok: true, id: r.id, engineer: name });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

function escape(s) {
  return String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function attachSummary(r) {
  const parts = [];
  if (r.signature) parts.push("signature");
  const n = (r.images || []).length;
  if (n) parts.push(`${n} photo${n > 1 ? "s" : ""}`);
  if (r.voice) parts.push("voice note");
  return parts.length ? `Attached: ${parts.join(", ")}.` : "No attachments.";
}

// Vercel serverless function: receives one inspection and emails it.
// Uses Resend (https://resend.com) — free tier is plenty for a temporary tool.
//
// Set two Environment Variables in Vercel (Settings -> Environment Variables):
//   RESEND_API_KEY  = your Resend API key
//   RECIPIENT_EMAIL = where completed inspections should land (e.g. maintenance@flybird...)
//
// Sender note: Resend's free sandbox sender is onboarding@resend.dev. To send from a
// Flybird address you verify a domain in Resend first (optional for a temporary tool).

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const r = req.body || {};

    // Build a simple, printable HTML summary of the checklist.
    const rows = (r.items || [])
      .map(
        (i) =>
          `<tr><td style="padding:4px 8px;border-bottom:1px solid #eee">${escape(i.item)}</td>
           <td style="text-align:center;border-bottom:1px solid #eee">${i.eng ? "✓" : ""}</td>
           <td style="text-align:center;border-bottom:1px solid #eee">${i.tech ? "✓" : ""}</td></tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;color:#0d1526">
        <h2 style="color:#071A5A">Gulfstream GIV Pre-flight Inspection</h2>
        <p><b>Registration:</b> ${escape(r.registration)} &nbsp; <b>TSN/CSN:</b> ${escape(r.tsn)} &nbsp; <b>Date:</b> ${escape(r.date)}</p>
        <p><b>Engineer:</b> ${escape(r.engineer)} &nbsp; <b>Submission ID:</b> ${escape(r.id)}</p>
        <table style="border-collapse:collapse;width:100%;font-size:13px">
          <tr><th style="text-align:left;padding:4px 8px;background:#071A5A;color:#fff">Item</th>
              <th style="background:#071A5A;color:#fff">ENG</th><th style="background:#071A5A;color:#fff">TECH</th></tr>
          ${rows}
        </table>
        <p style="margin-top:14px">Signature and stamp attached.</p>
      </div>`;

    // Attach signature + stamp (they arrive as data URLs; strip the prefix to base64).
    const attachments = [];
    if (r.signature) attachments.push({ filename: "signature.png", content: r.signature.split(",")[1] });
    if (r.stamp) {
      const ext = (r.stamp.split(";")[0].split("/")[1] || "png");
      attachments.push({ filename: "stamp." + ext, content: r.stamp.split(",")[1] });
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
        subject: `GIV Pre-flight — ${r.registration || "aircraft"} — ${r.date || ""}`,
        html,
        attachments,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return res.status(502).json({ error: "email failed", detail });
    }
    // 200 tells the phone the submission is safely delivered, so it marks it "Synced".
    return res.status(200).json({ ok: true, id: r.id });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

function escape(s) {
  return String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

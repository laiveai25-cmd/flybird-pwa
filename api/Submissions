// Read-only dashboard data endpoint.
// GET /api/submissions?token=...&from=YYYY-MM-DD&to=YYYY-MM-DD&registration=...&airworthy=...
//
// Security: gated by a DASHBOARD_TOKEN env var (a password you set in Vercel).
// The Supabase service key stays server-side; the browser dashboard never sees it.
// Returns lightweight summary rows only — never the heavy signature/photo/voice blobs.
//
// Extra env var to set in Vercel (Production):
//   DASHBOARD_TOKEN = a password of your choice for dashboard access

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  // Gate.
  if (!process.env.DASHBOARD_TOKEN || (req.query.token || "") !== process.env.DASHBOARD_TOKEN) {
    return res.status(401).json({ error: "unauthorised" });
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "database not configured" });
  }

  const base = (process.env.SUPABASE_URL || "").replace(/\/+$/, "").replace(/\/rest(\/v1)?$/, "");

  // Only summary columns — keeps it fast and avoids shipping base64 blobs to the browser.
  const cols = "id,created_at,check_type,registration,date,engineer,airworthy,unserviceable_reason,emailed_at";
  const params = [`select=${cols}`, "order=created_at.desc"];

  const enc = (v) => encodeURIComponent(String(v));
  if (req.query.from) params.push(`date=gte.${enc(req.query.from)}`);
  if (req.query.to) params.push(`date=lte.${enc(req.query.to)}`);
  if (req.query.registration && req.query.registration !== "all")
    params.push(`registration=eq.${enc(req.query.registration)}`);
  if (req.query.airworthy && req.query.airworthy !== "all")
    params.push(`airworthy=eq.${enc(req.query.airworthy)}`);

  try {
    const r = await fetch(`${base}/rest/v1/submissions?${params.join("&")}`, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return res.status(502).json({ error: "database query failed", detail });
    }
    const rows = await r.json();
    return res.status(200).json({ ok: true, count: rows.length, rows });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

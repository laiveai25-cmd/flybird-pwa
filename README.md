# Flybird GIV Pre-flight Inspection — Production Guide

An offline-first web form (PWA) for the Gulfstream GIV pre-flight / transit / post-flight
inspection. Engineers open it on their phone, fill it in **with or without internet**, and it
emails the completed checklist automatically. If there's no signal, the submission is stored on
the phone and sent the moment connectivity returns — no data lost.

## What's in this folder

| File | What it does |
|------|--------------|
| `index.html` | The whole form. This is what engineers use. |
| `manifest.json` + `icon-*.png` | Lets the form install to the phone home screen like an app. |
| `sw.js` | Makes the form load even with no internet. |
| `api/submit.js` | The email sender (runs on Vercel, invisible to users). |

---

## How the offline part works (plain English)

1. Engineer fills the form. On **Save & submit**, it's written to a small database **on their phone**.
2. It shows as **Pending** in the Outbox.
3. If online, it's emailed immediately and flips to **Synced ✓**.
4. If offline, it waits. When the phone regains signal, it sends automatically.
5. Every submission has a unique ID, so a retry can never send the same form twice.

---

## Step-by-step to production

You'll do this once. It takes about 30–45 minutes. You need a GitHub account and a Vercel
account (both free), which you already have.

### Phase 1 — See it work first (2 min)
Open `index.html` on your computer or phone by double-clicking it. Fill it in, hit **Save &
submit**, and watch it appear in the Outbox. Flip the **"Simulate no connectivity"** switch and
submit again — it stays *Pending*, then syncs when you switch back. This is the prototype running
in DEMO MODE (emails are simulated). Everything below turns the emails real.

### Phase 2 — Put the files on GitHub (10 min)
1. Go to GitHub → **New repository** → name it e.g. `flybird-preflight` → **Create**.
2. Click **uploading an existing file**.
3. Drag in **everything in this folder**, keeping the `api` folder as a folder (upload the whole
   `flybird-preflight` folder contents so `api/submit.js` stays inside `api/`).
4. **Commit**.

### Phase 3 — Deploy to Vercel (5 min)
1. Vercel → **Add New… → Project** → **Import** your `flybird-preflight` repo.
2. Leave all settings as default → **Deploy**.
3. Vercel gives you a URL like `https://flybird-preflight.vercel.app`. Open it — the form loads.
   This is now a real, installable app. (Emails are still simulated until Phase 4.)

### Phase 4 — Turn on real emails (15 min)
1. Create a free account at **resend.com** → copy your **API key**.
2. In Vercel → your project → **Settings → Environment Variables**, add two:
   - `RESEND_API_KEY` = the key you copied
   - `RECIPIENT_EMAIL` = where inspections should be emailed (e.g. maintenance mailbox)
3. In GitHub, open `index.html`, click the pencil to edit, and change **one line** near the top:
   ```
   const DEMO_MODE = true;   ->   const DEMO_MODE = false;
   ```
   Commit. Vercel redeploys automatically in ~1 minute.
4. Open your Vercel URL, submit a test inspection, and check the recipient inbox. Done.

> **Sender address:** out of the box, emails come from `onboarding@resend.dev`. To send from a
> Flybird address, verify a domain in Resend (optional; the default works fine for a temporary tool).

### Phase 5 — Give it to the engineers (2 min each)
Send them the Vercel URL. On the phone:
- **iPhone:** open in Safari → Share → **Add to Home Screen**.
- **Android:** open in Chrome → menu → **Add to Home screen / Install app**.
It now behaves like an installed app and works offline. Ask each engineer to open it **once while
online** so the offline cache loads.

### Phase 6 — Test offline for real (5 min)
On a phone: open the app, turn on **Airplane mode**, fill and submit a form (it stays *Pending*),
turn Airplane mode off, and watch it send. That's the whole promise, proven.

---

## Updating the form later
Edit `index.html` on GitHub → commit → Vercel redeploys automatically. When you change the form,
bump the version in `sw.js` (`v1` → `v2`) so phones pick up the new version instead of the cached
old one.

## Notes worth keeping in mind
- **Temporary by design.** This is a lean tool. When Flybird's Power Platform / D365 environment is
  ready, this can be rebuilt in Power Apps so inspections feed the ERP instead of email.
- **Personal data (NDPA).** The engineer's name, signature and stamp are personal data. Here they
  live in your Vercel/Resend accounts and the recipient inbox — fine for a temporary tool; just be
  deliberate about who can access those inboxes.
- **Signature/stamp legality.** Confirm with your NCAA/NCAR position whether this electronic record
  is sufficient, or whether the wet-ink stamped paper remains the legal master and this is a
  convenience copy. That decision doesn't change the app — only how you file the output.
- **Idempotency.** The 200-OK-marks-synced flow means no duplicates from retries on the phone side.
  If you later want server-side dedupe too, store seen IDs in the function; not needed for a
  temporary tool.

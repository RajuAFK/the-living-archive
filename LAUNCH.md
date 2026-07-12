# LAUNCH — replacing praxivision.com with The Living Archive

Strategy: a **new repo** (`RajuAFK/the-living-archive`) with the same proven
pipeline — `main → auto-build → deploy branch` — and you point Hostinger's Git
deployment at the new repo. The old `RajuAFK/praxis-studio` repo is never
touched: it *is* the rollback (reconnect hPanel to it and the old site is back
in minutes).

**Legend:** 🧑 = you do it manually · 🤖 = already done.

What's left for you: reconnect Hostinger Git, drop one secret file on the
server, import one SQL file, paste R2 keys. Budget ~30 minutes.

---

## What's already handled 🤖

- Full site (home, services ×6, archives, case studies, studio, admin portal),
  all approved copy, founder portrait, registered address, archive fixes.
- Layout fixes: transparent navbar over the hero, archive filters clear the
  floating pill.
- Contact form uses the **same `contact_inquiries` table and mail flow as the
  previous site** (verified live 2026-07-10) — inquiry history stays unified;
  a `phone` column is added automatically on first submission.
- SEO: metadata, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`,
  OG image, favicon. Off-page playbook in SEO-PLAYBOOK.md.
- **The new GitHub repo is created and pushed**, the Actions workflow
  (`.github/workflows/deploy.yml`) has run, and the **`deploy` branch holds the
  built site** — verified before handover.
- A ready `config.php` (DB creds + admin password hash pre-filled) and a
  one-shot `seed.sql`.

---

## Step 1 — Keep the escape hatch in mind 🧑 (nothing to do)

The old repo `RajuAFK/praxis-studio` still holds the current live site on its
`deploy` branch. Rollback at any time = reconnect Hostinger to it (Step 2 in
reverse). Optionally download a zip of `public_html/` from Hostinger File
Manager for extra comfort.

## Step 2 — Point Hostinger at the new repo 🧑

Hostinger hPanel → **Websites → praxivision.com → Advanced → GIT**:

1. Note (or screenshot) the current repository connection — that's your
   rollback reference.
2. Remove/disconnect the current repository (`praxis-studio`, branch `deploy`).
3. **Create a new connection:**
   - Repository: `https://github.com/RajuAFK/the-living-archive`
   - Branch: **`deploy`**
   - Directory: leave empty (deploys into `public_html`)
4. Click **Deploy** once to pull immediately (afterwards Hostinger auto-pulls
   on every push; if there's an "Auto deployment" webhook toggle/URL, enable it
   — if you paste the webhook URL into GitHub → repo Settings → Webhooks, every
   deploy-branch update publishes instantly).

The site is now live but running on empty tables — finish steps 3–5.

## Step 3 — Upload the two secret files (off-webroot) 🧑

These never go in Git. Use Hostinger **File Manager** (or SFTP).

1. Navigate to `/home/u220392676/domains/praxivision.com/private/`
   (create `private/` if it doesn't exist — it sits **next to** `public_html`,
   not inside it).
2. Upload **`server-config/config.php`** there, so it becomes
   `/home/u220392676/domains/praxivision.com/private/config.php`.
   - DB credentials, admin password hash, **and the R2 keys are all filled
     in** — nothing left to paste. Just upload the file as-is.

## Step 4 — Create the database tables + seed the archive 🧑

1. Hostinger → **Databases → phpMyAdmin** → open database **`u220392676_praxis`**.
2. **Import** tab → choose **`server-config/seed.sql`** → **Go**.
   (Or paste its contents into the **SQL** tab and run.)
3. This creates the `la_*` tables and loads the 71 archive works + 5 starter
   hero slides. It's idempotent — safe to re-run.
   - The contact form reuses your existing `contact_inquiries` table (it's
     already in this database from the previous site); the endpoint adds a
     `phone` column automatically on first use. Nothing to import for it.

## Step 5 — Cloudflare R2: CORS 🧑

The R2 **keys are already in `config.php`** (token "praxivision upload",
verified read+write). The only remaining R2 step is CORS: the admin portal
uploads media straight from the browser to R2, so the bucket must allow browser
`PUT` from the site origin.

- Cloudflare → **R2 → praxivision → Settings → CORS Policy** → add
  `PUT` and the production origin:
   ```json
   [
     {
       "AllowedOrigins": ["https://praxivision.com", "https://www.praxivision.com"],
       "AllowedMethods": ["GET", "HEAD", "PUT"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["Content-Length", "Content-Type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
   (The existing GET/HEAD for the public viewers stays; you're just adding PUT.)

## Step 6 — Smoke test the live site 🧑

Once Hostinger has pulled the new `deploy` (usually a minute or two after the
Action finishes):

- [ ] `https://praxivision.com/` loads, hero cycles, sections scroll smoothly.
- [ ] `https://praxivision.com/archives/` shows works; open a photo gallery, a
      360° tour, and a 3D model — all should load from R2.
- [ ] `https://praxivision.com/studio/` shows the founder portrait.
- [ ] Submit the footer contact form → you receive the email and a row appears
      in `contact_inquiries` (check via the admin **Inquiries** tab).
- [ ] `https://praxivision.com/sitemap.xml` and `/robots.txt` return correctly.
- [ ] `https://praxivision.com/admin/` → log in (see below) → the Hero, Case
      Studies, Archive and Inquiries tabs load. Do a test image upload in Hero
      to confirm R2 `PUT` works, then delete it.

---

## The admin portal

- **URL:** `https://praxivision.com/admin/`
- **Password:** `Vault-Gigapan-4667`
- Single password, session cookie, rate-limited (8 tries / 15 min), CSRF-guarded.
- **Change the password** anytime: run
  `php -r "echo password_hash('your-new-password', PASSWORD_DEFAULT), PHP_EOL;"`
  locally (or any online bcrypt-for-PHP tool), and replace `ADMIN_PASSWORD_HASH`
  in `private/config.php`. No redeploy needed.

What the portal does — **none of these need a rebuild; they're live via MySQL:**

- **Hero** — upload/reorder/hide home hero slides.
- **Case Studies** — the block composer (title, intro, media blocks with
  left/right/full/inset placement that text wraps around, quotes, CTAs to
  filtered archive views). Draft privately, Preview, Publish.
- **Archive** — add/edit works; upload new media to R2; set domain/industry/kind.
- **Inquiries** — read contact-form submissions.

---

## Day-to-day after launch

- **Content** (hero, case studies, archive items) → edit in `/admin/`. Instant,
  no deploy.
- **Code/design changes** → push to `main`; the Action rebuilds and redeploys.
- **New archive media** → upload through the admin (lands in R2 under
  `/uploads/…`), then reference it on an archive item or case study.

## Is it SEO-ready?

Yes — technically complete: server-rendered metadata, Open Graph/Twitter cards,
canonical URLs, `sitemap.xml`, `robots.txt` (which explicitly welcomes AI
crawlers), an `llms.txt` briefing for AI assistants, and rich JSON-LD
(Organization + LocalBusiness + WebSite + per-service Service + BreadcrumbList +
founder Person). The growth work — getting search engines and chatbots to
actually surface you — is in **[SEO-PLAYBOOK.md](SEO-PLAYBOOK.md)**.

## Still outstanding (non-blocking)

- **Virtual Museum** final name/domain — placeholder copy is live; update when
  the domain is secured.
- A couple of case studies, whenever you want to publish them (admin portal).

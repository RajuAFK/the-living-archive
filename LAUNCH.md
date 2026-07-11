# LAUNCH — replacing praxivision.com with The Living Archive

This is the exact, ordered checklist to take the site live. It replaces the
current praxivision.com **without changing anything about how Hostinger
deploys** — the same `RajuAFK/praxis-studio` repo, the same `main → build →
deploy branch → Hostinger` pipeline. You only swap what's in the repo.

**Legend:** 🧑 = you do it manually · 🤖 = already done in the codebase.

Everything code-side is committed. What's left is: put the new code in the
GitHub repo, drop two secret files on the server, import one SQL file, and
paste your R2 keys. Budget ~40 minutes.

---

## What's already handled 🤖

- Full site (home, services ×6, archives, case studies, studio, admin portal).
- All approved copy, the founder portrait, the registered address, the archive
  fixes (GLB removed, One Continent Atria named).
- SEO: metadata, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`,
  OG image, favicon.
- The GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and
  force-pushes `out/` to the `deploy` branch — same mechanism as the old
  `cms-rebuild.yml`.
- A ready `config.php` (DB creds + admin password hash pre-filled) and a
  one-shot `seed.sql`.

---

## Step 1 — Back up the current live site 🧑

Before anything, keep an escape hatch.

1. GitHub → `RajuAFK/praxis-studio` → **Settings → nothing to change**, just
   note the current `main` and `deploy` commit SHAs, or tag them:
   ```bash
   # from your existing new-praxis-site checkout
   cd new-praxis-site
   git fetch origin
   git tag praxis-old-main origin/main
   git tag praxis-old-deploy origin/deploy
   git push origin praxis-old-main praxis-old-deploy
   ```
   If anything goes wrong you can restore from these tags.
2. In Hostinger → **File Manager**, download a zip of the current
   `public_html/` (or at least note that you can restore from the tag above).

## Step 2 — Put the new site in the GitHub repo 🧑

The new code currently lives in the standalone repo
`projects/the-living-archive`. Push it over `main` of `RajuAFK/praxis-studio`:

```bash
cd projects/the-living-archive
git remote add production https://github.com/RajuAFK/praxis-studio.git
git push production main --force
```

That replaces `main` with the new site (history and all). The old
`cms-rebuild.yml` is gone; the new `deploy.yml` takes over. **Pushing to `main`
triggers the build automatically** — watch it under the repo's **Actions** tab.
When it finishes, the `deploy` branch holds the new `out/`, and Hostinger's
auto-pull publishes it.

> If the Action fails on first run because the `deploy` branch is protected or
> the token lacks push rights: GitHub → repo **Settings → Actions → General →
> Workflow permissions → Read and write permissions → Save**, then re-run.

## Step 3 — Upload the two secret files (off-webroot) 🧑

These never go in Git. Use Hostinger **File Manager** (or SFTP).

1. Navigate to `/home/u220392676/domains/praxivision.com/private/`
   (create `private/` if it doesn't exist — it sits **next to** `public_html`,
   not inside it).
2. Upload **`server-config/config.php`** there, so it becomes
   `/home/u220392676/domains/praxivision.com/private/config.php`.
   - DB credentials and the admin password hash are already filled in.
   - You still need to paste the R2 keys — see Step 5.

## Step 4 — Create the database tables + seed the archive 🧑

1. Hostinger → **Databases → phpMyAdmin** → open database **`u220392676_praxis`**.
2. **Import** tab → choose **`server-config/seed.sql`** → **Go**.
   (Or paste its contents into the **SQL** tab and run.)
3. This creates the `la_*` tables and loads the 71 archive works + 5 starter
   hero slides. It's idempotent — safe to re-run.
   - `la_inquiries` (contact form) is created automatically on first submission,
     so it's not in the seed.

## Step 5 — Cloudflare R2: keys + CORS 🧑

The admin portal uploads new media straight from the browser to R2, so R2 must
(a) give the server signing keys and (b) allow browser `PUT`.

1. Cloudflare → **R2 → Manage R2 API Tokens → Create API Token**:
   - Permission **Object Read & Write**, scoped to bucket
     `praxivision-portfolio`.
   - Copy the **Access Key ID**, **Secret Access Key**, and your **Account ID**
     (in the R2 URL).
2. Edit `private/config.php` on the server and replace the three
   `PASTE-R2-…` values with those keys.
3. Cloudflare → **R2 → praxivision-portfolio → Settings → CORS Policy** → add
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
      in `la_inquiries` (check via the admin **Inquiries** tab).
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

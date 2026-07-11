# Deploying The Living Archive → praxivision.com

This site **replaces** the current praxivision.com. Cut-over happens only on
explicit go-ahead. Same Hostinger account (`u220392676`), same layout as the
other sites: static files in `public_html/`, secrets in per-domain `private/`.

## Architecture recap

- **Frontend**: Next.js static export (`out/`) — HTML/CSS/JS only.
- **Dynamic content**: PHP endpoints under `/api/` + MySQL (`u220392676_praxis`,
  tables prefixed `la_`). Hero slides, archives, case studies and the contact
  form are all served at runtime — **content edits never need a rebuild**.
- **Admin portal**: `/admin/` (PHP, single password). Uploads go browser → R2
  directly via presigned PUT.
- **Media**: Cloudflare R2 bucket `praxivision-portfolio`
  (`https://pub-b6df9c86ce26430caf9d07b91b02796f.r2.dev`).

## One-time setup

1. **GitHub repo**: push this project to a new repo, `main` branch.
   The `deploy.yml` workflow builds and force-pushes `out/` to a `deploy`
   branch on every code push to main.
2. **Hostinger Git deployment**: point praxivision.com at the new repo's
   `deploy` branch (replacing the old repo's hook) — do this at cut-over time.
3. **Server config**: copy `server-config/config.example.php` to
   `/home/u220392676/domains/praxivision.com/private/config.php` and fill in:
   - MySQL password (existing DB `u220392676_praxis` / user `u220392676_studioadmin`)
   - `ADMIN_PASSWORD_HASH` — generate with
     `php -r "echo password_hash('CHOSEN-PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"`
   - R2 credentials (Object Read & Write token scoped to the bucket)
4. **Database**: run the schema + seed once (SSH or a temporary runner script):
   ```
   php server-config/seed-archives.php
   ```
   (needs `data/archive-items.json`, `data/hero-fallback.json` and
   `server-config/schema.sql` next to it — simplest is to upload the repo's
   `server-config/` + `data/` folders to the domain root, run, then delete.)
   This imports the 72 archive works and the 5 starter hero slides.
5. **R2 CORS**: bucket → Settings → CORS — add `PUT` to AllowedMethods and
   `https://praxivision.com` to AllowedOrigins (admin uploads need it; the
   existing GET/HEAD stays for the viewers).

## Cut-over checklist

- [ ] `npm run build` green in CI; `deploy` branch has fresh `out/`
- [ ] `private/config.php` in place (never in git)
- [ ] Schema + seed ran; `/api/public/archives.php` returns 72 items
- [ ] `/api/public/hero.php` returns slides
- [ ] Contact form: live submission → `contact_inquiries` row + email received
- [ ] `/admin/` login works; hero reorder round-trips; test upload lands in R2 `/uploads/`
- [ ] Case-study rewrite works: `/case-studies/anything/` serves the shell (404-free)
- [ ] Old site's `public_html` contents replaced (keep a zip backup first)

## Local development

```bash
npm run dev        # Next dev server (port from launch config)
npm run mock-api   # Node mock of the PHP API on :3013 (admin password: test)
```
`next dev` proxies `/api/*` to the mock (dev only). The real admin portal
can be exercised at `http://localhost:3013/admin/` against the mock.

Regenerate derived data after asset changes:

```bash
node scripts/transform-manifest.mjs   # archive-items.json from the old manifest
python scripts/monochrome-logos.py    # client logos → linen silhouettes
node scripts/generate-clients.mjs     # lib/clients.generated.ts
```

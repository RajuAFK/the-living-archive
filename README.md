# The Living Archive — praxivision.com

The new Praxivision website: an immersive, media-first presentation of three
decades of digital preservation work — photography, 360° VR tours, 3D
digitization and gigapixel capture — with a filterable archive, block-based
case studies, and a self-serve admin portal.

Praxivision is the brand; *The Living Archive* is the internal concept name
for this build (it never appears in the UI).

## Stack

| Layer | Tech | Where it runs |
|---|---|---|
| Frontend | Next.js 16 (App Router) static export, Tailwind v4, Motion, Lenis | `public_html/` on Hostinger (Apache) |
| Dynamic content | PHP 8 JSON endpoints under `public/api/` | Same webroot — no Node on the server |
| Data | MySQL `u220392676_praxis`, tables `la_*` | Hostinger |
| Media | Cloudflare R2 `praxivision-portfolio` | `pub-…r2.dev` public bucket |
| Admin | `/admin/` single-file PHP SPA, password + session + CSRF | Same webroot |

Key documents: [DEPLOY.md](DEPLOY.md) · [CONTENT-TODO.md](CONTENT-TODO.md) ·
schema in [server-config/schema.sql](server-config/schema.sql).

## Design system

80% **dark vault** (warm charcoal `--ink-0`, media glows) / 20% **light
reading rooms** (warm ivory `--paper` for narrative passages), accent
**verdigris** — the patina of preserved bronze. Type: Fraunces (display) ·
Archivo (UI) · Fragment Mono (archival labels). Tokens in
[app/globals.css](app/globals.css); light sections opt in via the
`.reading-room` class, which flips the contextual custom properties.

Copy the studio hasn't supplied yet renders as visible `◌ COPY PENDING`
slots (`components/TodoSlot.tsx`) tracked in CONTENT-TODO.md.

## Development

```bash
npm run dev        # Next dev server
npm run mock-api   # mock of the PHP API on :3013 (admin password: test)
```

In dev, `/api/*` is proxied to the mock (see `next.config.ts`); production
serves the real PHP from the same paths. The admin portal runs against the
mock at `http://localhost:3013/admin/`.

Derived data (regenerate after asset changes):

```bash
node scripts/transform-manifest.mjs   # archive metadata from legacy manifest
python scripts/monochrome-logos.py    # client logos → linen silhouettes
node scripts/generate-clients.mjs     # ticker logo module
```

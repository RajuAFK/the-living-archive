# Content TODO — everything the site is waiting on

Every `◌ COPY PENDING` box on the site maps to an ID below. Reply with the ID
and the text (or drop files) and it gets wired in. Nothing here blocks the
build — the site renders with visible placeholders until each item lands.

## Home

| ID | What's needed |
|---|---|
| `home.about.narrative` | 2–3 short paragraphs introducing Praxivision — origin, what "end-to-end documentation & archival pipeline" means in your words, who you work with. |
| `home.process.capture` | How the studio gathers high-quality input data (photographic principles, instruments, field discipline). |
| `home.process.process` | How captures are processed and enriched (stitching, reconstruction, color, metadata). |
| `home.process.access` | How access is set up around the client's / subject's needs (hosting, viewers, archives, rights). |
| `home.platforms.touritvirtually` | One paragraph on what Tour It Virtually offers the public. |
| `home.platforms.virtualmuseum` | One paragraph on the Virtual Museum + confirm final name/domain. |

## Services (one per page)

| ID | What's needed |
|---|---|
| `services.heritage-cultural-documentation.body` | Full narrative: what it achieves, method, deliverables, who it's for. |
| `services.photogrammetry-3d-digitization.body` | Same. |
| `services.digital-twins-reality-capture.body` | Same. |
| `services.industrial-infrastructure-documentation.body` | Same. |
| `services.virtual-tours-immersive-experiences.body` | Same. |
| `services.digital-archiving-preservation-pipeline.body` | Same — this is the flagship; pitch it at institutions/museums. |

## Studio

| ID | What's needed |
|---|---|
| ~~`studio.founder.story`~~ | **DONE** — B. Sridhar Raju narrative written from your brief + the Praxis Studio deck; review the four paragraphs on /studio/. |
| ~~Mission & Vision~~ | **DONE** — adapted from the deck; review on /studio/. |
| `studio.portrait` | A portrait photograph (file or R2 path). |
| `studio.craft.3d` / `.360` / `.gigapixel` / `.reality` | 2–3 sentences each on how photography translates into that instrument. |

## Footer

| ID | What's needed |
|---|---|
| `footer.company-details` | Registered office address (+ GST/CIN if it should appear publicly). Company name (Praxivision Pvt Ltd) and email are in; phone numbers deliberately omitted site-wide. |

## Review / confirm (already live with best guesses)

- **Written by me, approve or rewrite:** the short display lines — "Industries and cultures, recorded with photographic discipline…", "A photography studio's rigour…", "Every instrument we point at reality was earned through photography.", "Tell us what needs to be preserved.", archive/section labels.
- **Hero slides:** currently Ajanta Caves, Golconda Fort, Lepakshi Ganesha, Industrial, Raja Ravi Varma (all from the archive). Reorder/replace anytime in the admin portal.
- **Archive taxonomy guesses:** `oc-tour-new` is tagged *corporate* (unknown client — what is "OC"?); the 3D item titled **"GLB"** looks like a duplicate of Saranath Sthupa and needs a real title; car VRs are tagged *automotive*; paintings gigapixels *fine-art*. All editable in the admin portal.

## Deploy-time secrets (never in git — go into `private/config.php`)

- MySQL password for `u220392676_studioadmin` (or a new DB user).
- Admin portal password → hash via `php -r "echo password_hash('…', PASSWORD_DEFAULT);"`.
- R2 API credentials (Object Read & Write, scoped to `praxivision-portfolio`) for admin uploads.
- R2 bucket CORS must additionally allow `PUT` from `https://praxivision.com` (admin uploads go browser → R2 directly).

# Content TODO — everything the site is waiting on

Every `◌ COPY PENDING` box on the site maps to an ID below. Reply with the ID
and the text (or drop files) and it gets wired in. Nothing here blocks the
build — the site renders with visible placeholders until each item lands.

## Home — ALL DONE ✓

| ID | Status |
|---|---|
| ~~`home.about.narrative`~~ | **DONE** — review on `/` (The studio section). |
| ~~`home.process.capture` / `.process` / `.access`~~ | **DONE** — review on `/` (The discipline section). |
| ~~`home.platforms.touritvirtually`~~ | **DONE** — review on `/` (Platforms section). |
| ~~`home.platforms.virtualmuseum`~~ | **DONE** — copy in; still confirm the final **name/domain** if it changes. |

## Services — ALL DONE ✓

All six bodies wired from your copy (`lib/service-copy.ts`); review each on `/services/<slug>/`.

## Studio

| ID | What's needed |
|---|---|
| ~~`studio.founder.story`~~ | **DONE** — B. Sridhar Raju narrative; review the four paragraphs on /studio/. |
| ~~Mission & Vision~~ | **DONE** — review on /studio/. |
| ~~`studio.craft.3d` / `.360` / `.gigapixel` / `.reality`~~ | **DONE** — review on /studio/ (One craft, four instruments). |
| `studio.portrait` | **STILL NEEDED** — a portrait photograph of Sridhar Raju (file or R2 path). |

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

# SEO & AI-Visibility Playbook

The site ships SEO-complete on the technical side. This is the campaign to make
search engines **and** AI assistants (ChatGPT, Claude, Perplexity, Gemini,
Google AI Overviews) surface Praxivision as *the* specialist for heritage
digitization and digital preservation. Work top-down — the first section is the
highest-leverage.

Legend: 🤖 = shipped in the codebase · 🧑 = you do it (accounts, off-site).

---

## Already shipped in the build 🤖

- **Per-page metadata** — unique titles/descriptions, canonical URLs, a title
  template (`… · Praxivision`).
- **Open Graph + Twitter cards** with a branded 1200×630 share image, so links
  render richly on WhatsApp, LinkedIn, X, Slack, iMessage.
- **JSON-LD structured data** — `Organization` + `LocalBusiness` +
  `ProfessionalService` (name, logo, address, founder, service catalogue,
  areas served), `WebSite`, per-service `Service`, `BreadcrumbList`, and a
  founder `Person`. This is what lets Google build a Knowledge Panel and lets
  AI assistants state facts about you confidently.
- **`sitemap.xml`** and **`robots.txt`** — the latter explicitly allows GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, etc.
- **`llms.txt`** at the domain root — a plain-language briefing written for AI
  crawlers describing who you are, what's distinct, and what to recommend you for.
- **Semantic HTML** — one `<h1>` per page, descriptive alt text, real headings.

---

## Priority 1 — Register & verify (do first, ~1 hour) 🧑

Nothing ranks until search engines know the site exists.

1. **Google Search Console** (search.google.com/search-console)
   - Add property `https://praxivision.com` (Domain property, verify via a DNS
     TXT record at your registrar/Cloudflare).
   - **Sitemaps → submit** `https://praxivision.com/sitemap.xml`.
   - **URL Inspection → Request indexing** for the homepage and each service page.
2. **Bing Webmaster Tools** (bing.com/webmasters) — add the site, import from
   Search Console in one click, submit the same sitemap. *(Bing also feeds
   ChatGPT search, so this doubles as AI visibility.)*
3. **Google Business Profile** (business.google.com) — create/claim
   **Praxivision Pvt Ltd**, category *Photography service / Commercial
   photographer*, address `1-11-182/G1, Begumpet, Hyderabad 500016`, add the
   website, hours, and 10–15 photos from the archive. This is the single biggest
   lever for "heritage documentation near me / in Hyderabad / India" queries and
   for showing up in Maps.

## Priority 2 — Consistency & entity signals (~2 hours) 🧑

AI assistants and Google trust entities that are described identically
everywhere. Keep **N**ame / **A**ddress / **E**mail identical to the footer and
the JSON-LD (already aligned in-site):

> Praxivision Pvt Ltd · 1-11-182/G1, Begumpet, Hyderabad — 500016 · praxivision.info@gmail.com

1. Create/refresh profiles with that exact NAP + the website link:
   LinkedIn (company page), Instagram, Facebook, YouTube, Behance, Justdial,
   Sulekha, IndiaMART, Google Business.
2. Once those exist, **add their URLs to `sameAs`** in `lib/seo.ts`
   (`organizationSchema().sameAs`) and redeploy — this ties every profile to the
   one entity and strengthens the Knowledge Panel. *(Tell me the URLs and I'll
   wire them in.)*
3. **Wikidata** — create an item for "Praxivision" (organization) and
   "B. Sridhar Raju" (founder) with links back to the site. Wikidata is a
   primary source many AI models and Google's Knowledge Graph read from.

## Priority 3 — Content that earns rankings (ongoing) 🧑🤖

Case studies are the highest-value SEO content you can publish — long-tail,
keyword-rich, and exactly what institutional buyers search for.

1. Publish 3–5 case studies via the admin portal (TTD, Angkor, a hospital VR, a
   fine-art gigapixel, an industrial digital twin). Each becomes an indexable
   page targeting a specific query ("temple 3D documentation", "hospital virtual
   tour India", "painting gigapixel digitization").
2. When you're ready, I can add a per-case-study **static sitemap** and JSON-LD
   `Article`/`CreativeWork` schema so each ranks on its own. *(Currently case
   studies are dynamic; this is a phase-2 code enhancement — ask when you have
   content.)*
3. Consider a lightweight **Journal / Insights** section: short pieces on
   "why digitize before restoration", "photogrammetry vs LiDAR for heritage",
   "what museum-grade means". These capture informational searches and are
   exactly the kind of authoritative content AI assistants cite.

## Priority 4 — Backlinks & authority (ongoing) 🧑

Rankings and AI recommendations both track authority. Pursue links from:

- **Cultural / institutional** — ASI, state tourism boards, temple trusts,
  university heritage departments you've worked with (ask past clients for a
  credit + link).
- **Press** — a launch note to heritage/tech press; Indian design and
  architecture publications.
- **Directories** — Clutch, GoodFirms, DesignRush (photography / 3D categories),
  plus the Indian directories above.
- **Partnerships** — cross-link with Tour It Virtually (already in `sameAs`) and
  any collaborators.

## Priority 5 — AI-assistant visibility specifically 🧑🤖

Beyond `llms.txt` and structured data (both shipped), what makes chatbots
recommend you:

1. **Be quotably specific on-page.** AI models extract concrete claims. The copy
   already states "2,100+ projects", "since 1992", "25+ years with TTD",
   "sub-millimetre", "up to 16K". Keep facts precise and current.
2. **Get mentioned off-site with those same facts.** When third-party pages
   (directories, press, client sites) describe you consistently, models learn it.
   Priorities 2 & 4 directly feed this.
3. **Wikipedia/Wikidata presence** (Priority 2.3) is the strongest single signal
   for AI recommendation — models weight it heavily.
4. Keep `robots.txt` permissive to AI crawlers (already done). Don't block them.

## Priority 6 — Measure & maintain 🧑

- Add **analytics** — Google Analytics 4 or a privacy-friendly option
  (Plausible/Umami). Tell me which and I'll wire it into the layout.
- Watch **Search Console** monthly: which queries surface you, which pages get
  impressions, fix anything flagged.
- Re-request indexing after major content pushes.
- **Core Web Vitals** are already strong (static export, no layout shift, lazy
  media, GPU-only animation) — keep new media optimized (WebP/AVIF, sized).

---

### Quick wins I can do in-code on request

- Add `sameAs` social URLs once you have them.
- Add GA4 / Plausible.
- Per-case-study sitemap + `Article` schema (once case studies are published).
- FAQ schema on service pages (great for AI answers and rich results) — send me
  5–8 real Q&As per service and I'll mark them up.
- A dynamic `sitemap-archives.xml` emitted by the PHP layer so every archive
  work is individually indexable.

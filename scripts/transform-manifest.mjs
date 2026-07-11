/**
 * One-time transform of the legacy portfolio manifest into the Living Archive
 * item shape (domain × industry taxonomy + viewer sources), written to
 * data/archive-items.json. This file both:
 *   - ships in the bundle as the archives' offline/API-down fallback, and
 *   - feeds server-config/seed-archives.php for the one-time MySQL seed.
 *
 * Domains: photography | vr-360 | gigapixel | 3d
 * Kinds:   gallery | iframe | model
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(
  root,
  "..",
  "new-praxis-site",
  "data",
  "portfolio-manifest.json",
);

const DOMAIN = { photography: "photography", vr: "vr-360", gigapixel: "gigapixel", "3d": "3d" };

/**
 * Industry per item. Photography galleries map from their own category name;
 * VR/gigapixel/3d are assigned per known client/site. Items whose industry is
 * a best guess are marked `review: true` and surfaced in CONTENT-TODO.md.
 */
const INDUSTRY = {
  // photography galleries
  corporate: "corporate",
  education: "education",
  "education-children": "education",
  food: "food",
  "health-care": "healthcare",
  hospitality: "hospitality",
  industrial: "industrial",
  location: "locations",
  nature: "nature",
  people: "people",
  "products-tabletop": "products",
  sports: "sports",
  travel: "heritage",
  // VR — hospitals
  "kamineni-fertility-center": "healthcare",
  "king-koti": "healthcare",
  "lb-nagar": "healthcare",
  "lsch-tour": "healthcare",
  // gigapixels
  "golconda-gigapan": "heritage",
  "golconda-gigapan-heavy": "heritage",
  // 3d — heritage artefacts
  glb: "heritage",
  ganesha: "heritage",
  "lepakshi-ganesha": "heritage",
  "saranath-sthupa": "heritage",
  shakti: "heritage",
  "siva-family": "heritage",
  tara: "heritage",
};

const REVIEW = new Set(["oc-tour-new"]);

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

const items = manifest.works.map((w, i) => {
  let industry = INDUSTRY[w.id];
  if (!industry) {
    if (w.id.startsWith("cars-")) industry = "automotive";
    else if (w.category === "gigapixel") industry = "fine-art";
    else {
      industry = "corporate";
      REVIEW.add(w.id);
    }
  }
  return {
    id: w.id,
    domain: DOMAIN[w.category],
    industry,
    kind: w.kind, // gallery | iframe | model
    title: w.title,
    cover: w.cover || null,
    gallery: w.kind === "gallery" ? w.gallery : undefined,
    src: w.iframeSrc || w.modelSrc || undefined,
    sort: i,
    review: REVIEW.has(w.id) || undefined,
  };
});

writeFileSync(
  join(root, "data", "archive-items.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 1),
);

const byDomain = {};
for (const it of items) byDomain[it.domain] = (byDomain[it.domain] ?? 0) + 1;
console.log(`wrote data/archive-items.json — ${items.length} items`, byDomain);
console.log("industries needing review:", [...REVIEW]);

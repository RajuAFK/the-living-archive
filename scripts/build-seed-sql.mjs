/**
 * Emits server-config/seed.sql — a single file the studio imports via
 * Hostinger phpMyAdmin to create the la_* tables and load the 71 archive
 * items + starter hero slides. No SSH/PHP-CLI needed.
 *
 *   node scripts/build-seed-sql.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const q = (v) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;

const schema = readFileSync(join(root, "server-config", "schema.sql"), "utf-8");
const { items } = JSON.parse(readFileSync(join(root, "data", "archive-items.json"), "utf-8"));
const hero = JSON.parse(readFileSync(join(root, "data", "hero-fallback.json"), "utf-8"));

let out = `-- The Living Archive — one-shot seed for Hostinger phpMyAdmin.
-- Select database u220392676_praxis, then Import this file (or paste into SQL).
-- Idempotent: safe to re-run; archive items upsert by slug, hero only seeds
-- when the table is empty.

${schema}

`;

// remove slugs we dropped, so re-importing over an older seed reconciles
const DROPPED_SLUGS = ["glb", "golconda-gigapan-heavy"];
out += "-- ── remove retired items (safe if they were never imported) ──\n";
out += `DELETE FROM la_archive_items WHERE slug IN (${DROPPED_SLUGS.map(q).join(", ")});\n\n`;

// archive items — upsert by slug
out += "-- ── archive items ──\n";
for (const it of items) {
  const gallery = it.gallery ? JSON.stringify(it.gallery) : null;
  out +=
    `INSERT INTO la_archive_items (slug, domain, industry, kind, title, cover, src, gallery, sort) VALUES (` +
    [q(it.id), q(it.domain), q(it.industry), q(it.kind), q(it.title), q(it.cover ?? null), q(it.src ?? null), q(gallery), it.sort ?? 0].join(", ") +
    `) ON DUPLICATE KEY UPDATE domain=VALUES(domain), industry=VALUES(industry), kind=VALUES(kind), title=VALUES(title), cover=VALUES(cover), src=VALUES(src), gallery=VALUES(gallery), sort=VALUES(sort);\n`;
}

// hero slides — only when empty
out += "\n-- ── hero slides (only if none exist yet) ──\n";
hero.slides.forEach((s, i) => {
  out +=
    `INSERT INTO la_hero_slides (src, label, meta, sort) SELECT ${q(s.src)}, ${q(s.label)}, ${q(s.meta ?? null)}, ${i} ` +
    `WHERE NOT EXISTS (SELECT 1 FROM la_hero_slides);\n`;
});

writeFileSync(join(root, "server-config", "seed.sql"), out);
console.log(`wrote server-config/seed.sql — ${items.length} items, ${hero.slides.length} hero slides`);

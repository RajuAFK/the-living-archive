<?php
/**
 * One-time seed (CLI): imports data/archive-items.json into la_archive_items
 * and data/hero-fallback.json into la_hero_slides. Upserts by slug/src, so
 * re-running refreshes titles/taxonomy without duplicating rows and without
 * touching rows added later through the admin portal.
 *
 * Usage (from the repo root, or on the server after deploy):
 *   LA_CONFIG=/path/to/config.php php server-config/seed-archives.php
 */
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("cli only\n");
}

$configPath = getenv('LA_CONFIG') ?: dirname(__DIR__, 2) . '/private/config.php';
require_once $configPath;

$root = dirname(__DIR__);
$pdo = db();

// schema first (idempotent)
foreach (array_filter(array_map('trim', explode(';', file_get_contents($root . '/server-config/schema.sql')))) as $stmt) {
    if ($stmt !== '' && stripos($stmt, 'CREATE TABLE') !== false) {
        $pdo->exec($stmt);
    }
}

// ——— archive items ———
$data = json_decode(file_get_contents($root . '/data/archive-items.json'), true);
$up = $pdo->prepare(
    'INSERT INTO la_archive_items (slug, domain, industry, kind, title, cover, src, gallery, sort)
     VALUES (:slug, :domain, :industry, :kind, :title, :cover, :src, :gallery, :sort)
     ON DUPLICATE KEY UPDATE
       domain = VALUES(domain), industry = VALUES(industry), kind = VALUES(kind),
       title = VALUES(title), cover = VALUES(cover), src = VALUES(src),
       gallery = VALUES(gallery), sort = VALUES(sort)'
);
$n = 0;
foreach ($data['items'] as $it) {
    $up->execute([
        ':slug'     => $it['id'],
        ':domain'   => $it['domain'],
        ':industry' => $it['industry'],
        ':kind'     => $it['kind'],
        ':title'    => $it['title'],
        ':cover'    => $it['cover'] ?? null,
        ':src'      => $it['src'] ?? null,
        ':gallery'  => isset($it['gallery']) ? json_encode($it['gallery'], JSON_UNESCAPED_SLASHES) : null,
        ':sort'     => $it['sort'] ?? 0,
    ]);
    $n++;
}
echo "archive items upserted: $n\n";

// ——— hero slides (only when the table is empty — admin owns it after that) ———
$count = (int)$pdo->query('SELECT COUNT(*) FROM la_hero_slides')->fetchColumn();
if ($count === 0) {
    $hero = json_decode(file_get_contents($root . '/data/hero-fallback.json'), true);
    $ins = $pdo->prepare(
        'INSERT INTO la_hero_slides (src, label, meta, sort) VALUES (?, ?, ?, ?)'
    );
    foreach ($hero['slides'] as $i => $s) {
        $ins->execute([$s['src'], $s['label'], $s['meta'] ?? null, $i]);
    }
    echo 'hero slides inserted: ' . count($hero['slides']) . "\n";
} else {
    echo "hero slides: table not empty, skipped\n";
}

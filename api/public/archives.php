<?php
/**
 * GET /api/public/archives.php?domain=&industry=&q=
 *
 * Published archive items, ordered. All filters optional:
 *   domain   — photography | vr-360 | gigapixel | 3d
 *   industry — taxonomy slug (healthcare, heritage, …)
 *   q        — case-insensitive title match
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/api.php';

try {
    require_method('GET');

    $where = ['published = 1'];
    $args = [];

    $domain = trim((string)($_GET['domain'] ?? ''));
    if ($domain !== '' && preg_match('/^[a-z0-9-]{1,20}$/', $domain)) {
        $where[] = 'domain = ?';
        $args[] = $domain;
    }
    $industry = trim((string)($_GET['industry'] ?? ''));
    if ($industry !== '' && preg_match('/^[a-z0-9-]{1,40}$/', $industry)) {
        $where[] = 'industry = ?';
        $args[] = $industry;
    }
    $q = trim((string)($_GET['q'] ?? ''));
    if ($q !== '' && mb_strlen($q) <= 80) {
        $where[] = 'title LIKE ?';
        $args[] = '%' . $q . '%';
    }

    $stmt = db()->prepare(
        'SELECT slug, domain, industry, kind, title, cover, src, gallery
         FROM la_archive_items
         WHERE ' . implode(' AND ', $where) . '
         ORDER BY sort ASC, id ASC'
    );
    $stmt->execute($args);

    $items = [];
    foreach ($stmt as $row) {
        $items[] = [
            'id'       => $row['slug'],
            'domain'   => $row['domain'],
            'industry' => $row['industry'],
            'kind'     => $row['kind'],
            'title'    => $row['title'],
            'cover'    => $row['cover'],
            'src'      => $row['src'],
            'gallery'  => $row['gallery'] !== null ? json_decode($row['gallery'], true) : null,
        ];
    }

    json_ok(['items' => $items]);
} catch (Throwable $e) {
    error_log('[la-archives] ' . $e->getMessage());
    json_err('internal error', 500);
}

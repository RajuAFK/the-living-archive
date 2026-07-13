<?php
/**
 * GET /api/public/case-studies.php          — published summaries, ordered
 * GET /api/public/case-studies.php?slug=…   — one full study incl. blocks
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/api.php';

try {
    require_method('GET');

    $slug = trim((string)($_GET['slug'] ?? ''));

    // Draft preview for logged-in admins (?preview=1 rides the session cookie).
    $includeDrafts = false;
    if (!empty($_GET['preview'])) {
        require_once __DIR__ . '/../lib/admin-auth.php';
        $includeDrafts = admin_logged_in();
    }

    if ($slug !== '') {
        if (!preg_match('/^[a-z0-9-]{1,140}$/', $slug)) {
            json_err('invalid slug', 422);
        }
        $stmt = db()->prepare(
            "SELECT slug, title, client, year, intro, cover, blocks
             FROM la_case_studies WHERE slug = ?"
             . ($includeDrafts ? '' : " AND status = 'published'")
        );
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) {
            json_err('not found', 404);
        }
        $row['blocks'] = $row['blocks'] !== null ? json_decode($row['blocks'], true) : [];
        json_ok(['study' => $row]);
    }

    $stmt = db()->query(
        "SELECT slug, title, client, year, intro, cover
         FROM la_case_studies WHERE status = 'published'
         ORDER BY sort ASC, id DESC"
    );
    json_ok(['studies' => $stmt->fetchAll()]);
} catch (Throwable $e) {
    error_log('[la-case-studies] ' . $e->getMessage());
    json_err('internal error', 500);
}

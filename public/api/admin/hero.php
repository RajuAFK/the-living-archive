<?php
/**
 * /api/admin/hero.php — hero slide management
 *   GET               → all slides (incl. inactive), ordered
 *   POST              → create { src, label, meta? }
 *   POST ?action=reorder → { ids: [id, …] } sets sort by position
 *   PUT               → update { id, src?, label?, meta?, active? }
 *   DELETE            → { id }
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

try {
    require_admin();
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $rows = $pdo->query(
            'SELECT id, src, label, meta, sort, active FROM la_hero_slides ORDER BY sort ASC, id ASC'
        )->fetchAll();
        json_ok(['slides' => $rows]);
    }

    $body = read_body();

    if ($method === 'POST' && ($_GET['action'] ?? '') === 'reorder') {
        $ids = $body['ids'] ?? [];
        if (!is_array($ids) || $ids === []) json_err('ids required', 422);
        $stmt = $pdo->prepare('UPDATE la_hero_slides SET sort = ? WHERE id = ?');
        foreach (array_values($ids) as $i => $id) {
            $stmt->execute([$i, (int)$id]);
        }
        json_ok([]);
    }

    if ($method === 'POST') {
        $src = trim((string)($body['src'] ?? ''));
        $label = trim((string)($body['label'] ?? ''));
        if ($src === '' || mb_strlen($src) > 500) json_err('src required', 422);
        if ($label === '' || mb_strlen($label) > 200) json_err('label required', 422);
        $meta = trim((string)($body['meta'] ?? ''));
        $sort = (int)$pdo->query('SELECT COALESCE(MAX(sort)+1,0) FROM la_hero_slides')->fetchColumn();
        $pdo->prepare('INSERT INTO la_hero_slides (src, label, meta, sort) VALUES (?, ?, ?, ?)')
            ->execute([$src, $label, $meta !== '' ? $meta : null, $sort]);
        json_ok(['id' => (int)$pdo->lastInsertId()]);
    }

    if ($method === 'PUT') {
        $id = (int)($body['id'] ?? 0);
        if ($id < 1) json_err('id required', 422);
        $fields = [];
        $args = [];
        foreach (['src' => 500, 'label' => 200, 'meta' => 200] as $f => $max) {
            if (array_key_exists($f, $body)) {
                $v = trim((string)$body[$f]);
                if (mb_strlen($v) > $max) json_err("$f too long", 422);
                $fields[] = "$f = ?";
                $args[] = $v !== '' ? $v : null;
            }
        }
        if (array_key_exists('active', $body)) {
            $fields[] = 'active = ?';
            $args[] = !empty($body['active']) ? 1 : 0;
        }
        if ($fields === []) json_err('nothing to update', 422);
        $args[] = $id;
        $pdo->prepare('UPDATE la_hero_slides SET ' . implode(', ', $fields) . ' WHERE id = ?')
            ->execute($args);
        json_ok([]);
    }

    if ($method === 'DELETE') {
        $id = (int)($body['id'] ?? 0);
        if ($id < 1) json_err('id required', 422);
        $pdo->prepare('DELETE FROM la_hero_slides WHERE id = ?')->execute([$id]);
        json_ok([]);
    }

    json_err('method not allowed', 405);
} catch (Throwable $e) {
    error_log('[la-admin-hero] ' . $e->getMessage());
    json_err('internal error', 500);
}

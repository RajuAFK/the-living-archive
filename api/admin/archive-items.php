<?php
/**
 * /api/admin/archive-items.php — archive metadata CRUD
 *   GET      → all items (incl. unpublished)
 *   POST     → create { slug, domain, industry, kind, title, cover?, src?, gallery? }
 *   PUT      → update { id, …fields, published? }
 *   DELETE   → { id }
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

const LA_DOMAINS = ['photography', 'vr-360', 'gigapixel', '3d'];
const LA_KINDS = ['gallery', 'iframe', 'model'];

function validate_item(array $body, bool $creating): array {
    $out = [];
    if ($creating || array_key_exists('slug', $body)) {
        $slug = strtolower(trim((string)($body['slug'] ?? '')));
        if (!preg_match('/^[a-z0-9-]{1,120}$/', $slug)) json_err('bad slug', 422);
        $out['slug'] = $slug;
    }
    if ($creating || array_key_exists('domain', $body)) {
        $v = (string)($body['domain'] ?? '');
        if (!in_array($v, LA_DOMAINS, true)) json_err('bad domain', 422);
        $out['domain'] = $v;
    }
    if ($creating || array_key_exists('industry', $body)) {
        $v = strtolower(trim((string)($body['industry'] ?? '')));
        if (!preg_match('/^[a-z0-9-]{1,40}$/', $v)) json_err('bad industry', 422);
        $out['industry'] = $v;
    }
    if ($creating || array_key_exists('kind', $body)) {
        $v = (string)($body['kind'] ?? '');
        if (!in_array($v, LA_KINDS, true)) json_err('bad kind', 422);
        $out['kind'] = $v;
    }
    if ($creating || array_key_exists('title', $body)) {
        $v = trim((string)($body['title'] ?? ''));
        if ($v === '' || mb_strlen($v) > 200) json_err('title required', 422);
        $out['title'] = $v;
    }
    foreach (['cover' => 500, 'src' => 500] as $f => $max) {
        if (array_key_exists($f, $body)) {
            $v = trim((string)$body[$f]);
            if (mb_strlen($v) > $max) json_err("$f too long", 422);
            $out[$f] = $v !== '' ? $v : null;
        }
    }
    if (array_key_exists('gallery', $body)) {
        if ($body['gallery'] === null || $body['gallery'] === []) {
            $out['gallery'] = null;
        } elseif (is_array($body['gallery'])) {
            $out['gallery'] = json_encode(array_values($body['gallery']), JSON_UNESCAPED_SLASHES);
        } else {
            json_err('gallery must be an array', 422);
        }
    }
    if (array_key_exists('sort', $body)) $out['sort'] = (int)$body['sort'];
    if (array_key_exists('published', $body)) $out['published'] = !empty($body['published']) ? 1 : 0;
    return $out;
}

try {
    require_admin();
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $rows = $pdo->query('SELECT * FROM la_archive_items ORDER BY sort ASC, id ASC')->fetchAll();
        foreach ($rows as &$r) {
            $r['gallery'] = $r['gallery'] !== null ? json_decode($r['gallery'], true) : null;
        }
        json_ok(['items' => $rows]);
    }

    $body = read_body();

    if ($method === 'POST') {
        $data = validate_item($body, true);
        if (!array_key_exists('sort', $data)) {
            $data['sort'] = (int)$pdo->query('SELECT COALESCE(MAX(sort)+1,0) FROM la_archive_items')->fetchColumn();
        }
        $cols = array_keys($data);
        $stmt = $pdo->prepare(
            'INSERT INTO la_archive_items (' . implode(', ', $cols) . ')
             VALUES (' . implode(', ', array_fill(0, count($cols), '?')) . ')'
        );
        try {
            $stmt->execute(array_values($data));
        } catch (PDOException $e) {
            if ((string)$e->getCode() === '23000') json_err('slug already exists', 409);
            throw $e;
        }
        json_ok(['id' => (int)$pdo->lastInsertId()]);
    }

    if ($method === 'PUT') {
        $id = (int)($body['id'] ?? 0);
        if ($id < 1) json_err('id required', 422);
        $data = validate_item($body, false);
        if ($data === []) json_err('nothing to update', 422);
        $set = implode(', ', array_map(fn($c) => "$c = ?", array_keys($data)));
        try {
            $pdo->prepare("UPDATE la_archive_items SET $set WHERE id = ?")
                ->execute([...array_values($data), $id]);
        } catch (PDOException $e) {
            if ((string)$e->getCode() === '23000') json_err('slug already exists', 409);
            throw $e;
        }
        json_ok([]);
    }

    if ($method === 'DELETE') {
        $id = (int)($body['id'] ?? 0);
        if ($id < 1) json_err('id required', 422);
        $pdo->prepare('DELETE FROM la_archive_items WHERE id = ?')->execute([$id]);
        json_ok([]);
    }

    json_err('method not allowed', 405);
} catch (Throwable $e) {
    error_log('[la-admin-items] ' . $e->getMessage());
    json_err('internal error', 500);
}

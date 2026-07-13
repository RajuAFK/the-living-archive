<?php
/**
 * /api/admin/case-studies.php — case-study CRUD (block documents)
 *   GET            → all studies (summaries incl. drafts)
 *   GET ?id=       → one full study incl. blocks
 *   POST           → create { slug, title, … , blocks: [] }
 *   PUT            → update { id, …any fields }
 *   DELETE         → { id }
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

const CS_FIELDS = ['slug', 'title', 'client', 'year', 'intro', 'cover', 'status'];

function validate_cs(array $body, bool $creating): array {
    $out = [];
    if ($creating || array_key_exists('slug', $body)) {
        $slug = strtolower(trim((string)($body['slug'] ?? '')));
        if (!preg_match('/^[a-z0-9-]{1,140}$/', $slug)) {
            json_err('slug must be lowercase letters, digits, hyphens', 422);
        }
        if ($slug === 'view') json_err('reserved slug', 422);
        $out['slug'] = $slug;
    }
    if ($creating || array_key_exists('title', $body)) {
        $title = trim((string)($body['title'] ?? ''));
        if ($title === '' || mb_strlen($title) > 240) json_err('title required', 422);
        $out['title'] = $title;
    }
    foreach (['client' => 200, 'year' => 20, 'cover' => 500] as $f => $max) {
        if (array_key_exists($f, $body)) {
            $v = trim((string)$body[$f]);
            if (mb_strlen($v) > $max) json_err("$f too long", 422);
            $out[$f] = $v !== '' ? $v : null;
        }
    }
    if (array_key_exists('intro', $body)) {
        $v = trim((string)$body['intro']);
        if (mb_strlen($v) > 2000) json_err('intro too long', 422);
        $out['intro'] = $v !== '' ? $v : null;
    }
    if (array_key_exists('status', $body)) {
        $v = (string)$body['status'];
        if (!in_array($v, ['draft', 'published'], true)) json_err('bad status', 422);
        $out['status'] = $v;
    }
    if (array_key_exists('sort', $body)) {
        $out['sort'] = (int)$body['sort'];
    }
    if (array_key_exists('blocks', $body)) {
        if (!is_array($body['blocks'])) json_err('blocks must be an array', 422);
        $out['blocks'] = json_encode($body['blocks'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (strlen($out['blocks']) > 4_000_000) json_err('blocks too large', 422);
    }
    return $out;
}

try {
    require_admin();
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id > 0) {
            $stmt = $pdo->prepare('SELECT * FROM la_case_studies WHERE id = ?');
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) json_err('not found', 404);
            $row['blocks'] = $row['blocks'] !== null ? json_decode($row['blocks'], true) : [];
            json_ok(['study' => $row]);
        }
        $rows = $pdo->query(
            'SELECT id, slug, status, title, client, year, cover, sort, updated_at
             FROM la_case_studies ORDER BY sort ASC, id DESC'
        )->fetchAll();
        json_ok(['studies' => $rows]);
    }

    $body = read_body();

    if ($method === 'POST') {
        $data = validate_cs($body, true);
        $data += ['blocks' => $data['blocks'] ?? '[]', 'status' => $data['status'] ?? 'draft'];
        $cols = array_keys($data);
        $stmt = $pdo->prepare(
            'INSERT INTO la_case_studies (' . implode(', ', $cols) . ')
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
        $data = validate_cs($body, false);
        if ($data === []) json_err('nothing to update', 422);
        $set = implode(', ', array_map(fn($c) => "$c = ?", array_keys($data)));
        try {
            $pdo->prepare("UPDATE la_case_studies SET $set WHERE id = ?")
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
        $pdo->prepare('DELETE FROM la_case_studies WHERE id = ?')->execute([$id]);
        json_ok([]);
    }

    json_err('method not allowed', 405);
} catch (Throwable $e) {
    error_log('[la-admin-cs] ' . $e->getMessage());
    json_err('internal error', 500);
}

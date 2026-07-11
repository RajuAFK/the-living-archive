<?php
/**
 * POST /api/admin/upload.php  { filename, folder? }
 * → { ok, upload_url, public_url, path }
 *
 * Presigns a direct-to-R2 PUT for the admin browser. New media lands under
 * uploads/<yyyy>/<mm>/ (or uploads/<folder>/), never overwriting the legacy
 * /portfolio tree. `path` is the site-relative media path to store in the DB.
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';
require_once __DIR__ . '/../lib/r2.php';

try {
    require_method('POST');
    require_admin();

    $body = read_body();
    $filename = (string)($body['filename'] ?? '');
    $folder = (string)($body['folder'] ?? '');

    // sanitize: keep extension, slugify the stem
    if (!preg_match('/^(.+)\.([A-Za-z0-9]{2,5})$/', $filename, $m)) {
        json_err('filename needs an extension', 422);
    }
    $ext = strtolower($m[2]);
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'glb', 'html', 'mp4', 'pdf'];
    if (!in_array($ext, $allowed, true)) {
        json_err('file type not allowed: .' . $ext, 422);
    }
    $stem = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $m[1]));
    $stem = trim(substr($stem, 0, 80), '-') ?: 'file';

    $folder = strtolower(preg_replace('/[^a-z0-9\/_-]+/i', '-', $folder));
    $folder = trim($folder, "/-");
    $prefix = $folder !== '' ? "uploads/$folder" : 'uploads/' . gmdate('Y/m');

    $key = "$prefix/$stem-" . substr(bin2hex(random_bytes(4)), 0, 6) . ".$ext";

    $signed = r2_presign_put($key, 900);
    json_ok([
        'upload_url' => $signed['upload_url'],
        'public_url' => $signed['public_url'],
        'path'       => '/' . $key,
    ]);
} catch (Throwable $e) {
    error_log('[la-admin-upload] ' . $e->getMessage());
    json_err('internal error', 500);
}

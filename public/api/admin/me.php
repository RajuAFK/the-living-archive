<?php
/** GET /api/admin/me.php → { ok, authed, csrf? } — session probe for the portal. */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

try {
    require_method('GET');
    if (admin_logged_in()) {
        json_ok(['authed' => true, 'csrf' => $_SESSION['la_csrf'] ?? '']);
    }
    json_ok(['authed' => false]);
} catch (Throwable $e) {
    error_log('[la-admin-me] ' . $e->getMessage());
    json_err('internal error', 500);
}

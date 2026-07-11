<?php
/** POST /api/admin/logout.php */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

try {
    require_method('POST');
    admin_session_start();
    $_SESSION = [];
    session_destroy();
    json_ok([]);
} catch (Throwable $e) {
    error_log('[la-admin-logout] ' . $e->getMessage());
    json_err('internal error', 500);
}

<?php
/** GET /api/admin/inquiries.php — latest 200 contact form submissions. */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

try {
    require_method('GET');
    require_admin();

    $rows = db()->query(
        'SELECT id, name, email, phone, message, emailed_at, created_at
         FROM la_inquiries ORDER BY id DESC LIMIT 200'
    )->fetchAll();
    json_ok(['inquiries' => $rows]);
} catch (Throwable $e) {
    error_log('[la-admin-inquiries] ' . $e->getMessage());
    json_err('internal error', 500);
}

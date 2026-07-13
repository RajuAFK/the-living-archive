<?php
/**
 * GET /api/admin/inquiries.php — latest 200 contact form submissions.
 * Reads `contact_inquiries` — the same table the previous site used, so
 * historical inquiries appear alongside new ones (old rows have `subject`,
 * new rows have `phone`).
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

try {
    require_method('GET');
    require_admin();

    $pdo = db();
    ensure_contact_table($pdo);

    $rows = $pdo->query(
        'SELECT id, name, email, phone, subject, message, emailed_at, created_at
         FROM contact_inquiries ORDER BY id DESC LIMIT 200'
    )->fetchAll();
    json_ok(['inquiries' => $rows]);
} catch (Throwable $e) {
    error_log('[la-admin-inquiries] ' . $e->getMessage());
    json_err('internal error', 500);
}

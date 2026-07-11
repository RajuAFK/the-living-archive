<?php
/** POST /api/admin/login.php  { password } → { ok, csrf } */
declare(strict_types=1);

require_once __DIR__ . '/../lib/admin-auth.php';

try {
    require_method('POST');
    admin_session_start();

    $pdo = db();
    $ip = client_ip();
    if (login_rate_limited($pdo, $ip)) {
        json_err('too many attempts — try again in 15 minutes', 429);
    }

    $password = (string)(read_body()['password'] ?? '');
    $ok = $password !== '' && password_verify($password, ADMIN_PASSWORD_HASH);
    record_login_attempt($pdo, $ip, $ok);

    if (!$ok) {
        json_err('wrong password', 401);
    }

    session_regenerate_id(true);
    $_SESSION['la_admin'] = true;
    $_SESSION['la_csrf'] = bin2hex(random_bytes(32));

    json_ok(['csrf' => $_SESSION['la_csrf']]);
} catch (Throwable $e) {
    error_log('[la-admin-login] ' . $e->getMessage());
    json_err('internal error', 500);
}

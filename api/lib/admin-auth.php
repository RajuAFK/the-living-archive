<?php
/**
 * Admin session + login rate limiting. Single admin password
 * (ADMIN_PASSWORD_HASH in private config), PHP session cookie,
 * CSRF token required on every mutating request.
 */
declare(strict_types=1);

require_once __DIR__ . '/api.php';

function admin_session_start(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('la_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function admin_logged_in(): bool {
    admin_session_start();
    return !empty($_SESSION['la_admin']);
}

/** 401 unless logged in; CSRF-checks any non-GET request. */
function require_admin(): void {
    if (!admin_logged_in()) {
        json_err('unauthorized', 401);
    }
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        $sent = $_SERVER['HTTP_X_CSRF'] ?? '';
        if ($sent === '' || !hash_equals($_SESSION['la_csrf'] ?? '', $sent)) {
            json_err('csrf check failed', 403);
        }
    }
}

/** Max 8 failed attempts per IP per 15 minutes. */
function login_rate_limited(PDO $pdo, ?string $ip): bool {
    if ($ip === null) return false;
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS la_login_attempts (
            id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            ip           VARCHAR(45)  NOT NULL,
            succeeded    TINYINT(1)   NOT NULL DEFAULT 0,
            attempted_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_ip_time (ip, attempted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM la_login_attempts
         WHERE ip = ? AND succeeded = 0 AND attempted_at > (NOW() - INTERVAL 15 MINUTE)'
    );
    $stmt->execute([$ip]);
    return (int)$stmt->fetchColumn() >= 8;
}

function record_login_attempt(PDO $pdo, ?string $ip, bool $ok): void {
    if ($ip === null) return;
    $pdo->prepare('INSERT INTO la_login_attempts (ip, succeeded) VALUES (?, ?)')
        ->execute([$ip, $ok ? 1 : 0]);
}

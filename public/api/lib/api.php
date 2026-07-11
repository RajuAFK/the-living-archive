<?php
/**
 * Shared bootstrap for all public/admin JSON endpoints.
 *
 * Loads the off-webroot config (DB credentials, admin password hash, R2
 * keys, contact addresses) and provides the small helper vocabulary every
 * endpoint uses. Deployed layout:
 *
 *   /home/u220392676/domains/praxivision.com/
 *   ├── public_html/api/lib/api.php      ← this file
 *   └── private/config.php               ← secrets, never in git
 *
 * For local development, set the LA_CONFIG environment variable to a
 * config.php path (see server-config/config.example.php).
 */
declare(strict_types=1);

$configPath = getenv('LA_CONFIG') ?: dirname(__DIR__, 3) . '/private/config.php';
require_once $configPath;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function json_ok(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => true] + $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_err(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

function read_body(): array {
    if (!empty($_POST)) return $_POST;
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function client_ip(): ?string {
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? null;
    if (is_string($ip) && strpos($ip, ',') !== false) {
        $ip = trim(explode(',', $ip)[0]);
    }
    return is_string($ip) && $ip !== '' ? substr($ip, 0, 45) : null;
}

function require_method(string $method): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        json_err('method not allowed', 405);
    }
}

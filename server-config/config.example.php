<?php
/**
 * Server configuration TEMPLATE for The Living Archive (praxivision.com).
 *
 * Deploy the real copy (with actual secrets) OFF-WEBROOT at:
 *   /home/u220392676/domains/praxivision.com/private/config.php
 *
 * The gitignored working copy for staging values lives next to this file
 * as server-config/config.php. Never commit real credentials.
 */
declare(strict_types=1);

// ——— MySQL ———————————————————————————————————————————————
const DB_HOST = '127.0.0.1';
const DB_NAME = 'u220392676_praxis';
const DB_USER = 'u220392676_studioadmin';
const DB_PASS = 'CHANGE-ME';

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    }
    return $pdo;
}

// ——— Contact form delivery ———————————————————————————————
const CONTACT_TO        = 'praxivision.info@gmail.com';
const CONTACT_FROM      = 'noreply@praxivision.com';
const CONTACT_FROM_NAME = 'Praxivision';

// ——— Admin portal ————————————————————————————————————————
// Generate with:  php -r "echo password_hash('your-password', PASSWORD_DEFAULT), PHP_EOL;"
const ADMIN_PASSWORD_HASH = 'CHANGE-ME';

// ——— Cloudflare R2 (admin uploads) ———————————————————————
const R2_ACCOUNT_ID = 'CHANGE-ME';
const R2_ACCESS_KEY = 'CHANGE-ME';
const R2_SECRET_KEY = 'CHANGE-ME';
const R2_BUCKET     = 'praxivision-portfolio';
const R2_PUBLIC_BASE = 'https://pub-b6df9c86ce26430caf9d07b91b02796f.r2.dev';

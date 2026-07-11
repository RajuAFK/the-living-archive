<?php
/**
 * POST /api/public/contact.php
 *
 * Body (JSON or form): { name, email, phone?, message, website? }
 *   `website` is a honeypot — real users never fill it.
 *
 * Stores the inquiry in `contact_inquiries` — the SAME table the previous
 * praxivision.com used (history stays unified) — and emails it to CONTACT_TO.
 * The DB row is the source of truth: a mail() failure is logged but never
 * fails the request.
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/api.php';

try {
    require_method('POST');

    $body = read_body();

    // Honeypot — pretend success, store nothing.
    if (trim((string)($body['website'] ?? '')) !== '') {
        json_ok([]);
    }

    $name    = trim((string)($body['name']    ?? ''));
    $email   = trim((string)($body['email']   ?? ''));
    $phone   = trim((string)($body['phone']   ?? ''));
    $message = trim((string)($body['message'] ?? ''));

    if ($name === '' || mb_strlen($name) > 120) {
        json_err('invalid name', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
        json_err('invalid email', 422);
    }
    if (mb_strlen($phone) > 40) {
        json_err('invalid phone', 422);
    }
    if ($message === '' || mb_strlen($message) > 5000) {
        json_err('invalid message', 422);
    }

    $ip = client_ip();
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? null;
    if (is_string($ua) && mb_strlen($ua) > 255) {
        $ua = mb_substr($ua, 0, 255);
    }

    $pdo = db();

    // Same table + delivery as the previous praxivision.com contact form
    // (proven live): inquiry history stays in one place.
    ensure_contact_table($pdo);

    // Per-IP rate limit: max 5 inquiries per rolling hour.
    if ($ip !== null) {
        $stmt = $pdo->prepare(
            'SELECT COUNT(*) FROM contact_inquiries
             WHERE ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)'
        );
        $stmt->execute([$ip]);
        if ((int)$stmt->fetchColumn() >= 5) {
            json_err('too many requests — please try again later', 429);
        }
    }

    $stmt = $pdo->prepare(
        'INSERT INTO contact_inquiries (name, email, phone, message, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$name, $email, $phone !== '' ? $phone : null, $message, $ip, $ua]);
    $id = (int)$pdo->lastInsertId();

    // Notification email. Sender is domain-matched (Hostinger SPF); the
    // visitor goes in Reply-To so a plain "Reply" in Gmail reaches them.
    $mailSubject = 'New inquiry — ' . $name;
    $mailBody = implode("\r\n", [
        'New contact form inquiry on praxivision.com',
        '',
        'Name:  ' . $name,
        'Email: ' . $email,
        'Phone: ' . ($phone !== '' ? $phone : '(none)'),
        '',
        'Message:',
        $message,
        '',
        '—',
        'Inquiry #' . $id,
        'Received: ' . date('Y-m-d H:i:s T'),
        'IP: ' . ($ip ?? 'unknown'),
    ]);
    // Strip CR/LF from user-derived header values (header-injection guard).
    $replyName = preg_replace('/[\r\n]+/', ' ', $name);
    $headers = implode("\r\n", [
        'From: ' . CONTACT_FROM_NAME . ' <' . CONTACT_FROM . '>',
        'Reply-To: ' . $replyName . ' <' . $email . '>',
        'Content-Type: text/plain; charset=utf-8',
    ]);

    $sent = @mail(CONTACT_TO, $mailSubject, $mailBody, $headers);
    if ($sent) {
        $pdo->prepare('UPDATE contact_inquiries SET emailed_at = NOW() WHERE id = ?')
            ->execute([$id]);
    } else {
        error_log('[la-contact] mail() failed for inquiry #' . $id);
    }

    json_ok([]);
} catch (Throwable $e) {
    error_log('[la-contact] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    json_err('internal error', 500);
}

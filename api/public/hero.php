<?php
/**
 * GET /api/public/hero.php — active hero slides in admin-defined order.
 */
declare(strict_types=1);

require_once __DIR__ . '/../lib/api.php';

try {
    require_method('GET');

    $stmt = db()->query(
        'SELECT id, src, label, meta FROM la_hero_slides
         WHERE active = 1 ORDER BY sort ASC, id ASC'
    );

    $slides = [];
    foreach ($stmt as $row) {
        $slides[] = [
            'id'    => 'slide-' . $row['id'],
            'src'   => $row['src'],
            'label' => $row['label'],
            'meta'  => $row['meta'] ?? '',
        ];
    }

    json_ok(['slides' => $slides]);
} catch (Throwable $e) {
    error_log('[la-hero] ' . $e->getMessage());
    json_err('internal error', 500);
}

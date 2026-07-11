-- The Living Archive — MySQL schema (database u220392676_praxis, tables la_*)
-- Idempotent: safe to run repeatedly. utf8mb4 throughout.

CREATE TABLE IF NOT EXISTS la_archive_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(120)  NOT NULL UNIQUE,
    domain      VARCHAR(20)   NOT NULL,           -- photography | vr-360 | gigapixel | 3d
    industry    VARCHAR(40)   NOT NULL,           -- healthcare | heritage | hospitality | …
    kind        VARCHAR(10)   NOT NULL,           -- gallery | iframe | model
    title       VARCHAR(200)  NOT NULL,
    cover       VARCHAR(500)  NULL,               -- media path (/portfolio/…) or full URL
    src         VARCHAR(500)  NULL,               -- iframe html / .glb (iframe & model kinds)
    gallery     MEDIUMTEXT    NULL,               -- JSON array of media paths (gallery kind)
    sort        INT           NOT NULL DEFAULT 0,
    published   TINYINT(1)    NOT NULL DEFAULT 1,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_domain (domain),
    KEY idx_industry (industry),
    KEY idx_pub_sort (published, sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS la_hero_slides (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    src         VARCHAR(500)  NOT NULL,           -- media path or full URL
    label       VARCHAR(200)  NOT NULL,
    meta        VARCHAR(200)  NULL,               -- small qualifier line
    sort        INT           NOT NULL DEFAULT 0,
    active      TINYINT(1)    NOT NULL DEFAULT 1,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_active_sort (active, sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS la_case_studies (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(140)  NOT NULL UNIQUE,
    status      VARCHAR(10)   NOT NULL DEFAULT 'draft',   -- draft | published
    title       VARCHAR(240)  NOT NULL,
    client      VARCHAR(200)  NULL,
    year        VARCHAR(20)   NULL,
    intro       TEXT          NULL,
    cover       VARCHAR(500)  NULL,
    blocks      LONGTEXT      NULL,               -- JSON: ordered content blocks
    sort        INT           NOT NULL DEFAULT 0,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_status_sort (status, sort)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The contact form reuses the previous site's `contact_inquiries` table
-- (already live in this database); api/public/contact.php ensures it exists
-- and adds the `phone` column on first use. Nothing to create here.

CREATE TABLE IF NOT EXISTS la_login_attempts (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip           VARCHAR(45)  NOT NULL,
    succeeded    TINYINT(1)   NOT NULL DEFAULT 0,
    attempted_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_ip_time (ip, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

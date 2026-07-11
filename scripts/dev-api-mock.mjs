/**
 * Dev-only mock of the PHP API (port 3013) so the frontend and the admin
 * portal can be exercised without PHP/MySQL. Mirrors the JSON contracts of
 * public/api/**. `next dev` proxies /api/* here (see next.config.ts), and
 * /admin/ serves the real admin index.php markup (its PHP prelude is only
 * a comment, so browsers render it fine).
 *
 *   node scripts/dev-api-mock.mjs     → http://localhost:3013
 *   admin password: test
 */
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 3013;

// ——— in-memory state ———
const archive = JSON.parse(readFileSync(join(root, "data/archive-items.json"), "utf-8"))
  .items.map((it, i) => ({ id: i + 1, published: 1, sort: it.sort ?? i, ...it, slug: it.id }));
const heroSeed = JSON.parse(readFileSync(join(root, "data/hero-fallback.json"), "utf-8"));
let heroSlides = heroSeed.slides.map((s, i) => ({ id: i + 1, src: s.src, label: s.label, meta: s.meta, sort: i, active: 1 }));
let caseStudies = [];
let inquiries = [];
let nextId = 1000;
let authed = false;
const CSRF = "mock-csrf-token";

const json = (res, code, obj) =>
  res.writeHead(code, { "Content-Type": "application/json" }).end(JSON.stringify(obj));
const ok = (res, obj = {}) => json(res, 200, { ok: true, ...obj });
const err = (res, code, m) => json(res, code, { ok: false, error: m });

async function body(req) {
  let data = "";
  for await (const c of req) data += c;
  try { return JSON.parse(data || "{}"); } catch { return {}; }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;
  const method = req.method;

  // admin portal markup
  if (p === "/admin" || p === "/admin/" || p === "/admin/index.php") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(readFileSync(join(root, "public/admin/index.php")));
  }

  // fake R2 upload target
  if (p === "/mock-upload" && method === "PUT") {
    req.resume();
    return req.on("end", () => res.writeHead(200).end());
  }

  const b = ["POST", "PUT", "DELETE"].includes(method) ? await body(req) : {};
  const guard = () => {
    if (!authed) { err(res, 401, "unauthorized"); return false; }
    if (method !== "GET" && req.headers["x-csrf"] !== CSRF) { err(res, 403, "csrf check failed"); return false; }
    return true;
  };

  switch (true) {
    // ——— public ———
    case p === "/api/public/hero.php":
      return ok(res, { slides: heroSlides.filter((s) => s.active).sort((a, b) => a.sort - b.sort) });

    case p === "/api/public/archives.php": {
      let items = archive.filter((it) => it.published);
      const d = url.searchParams.get("domain"), ind = url.searchParams.get("industry"), q = url.searchParams.get("q");
      if (d) items = items.filter((it) => it.domain === d);
      if (ind) items = items.filter((it) => it.industry === ind);
      if (q) items = items.filter((it) => it.title.toLowerCase().includes(q.toLowerCase()));
      // mirror the PHP contract: public `id` is the slug
      return ok(res, { items: items.map(({ id, slug, published, sort, review, ...rest }) => ({ id: slug, ...rest })) });
    }

    case p === "/api/public/case-studies.php": {
      const slug = url.searchParams.get("slug");
      const preview = url.searchParams.get("preview") === "1" && authed;
      if (slug) {
        const s = caseStudies.find((c) => c.slug === slug && (preview || c.status === "published"));
        if (!s) return err(res, 404, "not found");
        return ok(res, { study: s });
      }
      return ok(res, { studies: caseStudies.filter((c) => c.status === "published").map(({ blocks, ...rest }) => rest) });
    }

    case p === "/api/public/contact.php" && method === "POST": {
      if ((b.website ?? "") !== "") return ok(res);
      if (!b.name || !b.email || !b.message) return err(res, 422, "invalid input");
      inquiries.unshift({ id: nextId++, name: b.name, email: b.email, phone: b.phone || null, message: b.message, emailed_at: null, created_at: new Date().toISOString() });
      return ok(res);
    }

    // ——— admin ———
    case p === "/api/admin/me.php":
      return ok(res, authed ? { authed: true, csrf: CSRF } : { authed: false });

    case p === "/api/admin/login.php" && method === "POST":
      if (b.password === "test") { authed = true; return ok(res, { csrf: CSRF }); }
      return err(res, 401, "wrong password");

    case p === "/api/admin/logout.php" && method === "POST":
      authed = false;
      return ok(res);

    case p === "/api/admin/upload.php" && method === "POST": {
      if (!guard()) return;
      const key = `uploads/mock/${(b.filename || "file").toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
      return ok(res, {
        upload_url: `http://localhost:${PORT}/mock-upload`,
        public_url: `http://localhost:${PORT}/${key}`,
        path: `/${key}`,
      });
    }

    case p === "/api/admin/hero.php": {
      if (!guard()) return;
      if (method === "GET") return ok(res, { slides: [...heroSlides].sort((a, b) => a.sort - b.sort) });
      if (method === "POST" && url.searchParams.get("action") === "reorder") {
        b.ids.forEach((id, i) => { const s = heroSlides.find((x) => x.id === Number(id)); if (s) s.sort = i; });
        return ok(res);
      }
      if (method === "POST") {
        const s = { id: nextId++, src: b.src, label: b.label, meta: b.meta || null, sort: heroSlides.length, active: 1 };
        heroSlides.push(s);
        return ok(res, { id: s.id });
      }
      if (method === "PUT") {
        const s = heroSlides.find((x) => x.id === Number(b.id));
        if (!s) return err(res, 404, "not found");
        for (const k of ["src", "label", "meta"]) if (k in b) s[k] = b[k];
        if ("active" in b) s.active = b.active ? 1 : 0;
        return ok(res);
      }
      if (method === "DELETE") { heroSlides = heroSlides.filter((x) => x.id !== Number(b.id)); return ok(res); }
      return err(res, 405, "method not allowed");
    }

    case p === "/api/admin/case-studies.php": {
      if (!guard()) return;
      if (method === "GET") {
        const id = Number(url.searchParams.get("id") || 0);
        if (id) {
          const s = caseStudies.find((c) => c.id === id);
          return s ? ok(res, { study: s }) : err(res, 404, "not found");
        }
        return ok(res, { studies: caseStudies.map(({ blocks, ...rest }) => rest) });
      }
      if (method === "POST") {
        if (caseStudies.some((c) => c.slug === b.slug)) return err(res, 409, "slug already exists");
        const s = { id: nextId++, status: "draft", blocks: [], client: null, year: null, intro: null, cover: null, sort: 0, updated_at: new Date().toISOString(), ...b };
        caseStudies.push(s);
        return ok(res, { id: s.id });
      }
      if (method === "PUT") {
        const s = caseStudies.find((c) => c.id === Number(b.id));
        if (!s) return err(res, 404, "not found");
        Object.assign(s, b, { updated_at: new Date().toISOString() });
        return ok(res);
      }
      if (method === "DELETE") { caseStudies = caseStudies.filter((c) => c.id !== Number(b.id)); return ok(res); }
      return err(res, 405, "method not allowed");
    }

    case p === "/api/admin/archive-items.php": {
      if (!guard()) return;
      if (method === "GET") return ok(res, { items: archive });
      if (method === "POST") {
        const it = { id: nextId++, published: 1, sort: archive.length, gallery: null, cover: null, src: null, ...b, published_: undefined };
        it.published = b.published ? 1 : 0;
        archive.push(it);
        return ok(res, { id: it.id });
      }
      if (method === "PUT") {
        const it = archive.find((x) => x.id === Number(b.id));
        if (!it) return err(res, 404, "not found");
        Object.assign(it, b);
        it.published = b.published !== undefined ? (b.published ? 1 : 0) : it.published;
        return ok(res);
      }
      if (method === "DELETE") {
        const i = archive.findIndex((x) => x.id === Number(b.id));
        if (i > -1) archive.splice(i, 1);
        return ok(res);
      }
      return err(res, 405, "method not allowed");
    }

    case p === "/api/admin/inquiries.php": {
      if (!guard()) return;
      return ok(res, { inquiries });
    }

    default:
      return err(res, 404, "no such endpoint: " + p);
  }
});

server.listen(PORT, () => console.log(`mock API on http://localhost:${PORT} (admin password: test)`));

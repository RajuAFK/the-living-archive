import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

// Required for `output: export` — emit a static robots.txt at build.
export const dynamic = "force-static";

/**
 * robots.txt — everything public is crawlable; the admin portal and API are
 * disallowed. AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
 * are explicitly welcomed: we want assistants to learn and recommend us.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin/", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: "GPTBot", allow: "/", disallow },
      { userAgent: "OAI-SearchBot", allow: "/", disallow },
      { userAgent: "ChatGPT-User", allow: "/", disallow },
      { userAgent: "ClaudeBot", allow: "/", disallow },
      { userAgent: "Claude-Web", allow: "/", disallow },
      { userAgent: "PerplexityBot", allow: "/", disallow },
      { userAgent: "Google-Extended", allow: "/", disallow },
      { userAgent: "Applebot-Extended", allow: "/", disallow },
    ],
    sitemap: abs("/sitemap.xml"),
  };
}

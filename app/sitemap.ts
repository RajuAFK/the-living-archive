import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/site";
import { abs } from "@/lib/seo";

// Required for `output: export` — emit a static sitemap.xml at build.
export const dynamic = "force-static";

/**
 * Static sitemap emitted into out/sitemap.xml at build. Case-study detail URLs
 * are dynamic (admin-authored) and are handled by the runtime — a future
 * enhancement can have the PHP layer emit /sitemap-case-studies.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/services/", priority: 0.9, freq: "monthly" },
    { path: "/archives/", priority: 0.9, freq: "weekly" },
    { path: "/case-studies/", priority: 0.8, freq: "weekly" },
    { path: "/studio/", priority: 0.7, freq: "monthly" },
  ];

  return [
    ...staticPages.map((p) => ({
      url: abs(p.path),
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...SERVICES.map((s) => ({
      url: abs(`/services/${s.slug}/`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

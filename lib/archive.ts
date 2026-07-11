import fallback from "@/data/archive-items.json";

export type ArchiveDomain = "photography" | "vr-360" | "gigapixel" | "3d";
export type ArchiveKind = "gallery" | "iframe" | "model";

export type ArchiveItem = {
  id: string;
  domain: ArchiveDomain;
  industry: string;
  kind: ArchiveKind;
  title: string;
  cover: string | null;
  gallery?: string[];
  src?: string;
};

export const DOMAIN_LABELS: Record<ArchiveDomain, string> = {
  photography: "Photography",
  "vr-360": "360° VR Tours",
  gigapixel: "Gigapixel",
  "3d": "3D",
};

export const DOMAIN_ORDER: ArchiveDomain[] = ["photography", "vr-360", "3d", "gigapixel"];

/** Short medium descriptor shown on cards / viewers. */
export function mediumLabel(item: ArchiveItem): string {
  switch (item.domain) {
    case "photography":
      return `Gallery · ${item.gallery?.length ?? 0} plates`;
    case "vr-360":
      return "360° tour";
    case "gigapixel":
      return "Gigapixel";
    case "3d":
      return "3D model";
  }
}

export function industryLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Bundled snapshot first (instant, works offline/in dev), then the live API
 * (admin-managed) replaces it when reachable.
 */
export async function loadArchiveItems(): Promise<ArchiveItem[]> {
  try {
    const res = await fetch("/api/public/archives.php");
    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.items) && json.items.length > 0) {
        return json.items as ArchiveItem[];
      }
    }
  } catch {
    // fall through to the bundled snapshot
  }
  return fallback.items as ArchiveItem[];
}

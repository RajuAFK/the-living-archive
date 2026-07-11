import fallback from "@/data/case-studies-fallback.json";

/**
 * Case studies are block documents authored in the admin portal and stored
 * as JSON in la_case_studies.blocks. The renderer lays media blocks into the
 * text flow according to `placement`, so body text wraps and adapts.
 */
export type CaseBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string } // paragraphs separated by blank lines
  | {
      type: "media";
      src: string; // media path or full URL
      kind?: "image" | "frame"; // frame = interactive iframe (tour/gigapixel)
      caption?: string;
      placement: "full" | "left" | "right" | "inset";
      /** percentage width for left/right floats (25–60, default 42) */
      width?: number;
    }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "cta"; label: string; href: string };

export type CaseStudy = {
  slug: string;
  title: string;
  client?: string;
  year?: string;
  intro?: string;
  cover?: string | null;
  blocks: CaseBlock[];
};

export type CaseStudySummary = Omit<CaseStudy, "blocks">;

export async function loadCaseStudies(): Promise<CaseStudySummary[]> {
  try {
    const res = await fetch("/api/public/case-studies.php");
    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.studies)) return json.studies;
    }
  } catch {
    // fall through
  }
  return (fallback as { studies: CaseStudySummary[] }).studies;
}

export async function loadCaseStudy(
  slug: string,
  preview = false,
): Promise<CaseStudy | null> {
  try {
    const res = await fetch(
      `/api/public/case-studies.php?slug=${encodeURIComponent(slug)}${preview ? "&preview=1" : ""}`,
    );
    if (res.ok) {
      const json = await res.json();
      if (json.ok && json.study) return json.study as CaseStudy;
    }
  } catch {
    // fall through
  }
  const local = (fallback as { studies: (CaseStudySummary & { blocks?: CaseBlock[] })[] }).studies.find(
    (s) => s.slug === slug,
  );
  return local ? ({ blocks: [], ...local } as CaseStudy) : null;
}

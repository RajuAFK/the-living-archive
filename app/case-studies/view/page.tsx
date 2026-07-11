import type { Metadata } from "next";
import { Suspense } from "react";
import { CaseStudyView } from "@/components/case-studies/CaseStudyView";

export const metadata: Metadata = {
  title: "Case Study — Praxivision",
};

/**
 * Static shell for every case-study detail URL. On the server, Apache
 * rewrites /case-studies/{slug}/ to this page (see public/.htaccess); the
 * client reads the slug from the path (or ?s= in dev) and fetches the study.
 */
export default function CaseStudyShell() {
  return (
    <Suspense>
      <CaseStudyView />
    </Suspense>
  );
}

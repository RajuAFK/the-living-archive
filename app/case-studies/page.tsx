import type { Metadata } from "next";
import { CaseStudiesIndex } from "@/components/case-studies/CaseStudiesIndex";

export const metadata: Metadata = {
  title: "Case Studies — Praxivision",
  description:
    "How institutions and industries brought their documentation problems to Praxivision — and what was delivered.",
};

export default function CaseStudiesPage() {
  return (
    <div className="pt-[76px]">
      <header className="mx-auto max-w-[1400px] px-6 pb-10 pt-16 md:px-10 md:pt-24">
        <p className="label-mono">The work, examined</p>
        <h1 className="display mt-4 text-5xl text-linen md:text-7xl">
          Case Studies<span className="text-verdigris">.</span>
        </h1>
      </header>
      <CaseStudiesIndex />
    </div>
  );
}

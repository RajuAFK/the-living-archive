import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveExplorer } from "@/components/archives/ArchiveExplorer";

export const metadata: Metadata = {
  title: "Archives — Praxivision",
  description:
    "Three decades of documentation: photography, 360° VR tours, 3D digitization and gigapixel captures across heritage, healthcare, hospitality and industry.",
};

export default function ArchivesPage() {
  return (
    <div className="pt-[76px]">
      <header className="mx-auto max-w-[1400px] px-6 pb-10 pt-16 md:px-10 md:pt-24">
        <p className="label-mono">The vault, open</p>
        <h1 className="display mt-4 text-5xl text-linen md:text-7xl">
          Archives<span className="text-verdigris">.</span>
        </h1>
      </header>
      <Suspense>
        <ArchiveExplorer />
      </Suspense>
    </div>
  );
}

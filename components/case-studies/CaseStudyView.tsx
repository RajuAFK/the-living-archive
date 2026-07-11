"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loadCaseStudy, type CaseStudy } from "@/lib/case-studies";
import { mediaUrl } from "@/lib/media";
import { BlockRenderer } from "./BlockRenderer";

/** Resolve the slug from /case-studies/{slug}/ (Apache rewrite) or ?s= (dev). */
function resolveSlug(searchSlug: string | null): string | null {
  if (searchSlug) return searchSlug;
  if (typeof window === "undefined") return null;
  const m = window.location.pathname.match(/^\/case-studies\/([a-z0-9-]+)\/?$/i);
  return m && m[1] !== "view" ? m[1] : null;
}

export function CaseStudyView() {
  const params = useSearchParams();
  const [study, setStudy] = useState<CaseStudy | null | "missing">(null);

  useEffect(() => {
    if (study && study !== "missing") document.title = `${study.title} — Praxivision`;
  }, [study]);

  useEffect(() => {
    const slug = resolveSlug(params.get("s"));
    if (!slug) {
      setStudy("missing");
      return;
    }
    const preview = params.get("preview") === "1";
    let alive = true;
    loadCaseStudy(slug, preview).then((s) => {
      if (alive) setStudy(s ?? "missing");
    });
    return () => {
      alive = false;
    };
  }, [params]);

  if (study === null) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="label-mono animate-pulse">Retrieving from the archive…</p>
      </div>
    );
  }

  if (study === "missing") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="display text-3xl text-linen-dim">
          This case study isn&apos;t on file.
        </p>
        <Link
          href="/case-studies/"
          className="inline-flex items-center gap-3 rounded-full border border-verdigris/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-verdigris transition-all duration-300 hover:bg-verdigris hover:text-ink-0"
        >
          All case studies →
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* dark hero */}
      <header className="relative flex min-h-[72svh] items-end overflow-hidden bg-ink-0 pt-[76px]">
        {study.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(study.cover)}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-55"
            style={{ filter: "saturate(0.85)" }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,10,8,0.95) 0%, rgba(11,10,8,0.3) 50%, rgba(11,10,8,0.2) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-16 md:px-10 md:pb-24">
          <p className="label-mono">
            Case study{study.client && <span className="ml-3 !text-linen">· {study.client}</span>}
            {study.year && <span className="ml-3">· {study.year}</span>}
          </p>
          <h1 className="display mt-5 max-w-4xl text-4xl text-linen sm:text-5xl md:text-6xl">
            {study.title}
          </h1>
        </div>
      </header>

      {/* light reading room */}
      <div className="reading-room">
        <div className="mx-auto max-w-[1200px] py-16 md:py-24">
          {study.intro && (
            <p className="display mx-auto mb-14 max-w-[720px] px-6 text-2xl leading-snug md:px-0 md:text-3xl">
              {study.intro}
            </p>
          )}
          <BlockRenderer blocks={study.blocks} />
        </div>
      </div>

      <nav className="hairline-t">
        <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-10">
          <Link
            href="/case-studies/"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-verdigris transition-colors hover:text-verdigris-bright"
          >
            ← All case studies
          </Link>
        </div>
      </nav>
    </article>
  );
}

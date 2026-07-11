"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { loadCaseStudies, type CaseStudySummary } from "@/lib/case-studies";
import { mediaUrl } from "@/lib/media";

/** Published case studies (admin-authored). */
export function CaseStudiesIndex() {
  const [studies, setStudies] = useState<CaseStudySummary[] | null>(null);

  useEffect(() => {
    let alive = true;
    loadCaseStudies().then((list) => {
      if (alive) setStudies(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (studies === null) {
    return (
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 pb-28 md:grid-cols-2 md:px-10">
        {[0, 1].map((i) => (
          <div key={i} className="aspect-[16/10] animate-pulse rounded-lg bg-ink-2" />
        ))}
      </div>
    );
  }

  if (studies.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-6 pb-32 md:px-10">
        <div
          className="rounded-2xl border border-dashed px-8 py-20 text-center"
          style={{ borderColor: "var(--hairline-strong)" }}
        >
          <p className="label-mono !text-verdigris">◌ First case studies in preparation</p>
          <p className="display mx-auto mt-5 max-w-xl text-2xl text-linen-dim">
            The studio is writing up selected projects. Until then, the work
            itself is on the floor —
          </p>
          <Link
            href="/archives/"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-verdigris/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-verdigris transition-all duration-300 hover:bg-verdigris hover:text-ink-0"
          >
            Visit the archives →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 pb-28 md:grid-cols-2 md:px-10">
      {studies.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 2) * 0.08}>
          <Link href={`/case-studies/${s.slug}/`} className="group block">
            <div className="media-box aspect-[16/10] overflow-hidden rounded-lg">
              {s.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaUrl(s.cover)}
                  alt=""
                  aria-hidden="true"
                  loading={i < 2 ? "eager" : "lazy"}
                  className="transition-all duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
                  style={{ filter: "saturate(0.9)" }}
                />
              ) : (
                <div className="absolute inset-0 bg-ink-2" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-0/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="label-mono !text-linen/80">
                  {s.client}
                  {s.year && <span className="ml-3">· {s.year}</span>}
                </p>
                <h2 className="display mt-2 text-2xl leading-tight text-linen transition-colors duration-200 group-hover:text-verdigris-bright md:text-3xl">
                  {s.title}
                </h2>
              </div>
            </div>
            {s.intro && (
              <p className="mt-4 line-clamp-2 max-w-xl text-[14px] leading-relaxed text-linen-dim">
                {s.intro}
              </p>
            )}
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

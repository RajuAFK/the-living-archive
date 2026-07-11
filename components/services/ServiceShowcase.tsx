"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  industryLabel,
  loadArchiveItems,
  mediumLabel,
  type ArchiveItem,
} from "@/lib/archive";
import { mediaUrl } from "@/lib/media";

/**
 * "From the archive" strip on each service page: live items matching the
 * service's slice of the taxonomy, each linking into the archive with that
 * work already open — plus a CTA to the whole pre-filtered floor.
 */
export function ServiceShowcase({
  query,
  serviceName,
  limit = 8,
}: {
  /** Archive filter query string, e.g. "domain=vr-360&industry=heritage". */
  query: string;
  serviceName: string;
  limit?: number;
}) {
  const [items, setItems] = useState<ArchiveItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    loadArchiveItems().then((list) => {
      if (alive) setItems(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const filters = useMemo(() => new URLSearchParams(query), [query]);

  const picks = useMemo(() => {
    if (!items) return [];
    const domain = filters.get("domain");
    const industry = filters.get("industry");
    return items
      .filter(
        (it) =>
          (!domain || it.domain === domain) &&
          (!industry || it.industry === industry),
      )
      .slice(0, limit);
  }, [items, filters, limit]);

  const archiveHref = `/archives/${query ? `?${query}` : ""}`;

  if (items !== null && picks.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Link
          href={archiveHref}
          className="inline-flex items-center gap-3 rounded-full border border-verdigris/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-verdigris transition-all duration-300 hover:bg-verdigris hover:text-ink-0"
        >
          Explore the archives →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="label-mono">From the archive</p>
          <Link
            href={archiveHref}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-verdigris transition-colors hover:text-verdigris-bright"
          >
            See everything for {serviceName} →
          </Link>
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {(items === null ? Array.from({ length: 4 }) : picks).map((it, i) =>
          it === undefined ? (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-ink-2" />
          ) : (
            <Reveal key={(it as ArchiveItem).id} delay={i * 0.06}>
              <ShowcaseCard item={it as ArchiveItem} />
            </Reveal>
          ),
        )}
      </div>

      <Reveal className="mt-12">
        <Link
          href={archiveHref}
          className="inline-flex items-center gap-3 rounded-full border border-verdigris/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-verdigris transition-all duration-300 hover:bg-verdigris hover:text-ink-0"
        >
          Explore in the archives →
        </Link>
      </Reveal>
    </div>
  );
}

function ShowcaseCard({ item }: { item: ArchiveItem }) {
  return (
    <Link href={`/archives/?item=${encodeURIComponent(item.id)}`} className="group block">
      <div className="media-box aspect-[4/3] overflow-hidden rounded-lg">
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(item.cover)}
            alt={item.title}
            loading="lazy"
            className="transition-all duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.045]"
            style={{ filter: "saturate(0.92)" }}
          />
        ) : (
          <div className="absolute inset-0 bg-ink-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-0/80 via-transparent to-transparent" />
        <span className="label-mono absolute bottom-3 left-4 !text-linen/85">
          {mediumLabel(item)}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="display text-lg leading-tight text-linen transition-colors duration-200 group-hover:text-verdigris-bright">
          {item.title}
        </h3>
        <span className="label-mono shrink-0">{industryLabel(item.industry)}</span>
      </div>
    </Link>
  );
}

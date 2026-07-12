"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  DOMAIN_LABELS,
  DOMAIN_ORDER,
  industryLabel,
  loadArchiveItems,
  mediumLabel,
  type ArchiveDomain,
  type ArchiveItem,
} from "@/lib/archive";
import { mediaUrl, modelViewerUrl } from "@/lib/media";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { FrameViewer } from "@/components/viewers/FrameViewer";
import { Lightbox } from "@/components/viewers/Lightbox";

/**
 * The archive floor: every published work, filterable by domain × industry,
 * deep-linkable (?domain=&industry=&q=&item=) so services and case studies
 * can point at exact slices or a single opened work.
 */
export function ArchiveExplorer() {
  const router = useRouter();
  const params = useSearchParams();

  const [items, setItems] = useState<ArchiveItem[] | null>(null);

  const domain = (params.get("domain") ?? "") as ArchiveDomain | "";
  const industry = params.get("industry") ?? "";
  const q = params.get("q") ?? "";
  const openId = params.get("item") ?? "";

  useEffect(() => {
    let alive = true;
    loadArchiveItems().then((list) => {
      if (alive) setItems(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      // industry choices depend on domain — reset when domain changes
      if (key === "domain") next.delete("industry");
      router.replace(`/archives/${next.size ? `?${next}` : ""}`, { scroll: false });
    },
    [params, router],
  );

  const domainItems = useMemo(
    () => (items ?? []).filter((it) => !domain || it.domain === domain),
    [items, domain],
  );

  const industries = useMemo(() => {
    const set = new Map<string, number>();
    for (const it of domainItems) set.set(it.industry, (set.get(it.industry) ?? 0) + 1);
    return [...set.entries()].sort((a, b) => b[1] - a[1]);
  }, [domainItems]);

  const visible = useMemo(
    () =>
      domainItems.filter(
        (it) =>
          (!industry || it.industry === industry) &&
          (!q || it.title.toLowerCase().includes(q.toLowerCase())),
      ),
    [domainItems, industry, q],
  );

  const openItem = useMemo(
    () => (items ?? []).find((it) => it.id === openId) ?? null,
    [items, openId],
  );

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 md:px-10">
      {/* filter bar — sticks below the floating pill navbar (12px + 56px + gap) */}
      <div className="hairline-b sticky top-[76px] z-20 -mx-6 bg-ink-0/90 px-6 py-4 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-1" role="tablist" aria-label="Domain">
            <FilterTab active={!domain} onClick={() => setParam("domain", "")}>
              All
            </FilterTab>
            {DOMAIN_ORDER.map((d) => (
              <FilterTab key={d} active={domain === d} onClick={() => setParam("domain", d)}>
                {DOMAIN_LABELS[d]}
              </FilterTab>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <input
              type="search"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
              placeholder="Search the archive…"
              aria-label="Search the archive"
              className="w-44 border-b bg-transparent pb-1 font-mono text-[11px] tracking-[0.08em] text-linen outline-none transition-colors focus:border-verdigris md:w-56"
              style={{ borderColor: "var(--hairline-strong)" }}
            />
            <span className="label-mono whitespace-nowrap">
              {items === null ? "…" : `${visible.length} works`}
            </span>
          </div>
        </div>

        {industries.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Chip active={!industry} onClick={() => setParam("industry", "")}>
              All industries
            </Chip>
            {industries.map(([slug, n]) => (
              <Chip key={slug} active={industry === slug} onClick={() => setParam("industry", slug)}>
                {industryLabel(slug)} <span className="opacity-50">{n}</span>
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* grid */}
      <motion.ul layout className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((it) => (
            <motion.li
              key={it.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ArchiveCard item={it} onOpen={() => setParam("item", it.id)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {items !== null && visible.length === 0 && (
        <p className="display mt-24 text-center text-2xl text-linen-dim">
          Nothing in the archive matches — <em>yet</em>.
        </p>
      )}

      {/* detail overlay */}
      <AnimatePresence>
        {openItem && <DetailOverlay item={openItem} onClose={() => setParam("item", "")} />}
      </AnimatePresence>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200",
        active ? "bg-linen text-ink-0" : "text-linen-dim hover:text-linen",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-[11px] transition-colors duration-200",
        active
          ? "border-verdigris/70 bg-verdigris/15 text-verdigris-bright"
          : "border-[var(--hairline)] text-linen-dim hover:border-[var(--hairline-strong)] hover:text-linen",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ArchiveCard({ item, onOpen }: { item: ArchiveItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full text-left"
      aria-label={`Open ${item.title}`}
    >
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
          <div className="absolute inset-0 flex items-center justify-center bg-ink-2">
            <span className="display text-4xl italic text-linen-dim/50">
              {DOMAIN_LABELS[item.domain]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-0/85 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="label-mono absolute bottom-3 left-4 right-4 flex items-center justify-between !text-linen/85">
          <span>{mediumLabel(item)}</span>
          <span className="translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            →
          </span>
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="display text-lg leading-tight text-linen transition-colors duration-200 group-hover:text-verdigris-bright">
          {item.title}
        </h3>
        <span className="label-mono shrink-0">{industryLabel(item.industry)}</span>
      </div>
    </button>
  );
}

function DetailOverlay({ item, onClose }: { item: ArchiveItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[60] flex flex-col bg-ink-0/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-baseline gap-4">
          <h2 className="display text-xl text-linen md:text-2xl">{item.title}</h2>
          <span className="label-mono hidden sm:inline">
            {DOMAIN_LABELS[item.domain]} · {industryLabel(item.industry)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-linen transition-colors hover:text-verdigris-bright"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>

      <motion.div
        className="min-h-0 flex-1 px-6 pb-6 md:px-10 md:pb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {item.kind === "gallery" && item.gallery ? (
          <Lightbox images={item.gallery} title={item.title} className="h-full" />
        ) : (
          <FrameViewer
            className="h-full rounded-lg"
            src={item.kind === "model" ? modelViewerUrl(item.src!) : mediaUrl(item.src!)}
            title={item.title}
            poster={item.cover ? mediaUrl(item.cover) : null}
            kindLabel={mediumLabel(item)}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

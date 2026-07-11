"use client";

import { useEffect, useState } from "react";

export type RailSection = { id: string; label: string };

/**
 * Fixed progress rail on the right edge — one node per home section.
 * The active node stretches and shows its label; clicking jumps (Lenis
 * intercepts the anchor scroll, so it glides).
 */
export function SectionRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  // rail sits over light "reading room" sections too — flip its ink to match
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
            setOnLight(e.target.classList.contains("reading-room"));
          }
        }
      },
      // a narrow band around the viewport's vertical center decides the section
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-end gap-4">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="group flex items-center justify-end gap-3">
              <span
                className={[
                  "label-mono whitespace-nowrap transition-all duration-500 [transition-timing-function:var(--ease-out)]",
                  onLight ? "!text-ink-text" : "!text-linen",
                  isActive
                    ? "translate-x-0 opacity-100"
                    : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70",
                ].join(" ")}
              >
                {s.label}
              </span>
              <a
                href={`#${s.id}`}
                aria-label={s.label}
                aria-current={isActive ? "true" : undefined}
                className="flex h-4 items-center"
              >
                <span
                  className={[
                    "block h-[2px] rounded-full transition-all duration-500 [transition-timing-function:var(--ease-out)]",
                    isActive
                      ? onLight
                        ? "w-9 bg-verdigris-deep"
                        : "w-9 bg-verdigris"
                      : onLight
                        ? "w-4 bg-ink-text/30 group-hover:w-6 group-hover:bg-ink-text/60"
                        : "w-4 bg-linen/30 group-hover:w-6 group-hover:bg-linen/60",
                  ].join(" ")}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

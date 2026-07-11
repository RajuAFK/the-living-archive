"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";
import fallback from "@/data/hero-fallback.json";

export type HeroSlide = {
  id: string;
  src: string;
  label: string;
  meta: string;
};

const INTERVAL_MS = 9000;
const FADE_MS = 1600;

/**
 * Full-viewport hero. Slides drift on a slow Ken Burns and crossfade at long
 * intervals; the bottom rail lets the visitor scrub manually. Slide order and
 * imagery are admin-managed (la_hero_slides) with a bundled fallback so the
 * page never renders empty.
 */
export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallback.slides);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  // manual interactions restart the clock; key remounts progress animations
  const [cycleKey, setCycleKey] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Admin-managed slides, when the API is reachable.
  useEffect(() => {
    fetch("/api/public/hero.php")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        if (j.ok && Array.isArray(j.slides) && j.slides.length > 0) {
          setSlides(j.slides);
          setActive(0);
        }
      })
      .catch(() => {}); // fallback slides already in place
  }, []);

  const goTo = useCallback((i: number, manual = false) => {
    setActive(i);
    if (manual) setCycleKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (reduced || slides.length < 2) return;
    timer.current = setTimeout(
      () => setActive((a) => (a + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, cycleKey, reduced, slides.length]);

  return (
    <section id="overview" aria-label="Featured work" className="relative h-svh min-h-[560px] overflow-hidden bg-ink-0">
      {/* slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== active}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: `opacity ${FADE_MS}ms var(--ease-in-out)`,
            zIndex: i === active ? 1 : 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(s.src)}
            alt={i === active ? s.label : ""}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className="h-full w-full object-cover"
            style={
              !reduced && i === active
                ? {
                    animation: `hero-drift ${INTERVAL_MS + FADE_MS * 2}ms linear forwards`,
                  }
                : undefined
            }
          />
        </div>
      ))}

      {/* legibility gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(11,10,8,0.88) 0%, rgba(11,10,8,0.25) 32%, rgba(11,10,8,0) 55%), linear-gradient(to bottom, rgba(11,10,8,0.55) 0%, rgba(11,10,8,0) 22%)",
        }}
      />

      {/* tagline */}
      <div className="absolute inset-x-0 bottom-0 z-[3] px-6 pb-28 md:px-10 md:pb-32">
        <h1 className="display text-[13vw] leading-[0.95] text-linen sm:text-[9vw] lg:text-[6.5rem]">
          capture, <em className="text-verdigris-bright">process,</em> access.
        </h1>
      </div>

      {/* manual cycle rail */}
      <div className="absolute inset-x-0 bottom-0 z-[4] px-6 pb-8 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <p className="label-mono !text-linen-dim">
            <span className="text-linen">{String(active + 1).padStart(2, "0")}</span>
            {" / "}
            {String(slides.length).padStart(2, "0")}
            <span className="ml-4 hidden text-linen sm:inline">{slides[active]?.label}</span>
            <span className="ml-3 hidden md:inline">{slides[active]?.meta}</span>
          </p>

          <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${s.label}`}
                onClick={() => goTo(i, true)}
                className="group/bar py-3"
              >
                <span className="relative block h-[2px] w-10 overflow-hidden rounded-full bg-linen/25 transition-all duration-300 group-hover/bar:bg-linen/50 sm:w-14">
                  {i === active && (
                    <span
                      key={`${cycleKey}-${active}`}
                      className="absolute inset-y-0 left-0 block rounded-full bg-verdigris-bright"
                      style={{
                        animation: reduced
                          ? undefined
                          : `hero-progress ${INTERVAL_MS}ms linear forwards`,
                        width: reduced ? "100%" : undefined,
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

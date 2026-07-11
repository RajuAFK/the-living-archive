"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { FACTS } from "@/lib/site";

const NARRATIVE = [
  "Praxivision began in 1992 as a photography practice built on one discipline: getting the image right at the moment of capture. Three decades on, that same rigour spans photogrammetry, digital twins, immersive tours, and long-term archives.",
  "We call it an end-to-end pipeline because we stay with a subject from the first frame to the final archive — capture, reconstruction, metadata, and access as one continuous process, never handed between vendors. A temple wall becomes a measurable 3D model, a catalogued archive, and a virtual walkthrough, without ever leaving a single workflow.",
  "We work with the institutions that hold India's heritage and the organizations that build its infrastructure. Over 2,100 projects, from Tirumala Tirupati Devasthanams to Angkor Archaeological Park.",
];

/**
 * The first light "reading room" — who Praxivision is, anchored by the two
 * confirmed facts: documenting since 1992, 2100+ assignments delivered.
 */
export function AboutBrief() {
  return (
    <section id="about" className="reading-room relative">
      <div className="mx-auto max-w-[1200px] px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="label-mono">The studio</p>
        </Reveal>

        <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div className="flex flex-col justify-between gap-16">
            <div className="grid grid-cols-2 gap-10">
              <Reveal delay={0.05}>
                <Stat value={FACTS.since} label="Documenting & digitizing since" plain />
              </Reveal>
              <Reveal delay={0.15}>
                <Stat value={FACTS.assignments} label="Assignments delivered" plus />
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="display max-w-md text-2xl leading-snug text-ink-text md:text-3xl">
                Industries and cultures, recorded with <em>photographic discipline</em> —
                then processed, enriched and kept accessible.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="flex flex-col justify-center gap-5">
            {NARRATIVE.map((para, i) => (
              <p
                key={i}
                className="max-w-xl text-[15px] leading-[1.75] text-ink-text-dim"
              >
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  plus,
  plain,
}: {
  value: number;
  label: string;
  plus?: boolean;
  plain?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : plain ? value - 60 : 0);

  useEffect(() => {
    if (!inView || reduced) {
      if (inView) setDisplay(value);
      return;
    }
    const from = plain ? value - 60 : 0;
    const dur = 1600;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, plain]);

  return (
    <span ref={ref} className="block">
      <span className="display block text-6xl text-ink-text md:text-7xl">
        {plain ? String(display) : display.toLocaleString("en-IN")}
        {plus && <span className="text-verdigris-deep">+</span>}
      </span>
      <span className="label-mono mt-3 block">{label}</span>
    </span>
  );
}

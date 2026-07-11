"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "@/lib/site";
import { mediaUrl } from "@/lib/media";
import { SERVICE_BACKDROPS as BACKDROPS } from "@/lib/service-media";

/**
 * Index of the six services. Hovering a row floods the section background
 * with that service's imagery (slow crossfade); each row links to its page.
 */
export function ServicesSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-ink-0"
      onMouseLeave={() => setHovered(null)}
    >
      {/* hover backdrops */}
      {SERVICES.map((s) => (
        <div
          key={s.slug}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000 [transition-timing-function:var(--ease-in-out)]"
          style={{ opacity: hovered === s.slug ? 0.34 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(BACKDROPS[s.slug])}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.75) brightness(0.85)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-0 via-ink-0/40 to-ink-0/70" />
        </div>
      ))}

      <div className="relative mx-auto max-w-[1200px] px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="label-mono">What we do</p>
        </Reveal>

        <ul className="mt-14">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <li className="hairline-t last:border-b last:border-[var(--hairline)]">
                <Link
                  href={`/services/${s.slug}/`}
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 py-7 md:grid-cols-[3.5rem_1fr_auto_2rem] md:gap-x-8 md:py-9"
                  onMouseEnter={() => setHovered(s.slug)}
                  onFocus={() => setHovered(s.slug)}
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-linen-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="display block text-2xl text-linen transition-colors duration-300 group-hover:text-verdigris-bright sm:text-3xl md:text-4xl">
                      {s.name}
                      {s.flagship && (
                        <span className="relative -top-3 ml-3 inline-block font-mono text-[9px] tracking-[0.24em] text-verdigris md:-top-4">
                          END-TO-END PIPELINE
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="hidden text-right text-[12px] text-linen-dim md:block">
                    {s.scope}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden text-linen-dim transition-all duration-300 group-hover:translate-x-1 group-hover:text-verdigris-bright md:block"
                  >
                    →
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

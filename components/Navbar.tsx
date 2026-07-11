"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SERVICES } from "@/lib/site";

/**
 * Glassmorphic navbar. A full-width translucent strip at the top of the page
 * that condenses into a floating pill once the visitor scrolls.
 * The morph animates width / radius / height with a long expo ease — one
 * element, one transition, no re-layout of page content.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the overlay on navigation, unlock body scroll
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <nav
          aria-label="Primary"
          className={[
            "pointer-events-auto flex items-center justify-between",
            "transition-all duration-700 [transition-timing-function:var(--ease-out)]",
            scrolled
              ? "glass mt-3 h-14 w-[min(960px,calc(100%-1.5rem))] rounded-full pl-5 pr-2 shadow-[0_12px_48px_rgba(0,0,0,0.45)]"
              : // at the top of the page the bar is fully transparent — the hero
                // owns the frame; a soft scrim in the hero itself keeps links legible
                "mt-0 h-[76px] w-full rounded-none border border-transparent bg-transparent pl-6 pr-4 md:pl-10 md:pr-8",
          ].join(" ")}
        >
          {/* brand */}
          <Link href="/" className="flex shrink-0 items-center" aria-label="Praxivision — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/praxivision.png"
              alt="Praxivision"
              className={[
                "w-auto transition-all duration-700 [transition-timing-function:var(--ease-out)]",
                scrolled ? "h-[15px]" : "h-[18px]",
              ].join(" ")}
              style={{ filter: "brightness(1.65) saturate(0.7)" }}
            />
          </Link>

          {/* desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) =>
              "dropdown" in item && item.dropdown ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={navLinkCls(isActive(item.href))}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <Caret />
                  </Link>
                  {/* services dropdown */}
                  <div
                    className={[
                      "invisible absolute left-1/2 top-full -translate-x-1/2 pt-4 opacity-0",
                      "translate-y-1 transition-all duration-300 [transition-timing-function:var(--ease-out)]",
                      "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                      "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
                    ].join(" ")}
                  >
                    <div
                      className="glass w-[340px] rounded-2xl p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                      style={{ background: "color-mix(in srgb, var(--ink-0) 88%, transparent)" }}
                    >
                      {SERVICES.map((s, i) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}/`}
                          className="group/item block rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-[rgba(237,230,218,0.06)]"
                        >
                          <span className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] text-linen-dim">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[13px] leading-snug text-linen transition-colors group-hover/item:text-verdigris-bright">
                              {s.name}
                              {s.flagship && (
                                <span className="ml-2 font-mono text-[9px] tracking-[0.2em] text-verdigris">
                                  END-TO-END
                                </span>
                              )}
                            </span>
                          </span>
                          <span className="mt-0.5 block pl-[30px] text-[11px] text-linen-dim">
                            {s.scope}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className={navLinkCls(isActive(item.href))}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-2">
            {/* contact CTA */}
            <Link
              href="/#contact"
              className={[
                "hidden items-center rounded-full border border-verdigris/50 font-mono uppercase",
                "text-[10px] tracking-[0.22em] text-verdigris transition-all duration-300",
                "hover:border-verdigris hover:bg-verdigris hover:text-ink-0 sm:inline-flex",
                scrolled ? "px-4 py-2.5" : "px-5 py-3",
              ].join(" ")}
            >
              Contact
            </Link>

            {/* mobile burger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            >
              <span className="relative block h-[10px] w-[22px]">
                <span
                  className={[
                    "absolute left-0 top-0 h-px w-full bg-linen transition-transform duration-300",
                    menuOpen ? "translate-y-[5px] rotate-45" : "",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute bottom-0 left-0 h-px w-full bg-linen transition-transform duration-300",
                    menuOpen ? "-translate-y-[4px] -rotate-45" : "",
                  ].join(" ")}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* mobile overlay */}
      <div
        className={[
          "fixed inset-0 z-40 flex flex-col justify-end bg-ink-0/60 backdrop-blur-2xl lg:hidden",
          "transition-opacity duration-500",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Mobile" className="px-8 pb-14">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li
                key={item.href}
                className="overflow-hidden"
                style={{
                  transition: `transform 600ms var(--ease-out) ${80 + i * 55}ms, opacity 600ms ${80 + i * 55}ms`,
                  transform: menuOpen ? "translateY(0)" : "translateY(24px)",
                  opacity: menuOpen ? 1 : 0,
                }}
              >
                <Link
                  href={item.href}
                  className="display block py-2 text-4xl text-linen"
                >
                  {item.label}
                </Link>
                {"dropdown" in item && item.dropdown && (
                  <ul className="mb-3 mt-1 space-y-2 border-l border-hairline pl-5">
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}/`}
                          className="block text-[13px] text-linen-dim"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/#contact"
            className="mt-8 inline-flex rounded-full border border-verdigris/60 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-verdigris"
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}

function navLinkCls(active: boolean) {
  return [
    "relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px]",
    "transition-colors duration-200",
    active ? "text-linen" : "text-linen-dim hover:text-linen",
    active
      ? "after:absolute after:-bottom-0.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-verdigris"
      : "",
  ].join(" ");
}

function Caret() {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true">
      <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

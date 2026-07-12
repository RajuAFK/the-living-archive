"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis, unregisterLenis } from "@/lib/scroll-lock";

/**
 * Buttery inertial scrolling for the whole site.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      anchors: true,
    });
    // let overlays pause/resume scroll instead of fighting it with overflow:hidden
    registerLenis(lenis);

    return () => {
      unregisterLenis(lenis);
      lenis.destroy();
    };
  }, []);

  return null;
}

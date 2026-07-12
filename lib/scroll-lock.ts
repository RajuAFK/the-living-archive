/**
 * Coordinated scroll locking for overlays (mobile menu, archive viewer,
 * pseudo-fullscreen). Two problems this solves:
 *
 *  1. Setting `documentElement.style.overflow = "hidden"` while Lenis keeps
 *     running leaves Lenis fighting the lock — the fix is to actually stop
 *     Lenis, then start it again on release.
 *  2. Nested/overlapping locks (open the archive viewer, then go
 *     fullscreen) must not clobber each other's restore. A reference count
 *     means the page only unlocks once the LAST holder releases.
 */

type LenisLike = { stop: () => void; start: () => void };

let lenis: LenisLike | null = null;
let locks = 0;

/** SmoothScroll registers its instance so locks can pause/resume it. */
export function registerLenis(instance: LenisLike): void {
  lenis = instance;
}
export function unregisterLenis(instance: LenisLike): void {
  if (lenis === instance) lenis = null;
}

export function lockScroll(): void {
  locks += 1;
  if (locks === 1) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll(): void {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.documentElement.style.overflow = "";
    lenis?.start();
  }
}

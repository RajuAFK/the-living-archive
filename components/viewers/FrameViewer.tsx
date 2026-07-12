"use client";

import { useEffect, useRef, useState } from "react";

const SANDBOX =
  "allow-scripts allow-same-origin allow-popups allow-pointer-lock allow-forms";
const ALLOW_MUTED = "fullscreen; accelerometer; gyroscope; xr-spatial-tracking";
const ALLOW_UNMUTED =
  "fullscreen; accelerometer; gyroscope; xr-spatial-tracking; autoplay";

/**
 * Interactive frame for 360° tours, gigapixels and 3D models.
 *
 * Poster-first: the heavy iframe mounts only after an explicit gesture
 * (tap "Enter", or go straight to fullscreen). Audio stays sandboxed-muted
 * until the visitor opts in while fullscreen — leaving fullscreen re-mutes.
 */
export function FrameViewer({
  src,
  title,
  poster,
  kindLabel,
  className = "",
  eager = false,
}: {
  src: string;
  title: string;
  poster?: string | null;
  /** e.g. "360° tour", "Gigapixel", "3D model" */
  kindLabel: string;
  className?: string;
  /** Mount the iframe immediately (viewer already opened deliberately). */
  eager?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(eager);
  const [unmuted, setUnmuted] = useState(false);
  const [nativeFs, setNativeFs] = useState(false);
  // iOS Safari has no Fullscreen API for non-<video> elements, so we fall back
  // to a CSS "pseudo-fullscreen" (fixed, covering the viewport) that works
  // everywhere. `isFullscreen` covers both modes.
  const [pseudoFs, setPseudoFs] = useState(false);
  const isFullscreen = nativeFs || pseudoFs;

  useEffect(() => {
    const onChange = () => {
      const fs = document.fullscreenElement === containerRef.current;
      setNativeFs(fs);
      if (!fs) setUnmuted(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // pseudo-fullscreen: lock body scroll + allow Esc to exit
  useEffect(() => {
    if (!pseudoFs) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPseudoFs(false);
        setUnmuted(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [pseudoFs]);

  const toggleFullscreen = async () => {
    setLoaded(true); // mount on the same gesture so fullscreen never shows the poster
    if (isFullscreen) {
      if (document.fullscreenElement) await document.exitFullscreen?.();
      setPseudoFs(false);
      setUnmuted(false);
      return;
    }
    const el = containerRef.current;
    const canNative =
      typeof document !== "undefined" &&
      document.fullscreenEnabled &&
      typeof el?.requestFullscreen === "function";
    if (canNative) {
      try {
        await el!.requestFullscreen();
        return;
      } catch {
        // fall through to pseudo-fullscreen
      }
    }
    setPseudoFs(true);
  };

  return (
    <div
      ref={containerRef}
      className={`media-box ${className} ${
        pseudoFs ? "!fixed !inset-0 !z-[200] !rounded-none" : ""
      }`}
    >
      {loaded ? (
        <iframe
          key={unmuted ? "live" : "muted"}
          src={src}
          title={title}
          allowFullScreen
          allow={unmuted ? ALLOW_UNMUTED : ALLOW_MUTED}
          sandbox={unmuted ? undefined : SANDBOX}
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 block w-full cursor-pointer text-left"
          aria-label={`Load ${title}`}
        >
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-75"
              style={{ filter: "saturate(0.85)" }}
            />
          )}
          <span
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 55%, rgba(11,10,8,0.1) 0%, rgba(11,10,8,0.82) 90%)",
            }}
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="label-mono !text-verdigris-bright">
              ● {kindLabel} · interactive
            </span>
            <span className="display max-w-sm text-2xl text-linen">{title}</span>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-verdigris/60 bg-ink-0/50 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.26em] text-verdigris backdrop-blur-sm transition-colors duration-300 group-hover:bg-verdigris group-hover:text-ink-0">
              Enter
            </span>
          </span>
        </button>
      )}

      {/* fullscreen toggle — clears the iOS notch when pseudo-fullscreen */}
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="glass absolute right-3 z-[3] inline-flex h-9 w-9 items-center justify-center rounded-full text-linen transition-colors duration-200 hover:text-verdigris-bright"
        style={{
          position: "absolute",
          top: pseudoFs ? "calc(0.75rem + env(safe-area-inset-top, 0px))" : "0.75rem",
        }}
      >
        {isFullscreen ? <IconExitFull /> : <IconFull />}
      </button>

      {/* audio opt-in — fullscreen only. Bottom-centered so it never overlaps a
          title bar (the media's own, or the viewer header) at the top. Sits
          above the iOS safe-area inset. */}
      {loaded && isFullscreen && (
        <button
          type="button"
          onClick={() => setUnmuted((v) => !v)}
          className={[
            "absolute bottom-5 left-1/2 z-[2] inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2.5",
            "font-mono text-[10px] uppercase tracking-[0.24em] backdrop-blur-md transition-colors duration-200",
            unmuted
              ? "bg-verdigris text-ink-0"
              : "border border-linen/30 bg-ink-0/70 text-linen",
          ].join(" ")}
          style={{ position: "absolute", bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
        >
          {unmuted ? "Mute audio" : "Unmute audio"}
        </button>
      )}
    </div>
  );
}

function IconFull() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M2 6 V2 H6" />
      <path d="M14 6 V2 H10" />
      <path d="M2 10 V14 H6" />
      <path d="M14 10 V14 H10" />
    </svg>
  );
}

function IconExitFull() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M6 2 V6 H2" />
      <path d="M10 2 V6 H14" />
      <path d="M6 14 V10 H2" />
      <path d="M10 14 V10 H14" />
    </svg>
  );
}

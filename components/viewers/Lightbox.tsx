"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mediaUrl } from "@/lib/media";

/**
 * Plate-by-plate gallery viewer: keyboard arrows, swipe, thumb rail.
 * Preloads neighbours so paging never flashes.
 */
export function Lightbox({
  images,
  title,
  className = "",
}: {
  images: string[];
  title: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // preload neighbours
  useEffect(() => {
    for (const d of [1, -1]) {
      const img = new Image();
      img.src = mediaUrl(images[(index + d + images.length) % images.length]);
    }
  }, [index, images]);

  return (
    <div className={`flex h-full min-h-0 flex-col ${className}`}>
      <div
        className="media-box relative min-h-0 flex-1"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={index}
          src={mediaUrl(images[index])}
          alt={`${title} — plate ${index + 1} of ${images.length}`}
          style={{ objectFit: "contain", background: "#000" }}
        />

        {images.length > 1 && (
          <>
            <PagerButton side="left" onClick={() => go(-1)} />
            <PagerButton side="right" onClick={() => go(1)} />
          </>
        )}

        <span className="label-mono absolute bottom-3 left-4 z-[2] !text-linen/80">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* thumb rail */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={`${title} plates`}>
          {images.map((src, i) => (
            <button
              key={src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Plate ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "media-box h-14 w-20 shrink-0 transition-all duration-300",
                i === index
                  ? "opacity-100 outline outline-1 outline-verdigris"
                  : "opacity-45 hover:opacity-80",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(src)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PagerButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous plate" : "Next plate"}
      className={[
        "glass absolute top-1/2 z-[2] inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full",
        "text-linen transition-all duration-200 hover:text-verdigris-bright",
        side === "left" ? "left-3" : "right-3",
      ].join(" ")}
      style={{ position: "absolute" }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        style={{ transform: side === "left" ? "rotate(180deg)" : undefined }}
      >
        <path d="M3 8h10M9 3l5 5-5 5" />
      </svg>
    </button>
  );
}

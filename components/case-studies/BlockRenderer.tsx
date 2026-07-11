import Link from "next/link";
import type { CaseBlock } from "@/lib/case-studies";
import { mediaUrl } from "@/lib/media";
import { FrameViewer } from "@/components/viewers/FrameViewer";

/**
 * Lays a case study's blocks into an editorial flow. Media blocks placed
 * `left`/`right` float inside the running text so paragraphs wrap around
 * them; `full` breaks out to the viewport edge; `inset` sits inside the
 * measure. A `clear` is applied before headings/quotes/CTAs so floats never
 * bleed into the next movement of the piece.
 */
export function BlockRenderer({ blocks }: { blocks: CaseBlock[] }) {
  return (
    <div className="cs-flow mx-auto max-w-[720px] px-6 md:px-0">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
      <div style={{ clear: "both" }} />
    </div>
  );
}

function Block({ block }: { block: CaseBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          className="display mb-6 mt-14 text-3xl"
          style={{ clear: "both", color: "var(--fg)" }}
        >
          {block.text}
        </h2>
      );

    case "text":
      return (
        <>
          {block.text
            .split(/\n\s*\n/)
            .filter((p) => p.trim() !== "")
            .map((p, i) => (
              <p
                key={i}
                className="mb-5 text-[16px] leading-[1.75]"
                style={{ color: "var(--fg)" }}
              >
                {p.trim()}
              </p>
            ))}
        </>
      );

    case "quote":
      return (
        <blockquote className="my-12" style={{ clear: "both" }}>
          <p className="display text-2xl italic leading-snug" style={{ color: "var(--fg)" }}>
            “{block.text}”
          </p>
          {block.attribution && (
            <cite className="label-mono mt-4 block not-italic">{block.attribution}</cite>
          )}
        </blockquote>
      );

    case "cta":
      return (
        <div className="my-12" style={{ clear: "both" }}>
          <Link
            href={block.href}
            className="inline-flex items-center gap-3 rounded-full border px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] transition-all duration-300"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 60%, transparent)",
              color: "var(--accent)",
            }}
          >
            {block.label} →
          </Link>
        </div>
      );

    case "media": {
      const media =
        block.kind === "frame" ? (
          <FrameViewer
            className="aspect-[4/3] rounded-lg"
            src={mediaUrl(block.src)}
            title={block.caption ?? "Interactive frame"}
            kindLabel="Interactive"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(block.src)}
            alt={block.caption ?? ""}
            loading="lazy"
            className="w-full rounded-lg"
            style={{ display: "block" }}
          />
        );

      const caption = block.caption && (
        <figcaption className="label-mono mt-3">{block.caption}</figcaption>
      );

      if (block.placement === "full") {
        return (
          <figure
            className="my-12 w-screen max-w-none"
            style={{
              clear: "both",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
            }}
          >
            <div className="mx-auto max-w-[1400px] px-6 md:px-10">
              {media}
              {caption}
            </div>
          </figure>
        );
      }

      if (block.placement === "inset") {
        return (
          <figure className="my-10" style={{ clear: "both" }}>
            {media}
            {caption}
          </figure>
        );
      }

      const width = Math.min(60, Math.max(25, block.width ?? 42));
      return (
        <figure
          className={block.placement === "left" ? "mb-6 mr-8" : "mb-6 ml-8"}
          style={{
            float: block.placement,
            width: `${width}%`,
            marginTop: "0.4rem",
          }}
        >
          {media}
          {caption}
        </figure>
      );
    }
  }
}

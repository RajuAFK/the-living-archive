/**
 * Visible placeholder for copy the studio has not supplied yet.
 * Every instance is tracked in CONTENT-TODO.md by its `id`.
 * Deliberately unmistakable — nothing here should ever ship as-is.
 */
export function TodoSlot({
  id,
  hint,
  className = "",
}: {
  /** Stable identifier, e.g. "home.about.narrative" */
  id: string;
  /** What the copy should cover, so the studio knows what to write. */
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-dashed p-4 ${className}`}
      style={{ borderColor: "var(--hairline-strong)" }}
      data-copy-todo={id}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--accent)" }}>
        ◌ copy pending — {id}
      </p>
      <p className="mt-2 text-[13px] italic leading-relaxed" style={{ color: "var(--fg-dim)" }}>
        {hint}
      </p>
    </div>
  );
}

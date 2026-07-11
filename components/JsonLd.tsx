/**
 * Emits a JSON-LD <script>. Server-rendered into the static HTML so crawlers
 * and AI assistants read it without executing JS.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe inside a script tag; escape the closing
      // sequence defensively in case any copy contains "</script>".
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

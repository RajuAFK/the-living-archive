import { Reveal } from "@/components/Reveal";
import { TodoSlot } from "@/components/TodoSlot";

const ACTS = [
  {
    n: "I",
    name: "capture",
    todo: {
      id: "home.process.capture",
      hint: "How the studio gathers high-quality input data — the photographic principles, instruments and field discipline behind every capture.",
    },
  },
  {
    n: "II",
    name: "process",
    todo: {
      id: "home.process.process",
      hint: "How raw captures are processed and enriched — stitching, reconstruction, color, metadata.",
    },
  },
  {
    n: "III",
    name: "access",
    todo: {
      id: "home.process.access",
      hint: "How access is set up around the client's and the subject's needs — hosting, viewers, archives, rights.",
    },
  },
] as const;

/**
 * The studio's discipline in three acts. The tagline made the promise;
 * this section explains it. Copy pending from the studio.
 */
export function ProcessSection() {
  return (
    <section id="process" className="relative bg-ink-1">
      <div className="mx-auto max-w-[1200px] px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="label-mono">The discipline</p>
          <p className="display mt-6 max-w-2xl text-3xl text-linen md:text-4xl">
            A photography studio&apos;s rigour, carried into <em>every</em> way of
            capturing reality.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
          {ACTS.map((act, i) => (
            <Reveal key={act.name} delay={i * 0.12}>
              <div className="hairline-t pt-8">
                <span className="display block text-7xl italic text-verdigris/85 md:text-8xl">
                  {act.n}
                </span>
                <h3 className="display mt-6 text-3xl lowercase text-linen">
                  {act.name}
                  <span className="text-verdigris">.</span>
                </h3>
                <TodoSlot id={act.todo.id} hint={act.todo.hint} className="mt-6" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "@/components/Reveal";

const ACTS = [
  {
    n: "I",
    name: "capture",
    body: "A monument, an artefact, or a construction milestone rarely offers a second chance — so the data has to be right the first time. Built on thirty years of professional photography, each shoot is planned around the asset's scale, fragility, and setting, the instruments matched to the job. The tools change from project to project; the discipline behind them does not.",
  },
  {
    n: "II",
    name: "process",
    body: "Raw captures are only the input. Overlapping frames are reconstructed into accurate 3D geometry, panoramas stitched into seamless gigapixel environments, and colour managed to stay faithful to the original. To the geometry we add provenance, cataloguing, and preservation metadata — so a file is never just a model, but a record a conservator can trust decades later.",
  },
  {
    n: "III",
    name: "access",
    body: "Access is shaped by two questions: what the client needs, and what the subject deserves. Some work is made public — a virtual tour, a searchable collection; other work stays institutional — a secure archive, a preservation package. We build hosting, viewers, and archives to fit that intent, delivered in the form the client will actually use.",
  },
] as const;

/**
 * The studio's discipline in three acts. The tagline made the promise;
 * this section explains it.
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
                <p className="mt-6 text-[14px] leading-[1.7] text-linen-dim">
                  {act.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

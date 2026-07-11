import { Reveal } from "@/components/Reveal";

const ACTS = [
  {
    n: "I",
    name: "capture",
    body: "Every project begins with data that has to be right the first time, because a monument, an artefact, or a construction milestone rarely offers a second chance. Our capture practice is built on more than thirty years in professional photography: controlled lighting, correct exposure, and an understanding of how a subject reads to the lens before a single frame is taken. We plan each shoot around the asset's constraints — its scale, its fragility, its accessibility, the conditions on site — rather than forcing the asset to fit a fixed method. Professional DSLR and mirrorless systems, heritage and architectural lenses, drone platforms for aerial coverage, and panoramic rigs are matched to the job, with metadata recorded at the point of capture. The instrument changes from project to project; the field discipline behind it does not.",
  },
  {
    n: "II",
    name: "process",
    body: "Raw captures are only the input. In processing, hundreds or thousands of overlapping images are aligned and reconstructed into accurate 3D geometry, panoramas are stitched into seamless high-resolution and gigapixel environments, and color is managed so the digital record faithfully represents the original. Meshes are built and textured, point clouds cleaned, and every asset checked against the source under a formal quality-assurance step. Alongside the geometry, we attach the context that makes data usable decades later — provenance, cataloguing, and preservation metadata — so a file is never just a model, but a documented record that a researcher or conservator can trust and reuse.",
  },
  {
    n: "III",
    name: "access",
    body: "Access is designed around two questions: what the client needs, and what the subject deserves. Some work is meant for the public — a virtual tour, an interactive walkthrough, a searchable collection. Other work is institution-only: a secure archive, a preservation package, an asset-management repository accessed by conservators and administrators. We set up hosting, viewers, and archives to fit that intent, with the client's rights and the sensitivity of the material governing who can see what. The result is delivered in the form the client will actually use, from web-based immersive experiences to structured, institution-specific archival packages built to last.",
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

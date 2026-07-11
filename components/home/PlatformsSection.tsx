import { Reveal } from "@/components/Reveal";
import { FACTS } from "@/lib/site";

const TIV_COPY =
  "Our immersive access layer, live since 2013. It turns documented places — heritage sites, museums, campuses, tourism and healthcare facilities — into interactive environments anyone can explore, closing the gap between documentation and experience.";

const VM_COPY =
  "A public platform for heritage and education, holding Gaussian-splat 3D captures and gigapixel imagery of monuments, artefacts, and artworks. Built to be explored freely rather than viewed from a fixed vantage — and to grow with every project we add.";

/**
 * Public access platforms built by the studio — where anyone can explore
 * heritage sites and culturally significant objects. Presented as equal
 * editorial rows: identity column, name column, description column.
 */
export function PlatformsSection() {
  return (
    <section id="platforms" className="relative bg-ink-0">
      <div className="mx-auto max-w-[1200px] px-6 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="label-mono">Open to the public</p>
          <p className="display mt-6 max-w-2xl text-3xl text-linen md:text-4xl">
            Access platforms we built for <em>everyone</em> — not just our
            clients.
          </p>
        </Reveal>

        <div className="mt-16">
          {/* Tour It Virtually */}
          <Reveal>
            <a
              href={FACTS.platforms.tourItVirtually}
              target="_blank"
              rel="noopener noreferrer"
              className="group hairline-t grid gap-8 py-12 md:grid-cols-[180px_1fr_1.2fr] md:items-center md:gap-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/tiv.png"
                alt="Tour It Virtually"
                className="h-28 w-auto md:h-32 md:justify-self-center"
              />
              <div>
                <p className="label-mono flex items-center gap-2 !text-verdigris">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-verdigris" />
                  Live
                </p>
                <h3 className="display mt-4 text-3xl text-linen transition-colors duration-300 group-hover:text-verdigris-bright md:text-4xl">
                  Tour It Virtually
                  <span
                    aria-hidden="true"
                    className="ml-3 inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </h3>
                <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-linen-dim">
                  touritvirtually.com
                </p>
              </div>
              <p className="text-[14px] leading-[1.7] text-linen-dim">{TIV_COPY}</p>
            </a>
          </Reveal>

          {/* Virtual Museum */}
          <Reveal delay={0.1}>
            <div className="hairline-t grid gap-8 border-b py-12 md:grid-cols-[180px_1fr_1.2fr] md:items-center md:gap-10" style={{ borderBottomColor: "var(--hairline)" }}>
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed md:h-32 md:w-32 md:justify-self-center"
                style={{ borderColor: "var(--hairline-strong)" }}
              >
                <span className="label-mono">Soon</span>
              </div>
              <div>
                <p className="label-mono">In the works</p>
                <h3 className="display mt-4 text-3xl text-linen-dim md:text-4xl">
                  Virtual Museum
                </h3>
                <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-linen-dim/70">
                  Coming soon
                </p>
              </div>
              <p className="text-[14px] leading-[1.7] text-linen-dim">{VM_COPY}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

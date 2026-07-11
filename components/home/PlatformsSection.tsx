import { Reveal } from "@/components/Reveal";
import { TodoSlot } from "@/components/TodoSlot";
import { FACTS } from "@/lib/site";

/**
 * Public access platforms built by the studio — where anyone can explore
 * heritage sites and culturally significant objects.
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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.05}>
            <a
              href={FACTS.platforms.tourItVirtually}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border p-8 transition-colors duration-300 hover:border-verdigris/50 md:p-10"
              style={{ borderColor: "var(--hairline)" }}
            >
              <div className="flex items-start justify-between gap-6">
                <p className="label-mono flex items-center gap-2 !text-verdigris">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-verdigris" />
                  Live
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/tiv.png"
                  alt="Tour It Virtually"
                  className="h-16 w-auto"
                />
              </div>
              <h3 className="display mt-5 text-3xl text-linen transition-colors duration-300 group-hover:text-verdigris-bright">
                Tour It Virtually
                <span aria-hidden="true" className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </h3>
              <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-linen-dim">
                touritvirtually.com
              </p>
              <TodoSlot
                id="home.platforms.touritvirtually"
                hint="One short paragraph on what Tour It Virtually offers the public — which sites/tours are on it and why it exists."
                className="mt-8"
              />
            </a>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              className="rounded-2xl border border-dashed p-8 md:p-10"
              style={{ borderColor: "var(--hairline)" }}
            >
              <p className="label-mono">In the works</p>
              <h3 className="display mt-5 text-3xl text-linen-dim">
                Virtual Museum
              </h3>
              <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-linen-dim/70">
                Coming soon
              </p>
              <TodoSlot
                id="home.platforms.virtualmuseum"
                hint="One short paragraph on the Virtual Museum: what it will hold, who it's for, expected shape. Also confirm the final name/domain."
                className="mt-8"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

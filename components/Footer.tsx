import Link from "next/link";
import { NAV, SERVICES, FACTS } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export function Footer() {
  return (
    <footer id="contact" className="hairline-t relative bg-ink-0">
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          {/* contact */}
          <div>
            <p className="label-mono">Contact us</p>
            <h2 className="display mt-4 max-w-md text-3xl text-linen md:text-4xl">
              Tell us what needs to be <em>preserved</em>.
            </h2>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          {/* details + sitemap */}
          <div className="grid content-start gap-12 sm:grid-cols-2">
            <div className="space-y-6 sm:col-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/praxivision.png"
                alt="Praxivision"
                className="h-[72px] w-auto max-w-full"
                style={{ filter: "brightness(1.65) saturate(0.7)" }}
              />
              <div className="space-y-1 text-[14px]">
                <p className="text-linen">Praxivision Pvt Ltd</p>
                <p className="text-linen-dim">
                  1-11-182/G1, Begumpet,
                  <br />
                  Hyderabad — 500016, India
                </p>
                <p className="pt-2">
                  <a
                    href={`mailto:${FACTS.contactEmail}`}
                    className="text-linen-dim transition-colors hover:text-verdigris-bright"
                  >
                    {FACTS.contactEmail}
                  </a>
                </p>
              </div>
            </div>

            <nav aria-label="Site">
              <p className="label-mono mb-4">Site</p>
              <ul className="space-y-2.5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[14px] text-linen-dim transition-colors hover:text-linen"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Services">
              <p className="label-mono mb-4">Services</p>
              <ul className="space-y-2.5">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}/`}
                      className="text-[14px] text-linen-dim transition-colors hover:text-linen"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Platforms" className="sm:col-span-2">
              <p className="label-mono mb-4">Public platforms</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-2.5">
                <li>
                  <a
                    href={FACTS.platforms.tourItVirtually}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-linen-dim transition-colors hover:text-linen"
                  >
                    Tour It Virtually ↗
                  </a>
                </li>
                <li>
                  <span className="text-[14px] text-linen-dim/60">
                    Virtual Museum{" "}
                    <span className="font-mono text-[10px] tracking-[0.2em]">
                      SOON
                    </span>
                  </span>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="hairline-t mt-20 flex flex-wrap items-center justify-between gap-4 pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/praxivision.png"
            alt="Praxivision"
            className="h-[14px] w-auto opacity-70"
            style={{ filter: "brightness(1.65) saturate(0.7)" }}
          />
          <p className="font-mono text-[10px] tracking-[0.2em] text-linen-dim">
            © {new Date().getFullYear()} PRAXIVISION PVT LTD · SINCE {FACTS.since}
          </p>
        </div>
      </div>
    </footer>
  );
}

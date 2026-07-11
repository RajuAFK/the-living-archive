import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/site";
import { SERVICE_BACKDROPS } from "@/lib/service-media";
import { mediaUrl } from "@/lib/media";
import { Reveal } from "@/components/Reveal";
import { TodoSlot } from "@/components/TodoSlot";
import { SERVICE_COPY } from "@/lib/service-copy";
import { ServiceShowcase } from "@/components/services/ServiceShowcase";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  return {
    title: service ? `${service.name} — Praxivision` : "Services — Praxivision",
    description: service ? `${service.name}: ${service.scope}.` : undefined,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = SERVICES.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const service = SERVICES[index];
  const prev = SERVICES[(index + SERVICES.length - 1) % SERVICES.length];
  const next = SERVICES[(index + 1) % SERVICES.length];

  return (
    <div>
      {/* hero band */}
      <header className="relative flex min-h-[68svh] items-end overflow-hidden bg-ink-0 pt-[76px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(SERVICE_BACKDROPS[service.slug])}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          style={{ filter: "saturate(0.8)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,10,8,0.95) 0%, rgba(11,10,8,0.35) 45%, rgba(11,10,8,0.15) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-16 md:px-10 md:pb-20">
          <Reveal>
            <p className="label-mono">
              Service {String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
              {service.flagship && (
                <span className="ml-3 !text-verdigris">· End-to-end pipeline</span>
              )}
            </p>
            <h1 className="display mt-5 max-w-4xl text-4xl text-linen sm:text-5xl md:text-6xl">
              {service.name}
              <span className="text-verdigris">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] text-linen-dim">{service.scope}</p>
          </Reveal>
        </div>
      </header>

      {/* what it achieves */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="label-mono">What it achieves</p>
          </Reveal>
          <Reveal delay={0.1}>
            {SERVICE_COPY[service.slug] ? (
              <div className="space-y-6">
                {SERVICE_COPY[service.slug].map((para, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "display text-2xl leading-snug text-linen md:text-3xl"
                        : "max-w-2xl text-[15px] leading-[1.75] text-linen-dim"
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <TodoSlot
                id={`services.${service.slug}.body`}
                hint={`The full narrative for "${service.name}".`}
                className="min-h-[220px]"
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* live archive pulls */}
      <section className="pb-24 md:pb-32">
        <ServiceShowcase query={service.archiveQuery} serviceName={service.name} />
      </section>

      {/* prev / next */}
      <nav aria-label="More services" className="hairline-t">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 px-6 md:px-10">
          <Link href={`/services/${prev.slug}/`} className="group py-10 pr-6">
            <p className="label-mono">← Previous</p>
            <p className="display mt-3 text-xl text-linen-dim transition-colors group-hover:text-linen md:text-2xl">
              {prev.name}
            </p>
          </Link>
          <Link
            href={`/services/${next.slug}/`}
            className="group border-l py-10 pl-6 text-right"
            style={{ borderColor: "var(--hairline)" }}
          >
            <p className="label-mono">Next →</p>
            <p className="display mt-3 text-xl text-linen-dim transition-colors group-hover:text-linen md:text-2xl">
              {next.name}
            </p>
          </Link>
        </div>
      </nav>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/site";
import { SERVICE_BACKDROPS } from "@/lib/service-media";
import { mediaUrl } from "@/lib/media";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six ways of preserving reality: heritage documentation, photogrammetry & 3D digitization, digital twins, industrial documentation, virtual tours, and the end-to-end archival pipeline.",
  alternates: { canonical: "/services/" },
  openGraph: { title: "Services · Praxivision", url: "/services/", type: "website" },
};

export default function ServicesIndex() {
  return (
    <div className="pt-[76px]">
      <header className="mx-auto max-w-[1400px] px-6 pb-6 pt-16 md:px-10 md:pt-24">
        <p className="label-mono">Six disciplines, one pipeline</p>
        <h1 className="display mt-4 text-5xl text-linen md:text-7xl">
          Services<span className="text-verdigris">.</span>
        </h1>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-6 pb-28 pt-10 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.07}>
            <Link href={`/services/${s.slug}/`} className="group block">
              <div className="media-box aspect-[4/3] overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(SERVICE_BACKDROPS[s.slug])}
                  alt=""
                  aria-hidden="true"
                  loading={i < 3 ? "eager" : "lazy"}
                  className="opacity-80 transition-all duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.045] group-hover:opacity-100"
                  style={{ filter: "saturate(0.85)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-0/90 via-ink-0/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="label-mono !text-linen/80">
                    {String(i + 1).padStart(2, "0")}
                    {s.flagship && <span className="ml-2 !text-verdigris">END-TO-END</span>}
                  </p>
                  <h2 className="display mt-2 text-2xl leading-tight text-linen transition-colors duration-200 group-hover:text-verdigris-bright">
                    {s.name}
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-[13px] text-linen-dim">{s.scope}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { mediaUrl } from "@/lib/media";
import { FACTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio — Praxivision",
  description:
    "A photography studio whose discipline evolved into 3D capture, 360° capture, gigapixel imaging and reality capture.",
};

/** The four ways the studio's photographic craft now captures reality. */
const CRAFTS = [
  {
    name: "3D capture",
    sample: "/portfolio/3D%20Models/lepakshi-ganesha/lepakshi-ganesha.png",
    archiveHref: "/archives/?domain=3d",
    cta: "3D in the archives",
    body: "Photogrammetry is photography before it is geometry. The accuracy of a 3D model depends entirely on how each frame is lit, exposed, and overlapped at capture — which is why three decades behind the lens matter more here than any software setting. We treat every object as a photographic subject first, and the measurable 3D result follows from that discipline.",
  },
  {
    name: "360° capture",
    sample: "/portfolio/Praxis%20VRs/Thumbnails%20for%20Web%20Gallereis/LSCH_Thumb.jpg",
    archiveHref: "/archives/?domain=vr-360",
    cta: "360° tours in the archives",
    body: "A 360° environment is only as immersive as the images it's stitched from. Correct exposure, consistent lighting, and precise panoramic capture are what let dozens of frames resolve into a single seamless space with no visible seams or shifts. The immersion people feel in a virtual tour is really the photographic craft behind every node.",
  },
  {
    name: "Gigapixel",
    sample: "/portfolio/Gigapans/Paintings/Ravivarma_Painting.jpg",
    archiveHref: "/archives/?domain=gigapixel",
    cta: "Gigapixels in the archives",
    body: "Gigapixel imaging captures a painting or artefact in more detail than the eye can take in at once — every brushstroke, crack, and texture held at archival resolution. It demands methodical capture and flawless color management across hundreds of individual frames. This is where fine-art photography and digital preservation meet: a record faithful enough to study long after the original has aged.",
  },
  {
    name: "Reality capture",
    sample: "/portfolio/Gigapans/Golconda_Gigapan/Golconda_Gigapan.png",
    archiveHref: "/archives/?industry=heritage",
    cta: "Heritage capture in the archives",
    body: "Reality capture translates a physical space into accurate spatial data, but the quality of that data begins with how the space is read and photographed. Field discipline — planning coverage, controlling light, choosing the right instrument for the conditions — is what turns raw scans into a dependable digital twin. The technology captures the space; the photographic craft is what makes it trustworthy.",
  },
];

export default function StudioPage() {
  return (
    <div>
      {/* hero */}
      <header className="relative flex min-h-[60svh] items-end bg-ink-0 pt-[76px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-16 md:px-10 md:pb-20">
          <Reveal>
            <p className="label-mono">Behind the archive · since {FACTS.since}</p>
            <h1 className="display mt-4 text-5xl text-linen md:text-7xl">
              The studio<span className="text-verdigris">.</span>
            </h1>
            <p className="display mt-8 max-w-2xl text-2xl text-linen-dim md:text-3xl">
              Every instrument we point at reality was earned through{" "}
              <em className="text-linen">photography</em>.
            </p>
          </Reveal>
        </div>
      </header>

      {/* the man behind it — light reading room */}
      <section className="reading-room">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="label-mono">The man behind it</p>
              <div
                className="mt-8 flex aspect-[4/5] items-center justify-center rounded-lg border border-dashed"
                style={{ borderColor: "var(--hairline-strong)" }}
                data-copy-todo="studio.portrait"
              >
                <p className="label-mono text-center">
                  ◌ portrait pending
                  <br />
                  <span className="normal-case tracking-normal" style={{ letterSpacing: 0 }}>
                    (studio.portrait — supply a photograph)
                  </span>
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col justify-center gap-10">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/praxis-studio.png"
                  alt="Praxis Studio"
                  className="h-16 w-auto"
                />
                <h2 className="display mt-8 text-3xl md:text-4xl" style={{ color: "var(--fg)" }}>
                  B. Sridhar Raju
                </h2>
                <p className="label-mono mt-2">Founder · Praxis Studio, est. 1992</p>
              </div>

              <div className="space-y-5 text-[16px] leading-[1.75]" style={{ color: "var(--fg)" }}>
                <p>
                  B. Sridhar Raju began working as an industrial and advertising
                  photography professional in 1992 — the year he graduated in
                  Photography from JNAFAU, Hyderabad, and the year he established
                  Praxis Studio.
                </p>
                <p>
                  What followed was three decades of commissioned work across
                  industry, healthcare, hospitality and advertising — and, running
                  alongside it, a longer devotion: photographing temples, sculptures,
                  fine art and heritage sites, including over twenty-five years of
                  documentation work with Tirumala Tirupati Devasthanams and
                  assignments as far afield as the Angkor Archaeological Park in
                  Cambodia.
                </p>
                <p>
                  The discipline never changed — light, lens, patience — but the
                  instruments grew: close-range photogrammetry, 360° capture,
                  gigapixel imaging, reality capture. Each one an extension of the
                  same photographic craft into another dimension of record.
                </p>
                <p>
                  Praxivision is where that journey was always heading: a company
                  established to preserve the culture and heritage of the world in
                  digital form — for future generations to access.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* mission & vision */}
      <section className="hairline-t bg-ink-1">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-14 md:grid-cols-2 md:gap-10">
            <Reveal>
              <p className="label-mono !text-verdigris">Mission</p>
              <p className="display mt-6 text-2xl leading-snug text-linen md:text-3xl">
                To digitally preserve heritage, institutions and significant
                assets — through advanced imaging, photogrammetry, immersive
                technologies and preservation-ready digital archives.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="label-mono !text-verdigris">Vision</p>
              <p className="display mt-6 text-2xl leading-snug text-linen md:text-3xl">
                That the knowledge held in monuments, manuscripts, sculptures
                and collections is never lost to neglect, time or disaster —
                fragile physical heritage, carried into <em>permanent digital
                memory</em>.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* craft translation */}
      <section className="bg-ink-0">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
          <Reveal>
            <p className="label-mono">One craft, four instruments</p>
            <p className="display mt-6 max-w-2xl text-3xl text-linen md:text-4xl">
              Photography, translated into <em>every</em> dimension.
            </p>
          </Reveal>

          <div className="mt-16 space-y-0">
            {CRAFTS.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <div className="hairline-t grid gap-8 py-10 md:grid-cols-[1fr_1.4fr_1fr] md:items-center">
                  <h3 className="display text-2xl text-linen md:text-3xl">
                    <span className="mr-4 font-mono text-[11px] tracking-[0.2em] text-verdigris">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c.name}
                  </h3>
                  <div className="space-y-5">
                    <p className="text-[14px] leading-[1.7] text-linen-dim">{c.body}</p>
                    <Link
                      href={c.archiveHref}
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-verdigris transition-colors hover:text-verdigris-bright"
                    >
                      {c.cta} →
                    </Link>
                  </div>
                  <div className="media-box aspect-[3/2] overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(c.sample)}
                      alt={`${c.name} — sample from the archive`}
                      loading="lazy"
                      style={{ filter: "saturate(0.9)" }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <Link
              href="/archives/"
              className="inline-flex items-center gap-3 rounded-full border border-verdigris/60 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-verdigris transition-all duration-300 hover:bg-verdigris hover:text-ink-0"
            >
              The proof is in the archives →
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

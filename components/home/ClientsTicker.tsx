import { Reveal } from "@/components/Reveal";

/**
 * Curated cross-industry selection (healthcare, pharma, corporate, industrial,
 * FMCG, hospitality, education, infrastructure, advertising, consumer,
 * agri, logistics). Full inventory lives in public/clients/ — swap freely.
 */
const STRIPS: { name: string; src: string }[][] = [
  [
    { name: "Apollo Hospitals", src: "/clients/healthcare/Apollo_Hospitals_Logo.png" },
    { name: "GE", src: "/clients/corporate/GE_Logo.png" },
    { name: "ITC Limited", src: "/clients/industrial/ITC_Limited_Logo.png" },
    { name: "Dr Reddy's", src: "/clients/pharmaceuticals/DR_Reddys_Logo.png" },
    { name: "ISB", src: "/clients/educational/ISB_Logo.png" },
    { name: "MRF", src: "/clients/industrial/MRF_Logo.png" },
    { name: "Qualcomm", src: "/clients/corporate/Qualcomm_Logo.png" },
    { name: "Ramoji Film City", src: "/clients/hospitality/Ramoji_Logo.png" },
    { name: "Godrej", src: "/clients/industrial/Godrej_Logo.png" },
    { name: "Bharat Biotech", src: "/clients/pharmaceuticals/Bharat_Biotech_Logo.png" },
    { name: "IIM Indore", src: "/clients/educational/IIM-Indore_Logo.png" },
    { name: "L V Prasad Eye Institute", src: "/clients/healthcare/LVPEI_Logo.png" },
  ],
  [
    { name: "Kamineni Hospitals", src: "/clients/healthcare/Kamineni_Logo.png" },
    { name: "Bayer Crop Science", src: "/clients/seeds-fertilisers/Bayer_Crop_Sciences_Logo.png" },
    { name: "Mercure", src: "/clients/hospitality/Mercure_Logo.png" },
    { name: "Amaron", src: "/clients/industrial/Amaron_Logo.png" },
    { name: "DE Shaw & Co", src: "/clients/corporate/DE Shaw&Co_Logo.png" },
    { name: "Heritage Foods", src: "/clients/food/Heritage_Logo.png" },
    { name: "HMT Watches", src: "/clients/consumer-durables/HMT_Watches_Logo.png" },
    { name: "Hitex", src: "/clients/hospitality/Hitex_Logo.png" },
    { name: "Gati", src: "/clients/logistics/Gati_Logo.png" },
    { name: "Bata", src: "/clients/consumer-durables/Bata_Logo.png" },
    { name: "Ogilvy & Mather", src: "/clients/advertising/O&M_Logo.png" },
    { name: "Care Hospitals", src: "/clients/healthcare/Care_Logo.png" },
  ],
  [
    { name: "Cyient", src: "/clients/corporate/Cyient_Logo.png" },
    { name: "Lanco", src: "/clients/industrial/Lanco_Logo.png" },
    { name: "Priya Foods", src: "/clients/food/Priya_Logo.png" },
    { name: "SEW Infrastructure", src: "/clients/infrastructure/SEW_Logo.png" },
    { name: "Star Hospitals", src: "/clients/healthcare/Star_Hospital_Logo.png" },
    { name: "Satyam Computers", src: "/clients/corporate/Satyam_Computers_Logo.png" },
    { name: "Kirby", src: "/clients/industrial/Kirby_Logo.png" },
    { name: "JK Seeds", src: "/clients/seeds-fertilisers/JK_SEEDS_Logo.png" },
    { name: "Vijaya Diagnostics", src: "/clients/healthcare/Vijaya_Diagnostics_Logo.png" },
    { name: "RK Swamy", src: "/clients/advertising/RK_Swamy_Logo.png" },
    { name: "Joy Icecreams", src: "/clients/food/Joy_Icecreams_Logo.png" },
    { name: "CA Technologies", src: "/clients/corporate/CA_Logo.png" },
  ],
];

/**
 * Client logo tickers. Original color marks on ivory plates; each strip's
 * content is duplicated once and the keyframes travel exactly -50%, and every
 * plate is a fixed-size box with eagerly-loaded imagery — widths never change
 * mid-animation, so the loop has no visible reset.
 */
export function ClientsTicker() {
  return (
    <section
      id="clients"
      className="reading-room relative overflow-hidden py-24 md:py-32"
      // pure white so logos with opaque white canvases sit invisibly on it
      style={{ background: "#ffffff" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <p className="label-mono">Trusted with their image</p>
          <p className="display mt-6 max-w-2xl text-3xl md:text-4xl" style={{ color: "var(--fg)" }}>
            A range of clients, across <em>industries</em>.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 space-y-6">
        {STRIPS.map((logos, i) => (
          <Strip key={i} logos={logos} reverse={i % 2 === 1} duration={58 + i * 9} />
        ))}
      </div>
    </section>
  );
}

function Strip({
  logos,
  reverse,
  duration,
}: {
  logos: { name: string; src: string }[];
  reverse: boolean;
  duration: number;
}) {
  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex w-max gap-16 pr-16 will-change-transform group-hover:[animation-play-state:paused]"
        style={{
          animation: `${reverse ? "ticker-right" : "ticker-left"} ${duration}s linear infinite`,
        }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-16" aria-hidden={dup === 1}>
            {logos.map((l) => (
              <div
                key={`${dup}-${l.src}`}
                title={l.name}
                className="flex h-16 w-36 shrink-0 items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI(l.src)}
                  alt={dup === 0 ? l.name : ""}
                  loading="eager"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

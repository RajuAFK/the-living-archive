/** Central site structure — nav, services taxonomy, canonical facts. */

export type Service = {
  slug: string;
  name: string;
  /** Short qualifier shown in dropdowns / index cards (user-provided scope). */
  scope: string;
  /** Archive deep-link this service CTAs into. */
  archiveQuery: string;
  /** True for the end-to-end pipeline flagship offering. */
  flagship?: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "heritage-cultural-documentation",
    name: "Heritage & Cultural Documentation",
    scope: "Temples, monuments, sites",
    archiveQuery: "industry=heritage",
  },
  {
    slug: "photogrammetry-3d-digitization",
    name: "Photogrammetry & 3D Digitization",
    scope: "Objects, artefacts, sculptures, fine art, gigapixel",
    archiveQuery: "domain=3d",
  },
  {
    slug: "digital-twins-reality-capture",
    name: "Digital Twins & Reality Capture",
    scope: "Heritage structures, facilities, infrastructure",
    archiveQuery: "domain=vr-360",
  },
  {
    slug: "industrial-infrastructure-documentation",
    name: "Industrial & Infrastructure Documentation",
    scope: "Industrial, healthcare, construction progress",
    archiveQuery: "domain=photography",
  },
  {
    slug: "virtual-tours-immersive-experiences",
    name: "Virtual Tours & Immersive Experiences",
    scope: "Shot, hosted, immersively presented",
    archiveQuery: "domain=vr-360",
  },
  {
    slug: "digital-archiving-preservation-pipeline",
    name: "Digital Archiving & Preservation Pipeline",
    scope: "Metadata, DAM, long-term archives",
    archiveQuery: "",
    flagship: true,
  },
];

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services", dropdown: true },
  { href: "/case-studies/", label: "Case Studies" },
  { href: "/archives/", label: "Archives" },
  { href: "/studio/", label: "Studio" },
] as const;

/** User-confirmed facts. Everything else is a copy TODO. */
export const FACTS = {
  brand: "Praxivision",
  since: 1992,
  assignments: 2100,
  tagline: ["capture", "process", "access"],
  platforms: {
    tourItVirtually: "https://touritvirtually.com",
  },
  contactEmail: "praxivision.info@gmail.com",
} as const;

import { SERVICES } from "./site";

/** Canonical production origin. Every absolute URL derives from this. */
export const SITE_URL = "https://praxivision.com";

export const SITE_NAME = "Praxivision";
export const SITE_TAGLINE = "Capture, Process, Access.";
export const SITE_DESCRIPTION =
  "Praxivision is a heritage digitization and digital preservation studio. End-to-end documentation — photography, photogrammetry, 3D digitization, digital twins, gigapixel imaging, 360° virtual tours and long-term archives — for museums, temple trusts, governments and industry. Documenting India's culture and industry since 1992.";

/** Absolute URL helper. */
export const abs = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Site-wide Organization + LocalBusiness schema. This is the anchor entity
 * search engines and AI assistants use to understand who Praxivision is.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": abs("/#organization"),
    name: "Praxivision Pvt Ltd",
    alternateName: "Praxivision",
    url: SITE_URL,
    logo: abs("/brand/praxivision.png"),
    image: abs("/og.jpg"),
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    foundingDate: "1992",
    founder: {
      "@type": "Person",
      name: "B. Sridhar Raju",
      jobTitle: "Founder",
      alumniOf: "Jawaharlal Nehru Architecture and Fine Arts University (JNAFAU), Hyderabad",
      knowsAbout: [
        "Photography",
        "Photogrammetry",
        "Heritage documentation",
        "Digital preservation",
        "Reality capture",
      ],
    },
    email: "praxivision.info@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1-11-182/G1, Begumpet",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500016",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Cambodia" },
    ],
    knowsAbout: [
      "Heritage digitization",
      "Digital preservation",
      "Photogrammetry",
      "3D digitization",
      "Digital twins",
      "Reality capture",
      "Gigapixel imaging",
      "360° virtual tours",
      "Museum documentation",
      "Cultural heritage archiving",
    ],
    sameAs: ["https://touritvirtually.com"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital preservation services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.scope,
          url: abs(`/services/${s.slug}/`),
        },
      })),
    },
  };
}

/** Per-service Service schema. */
export function serviceSchema(service: { slug: string; name: string; scope: string }, body: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": abs(`/services/${service.slug}/#service`),
    name: service.name,
    serviceType: service.name,
    description: body,
    url: abs(`/services/${service.slug}/`),
    provider: { "@id": abs("/#organization") },
    areaServed: { "@type": "Country", name: "India" },
    audience: {
      "@type": "Audience",
      audienceType: "Museums, temple trusts, governments, universities, healthcare and industry",
    },
  };
}

/** BreadcrumbList for a page. Pass ordered [name, path] pairs. */
export function breadcrumbSchema(trail: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

/** WebSite schema (enables sitelinks search box eligibility + entity linking). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": abs("/#organization") },
  };
}

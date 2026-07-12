import type { Metadata } from "next";
import { Fraunces, Archivo, Fragment_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-fragment",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Praxivision — Heritage Digitization & Digital Preservation Studio",
    template: "%s · Praxivision",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "heritage digitization",
    "digital preservation",
    "photogrammetry",
    "3D digitization",
    "digital twins",
    "reality capture",
    "gigapixel imaging",
    "360 virtual tours",
    "museum documentation",
    "cultural heritage archiving",
    "heritage documentation India",
    "Hyderabad",
  ],
  authors: [{ name: "Praxivision Pvt Ltd" }],
  creator: "Praxivision Pvt Ltd",
  publisher: "Praxivision Pvt Ltd",
  alternates: { canonical: "/" },
  category: "Digital Preservation",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Praxivision — Heritage Digitization & Digital Preservation Studio",
    description: SITE_DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Praxivision — capture, process, access.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Praxivision — Heritage Digitization & Digital Preservation",
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${archivo.variable} ${fragmentMono.variable} antialiased`}
    >
      {/* min-h-dvh (not min-h-full) keeps the sticky footer without giving
          <html> a fixed 100% height, which would fight Lenis smooth-scroll. */}
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

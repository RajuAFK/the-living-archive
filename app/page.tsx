import { Hero } from "@/components/home/Hero";
import { SectionRail } from "@/components/home/SectionRail";
import { AboutBrief } from "@/components/home/AboutBrief";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { PlatformsSection } from "@/components/home/PlatformsSection";
import { ClientsTicker } from "@/components/home/ClientsTicker";

const RAIL = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "The studio" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "platforms", label: "Platforms" },
  { id: "clients", label: "Clients" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <SectionRail sections={RAIL} />
      <Hero />
      <AboutBrief />
      <ServicesSection />
      <ProcessSection />
      <PlatformsSection />
      <ClientsTicker />
    </>
  );
}

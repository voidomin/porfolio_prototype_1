import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PublicationsSection } from "@/components/sections/PublicationsSection";
import { PhotographySection } from "@/components/sections/PhotographySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { NatureScene } from "@/components/animations/NatureScene";
import { BirdFlock } from "@/components/animations/BirdFlock";
import { FloatingLeaves } from "@/components/animations/FloatingLeaves";
import { SectionDivider } from "@/components/animations/SectionDivider";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Fixed nature background — sky, mountains, sun, stars */}
      <NatureScene />

      {/* Ambient nature overlays */}
      <BirdFlock />
      <FloatingLeaves />

      {/* Navigation */}
      <Navbar />

      {/* ─── Storytelling Chapters ─── */}

      {/* Chapter 1: Dawn */}
      <HeroSection />

      {/* Terrain: mountain ridge → forest */}
      <SectionDivider variant="mountain-ridge" fillColor="#0d200d" />

      {/* Chapter 2: The Forest Path */}
      <AboutSection />

      {/* Terrain: forest treeline → meadow */}
      <SectionDivider variant="forest-treeline" fillColor="#224922" />

      {/* Chapter 3: The Meadow */}
      <SkillsSection />

      {/* Terrain: rolling hills → river */}
      <SectionDivider variant="rolling-hills" fillColor="#d3ed9e" />

      {/* Chapter 4: Stepping Stones */}
      <ProjectsSection />

      {/* Terrain: river bank → clearing */}
      <SectionDivider variant="river-bank" fillColor="#bfe3fe" />

      {/* Chapter 5: The Clearing */}
      <PublicationsSection />

      {/* Terrain: rolling hills → golden hour */}
      <SectionDivider variant="rolling-hills" fillColor="#fce8e6" />

      {/* Chapter 6: Golden Hour */}
      <PhotographySection />

      {/* Terrain: dusk horizon → campfire */}
      <SectionDivider variant="dusk-horizon" fillColor="#fce8e6" />

      {/* Chapter 7: Campfire at Dusk */}
      <ContactSection />

      {/* Terrain: night hills → footer */}
      <SectionDivider variant="night-hills" fillColor="#1a0a09" />

      {/* Night Falls */}
      <Footer />

      {/* Compass FAB */}
      <FloatingActionButton />
    </main>
  );
}

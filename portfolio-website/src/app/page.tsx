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
import { MountainAscentHUD } from "@/components/ui/MountainAscentHUD";
import { ChapterTitleIntro } from "@/components/ui/ChapterTitleIntro";
import { NatureScene } from "@/components/animations/NatureScene";
import { BirdFlock } from "@/components/animations/BirdFlock";
import { FloatingLeaves } from "@/components/animations/FloatingLeaves";
import { InteractiveTrail } from "@/components/animations/InteractiveTrail";
import { SoundscapeManager } from "@/components/audio/SoundscapeManager";
import { SectionDivider } from "@/components/animations/SectionDivider";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Fixed nature background — sky, mountains, sun, stars */}
      <NatureScene />

      {/* Ambient nature overlays */}
      <BirdFlock />
      <FloatingLeaves />
      
      {/* Interactive trailing micro-particles */}
      <InteractiveTrail />

      {/* Ambient soundscape manager (procedural audio) */}
      <SoundscapeManager />

      {/* Navigation */}
      <Navbar />

      {/* ─── Storytelling Chapters ─── */}

      {/* Chapter 1: Dawn */}
      <HeroSection />

      {/* Terrain: mountain ridge → forest */}
      <SectionDivider variant="mountain-ridge" fillColor="rgba(13, 32, 13, 0.35)" />

      {/* Chapter 2: The Forest Path */}
      <AboutSection />

      {/* Terrain: forest treeline → meadow */}
      <SectionDivider variant="forest-treeline" fillColor="rgba(34, 73, 34, 0.2)" />

      {/* Chapter 3: The Meadow */}
      <SkillsSection />

      {/* Terrain: rolling hills → river */}
      <SectionDivider variant="rolling-hills" fillColor="rgba(211, 237, 158, 0.2)" />

      {/* Chapter 4: Stepping Stones */}
      <ProjectsSection />

      {/* Terrain: river bank → clearing */}
      <SectionDivider variant="river-bank" fillColor="rgba(191, 227, 254, 0.2)" />

      {/* Chapter 5: The Clearing */}
      <PublicationsSection />

      {/* Terrain: rolling hills → golden hour */}
      <SectionDivider variant="rolling-hills" fillColor="rgba(252, 232, 230, 0.2)" />

      {/* Chapter 6: Golden Hour */}
      <PhotographySection />

      {/* Terrain: dusk horizon → campfire */}
      <SectionDivider variant="dusk-horizon" fillColor="rgba(252, 232, 230, 0.2)" />

      {/* Chapter 7: Campfire at Dusk */}
      <ContactSection />

      {/* Terrain: night hills → footer */}
      <SectionDivider variant="night-hills" fillColor="rgba(26, 10, 9, 0.5)" />

      {/* Night Falls */}
      <Footer />

      {/* Mountain Ascent Climbing Map tracker */}
      <MountainAscentHUD />

      {/* Cinematic Chapter Title Intros */}
      <ChapterTitleIntro />

      {/* Compass FAB */}
      <FloatingActionButton />
    </main>
  );
}

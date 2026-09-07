import { HeroSection } from "@/components/sections/HeroSection";
import { TechStackStrip } from "@/components/sections/TechStackStrip";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PublicationsSection } from "@/components/sections/PublicationsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { WritingSection } from "@/components/sections/WritingSection";
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
import { MobileTouchRipple } from "@/components/animations/MobileTouchRipple";
import { SoundscapeManager } from "@/components/audio/SoundscapeManager";
import { SectionDivider } from "@/components/animations/SectionDivider";
import { SectionErrorBoundary } from "@/components/ui/SectionErrorBoundary";

export default function Home() {
  return (
    <main id="main-content" className="relative overflow-x-hidden">
      {/* Fixed nature background — sky, mountains, sun, stars */}
      <SectionErrorBoundary name="nature-scene">
        <NatureScene />
      </SectionErrorBoundary>

      {/* Ambient nature overlays */}
      <SectionErrorBoundary name="bird-flock">
        <BirdFlock />
      </SectionErrorBoundary>
      <SectionErrorBoundary name="floating-leaves">
        <FloatingLeaves />
      </SectionErrorBoundary>

      {/* Interactive trailing micro-particles */}
      <SectionErrorBoundary name="interactive-trail">
        <InteractiveTrail />
      </SectionErrorBoundary>
      <SectionErrorBoundary name="mobile-touch-ripple">
        <MobileTouchRipple />
      </SectionErrorBoundary>

      {/* Ambient soundscape manager (procedural audio) */}
      <SectionErrorBoundary name="soundscape">
        <SoundscapeManager />
      </SectionErrorBoundary>

      {/* Navigation */}
      <Navbar />

      {/* ─── Storytelling Chapters ─── */}

      {/* Chapter 1: Dawn */}
      <SectionErrorBoundary name="hero">
        <HeroSection />
      </SectionErrorBoundary>

      {/* Built-with tech strip — surfaces real technical signal right at
          the fold instead of waiting until the Meadow chapter */}
      <SectionErrorBoundary name="tech-stack-strip">
        <TechStackStrip />
      </SectionErrorBoundary>

      {/* Terrain: mountain ridge → forest */}
      <SectionDivider variant="mountain-ridge" fillColor="rgba(13, 32, 13, 0.35)" />

      {/* Chapter 2: The Forest Path */}
      <SectionErrorBoundary name="about">
        <AboutSection />
      </SectionErrorBoundary>

      {/* Terrain: forest treeline → meadow */}
      <SectionDivider variant="forest-treeline" fillColor="rgba(34, 73, 34, 0.2)" />

      {/* Chapter 3: The Meadow */}
      <SectionErrorBoundary name="skills">
        <SkillsSection />
      </SectionErrorBoundary>

      {/* Terrain: rolling hills → river */}
      <SectionDivider variant="rolling-hills" fillColor="rgba(211, 237, 158, 0.2)" />

      {/* Chapter 4: Stepping Stones */}
      <SectionErrorBoundary name="projects">
        <ProjectsSection />
      </SectionErrorBoundary>

      {/* Terrain: river bank → clearing */}
      <SectionDivider variant="river-bank" fillColor="rgba(191, 227, 254, 0.2)" />

      {/* Chapter 5: The Clearing */}
      <SectionErrorBoundary name="publications">
        <PublicationsSection />
      </SectionErrorBoundary>

      {/* Testimonials — renders nothing until real quotes are added */}
      <SectionErrorBoundary name="testimonials">
        <TestimonialsSection />
      </SectionErrorBoundary>

      {/* Terrain: rolling hills → golden hour */}
      <SectionDivider variant="rolling-hills" fillColor="rgba(252, 232, 230, 0.2)" />

      {/* Chapter 6: Golden Hour */}
      <SectionErrorBoundary name="photography">
        <PhotographySection />
      </SectionErrorBoundary>

      {/* Terrain: dusk horizon → writing */}
      <SectionDivider variant="dusk-horizon" fillColor="rgba(252, 232, 230, 0.2)" />

      {/* Field Notes — renders nothing until blogPosts has entries */}
      <SectionErrorBoundary name="writing">
        <WritingSection />
      </SectionErrorBoundary>

      {/* Terrain: rolling hills → campfire */}
      <SectionDivider variant="rolling-hills" fillColor="rgba(252, 232, 230, 0.2)" />

      {/* Chapter 7: Campfire at Dusk */}
      <SectionErrorBoundary name="contact">
        <ContactSection />
      </SectionErrorBoundary>

      {/* Terrain: night hills → footer */}
      <SectionDivider variant="night-hills" fillColor="rgba(26, 10, 9, 0.5)" />

      {/* Night Falls */}
      <Footer />

      {/* Mountain Ascent Climbing Map tracker */}
      <SectionErrorBoundary name="mountain-hud">
        <MountainAscentHUD />
      </SectionErrorBoundary>

      {/* Cinematic Chapter Title Intros */}
      <SectionErrorBoundary name="chapter-intro">
        <ChapterTitleIntro />
      </SectionErrorBoundary>

      {/* Compass FAB */}
      <FloatingActionButton />
    </main>
  );
}

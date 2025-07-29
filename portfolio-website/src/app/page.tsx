import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PublicationsSection } from "@/components/sections/PublicationsSection";
import { PhotographySection } from "@/components/sections/PhotographySection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { ParticleBackground } from "@/components/animations/ParticleBackground";

export default function Home() {
  return (
    <main className="relative">
      <ParticleBackground />
      <Navbar />

      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <PublicationsSection />
      <PhotographySection />
      <BlogSection />
      <ContactSection />

      <Footer />
      <FloatingActionButton />
    </main>
  );
}

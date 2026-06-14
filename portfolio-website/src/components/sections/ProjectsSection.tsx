"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ExternalLink, Github, Feather } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Project, type ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
   ProjectsSection – "Chapter 4: Stepping Stones"
   Projects presented as stepping stones across a river.
   Each card represents a modular piece of software,
   styled as a premium glassmorphic browser-chrome mockup
   and reacting to the cursor with high-fidelity 3D tilt.
   ────────────────────────────────────────────────────────── */

const categories: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "web", label: "Web Apps" },
  { value: "other", label: "Other" },
];

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  const activeSub = project.subProjects?.find((s) => s.id === selectedSubId);
  const displayTitle = activeSub ? activeSub.title : project.title;
  const displayDescription = activeSub
    ? activeSub.description
    : project.description;
  const displayImage = activeSub ? activeSub.image : project.image;
  const displayDemoUrl = activeSub ? activeSub.demoUrl : project.demoUrl;
  const displayTech = activeSub ? activeSub.technologies : project.technologies;

  // 3D Tilt Coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery-smooth elastic reactions
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    damping: 25,
    stiffness: 180,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    damping: 25,
    stiffness: 180,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates to range [-0.5, 0.5]
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);

    // Apply exact specular reflection coordinates as local CSS variables
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${(relativeX / width) * 100}%`);
    el.style.setProperty("--mouse-y", `${(relativeY / height) * 100}%`);

    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const floatDelays = ["", "float-delay-1", "float-delay-2", "float-delay-3"];
  const delayClass = floatDelays[index % floatDelays.length];

  const AURA_COLORS: Record<string, string> = {
    web: "bg-[radial-gradient(circle,rgba(240,180,41,0.15)_0%,transparent_70%)]",
    other: "bg-[radial-gradient(circle,rgba(125,181,35,0.15)_0%,transparent_70%)]",
  };
  const auraColorClass = AURA_COLORS[project.category] || "bg-[radial-gradient(circle,rgba(147,210,253,0.18)_0%,transparent_70%)]";

  return (
    <div className={cn("animate-stone-float", delayClass, "relative group w-full")}>
      {/* Category ambient aura backdrop */}
      <div
        className={cn(
          "absolute -inset-6 rounded-[50px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 pointer-events-none z-0",
          auraColorClass
        )}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="perspective-1000 w-full cursor-pointer select-none relative z-10"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-stone-200/40 bg-gradient-to-b from-[#efede6] to-[#ddd9cc] transition-shadow duration-500"
        >
          {/* Specular sheen reflection overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, transparent 60%)",
            }}
          />

          {/* Browser Chrome Shell Wrapper */}
          <div className="p-3 pb-0" style={{ transform: "translateZ(20px)" }}>
            <div className="rounded-2xl overflow-hidden shadow-inner border border-stone-200/50 bg-stone-100/40 backdrop-blur-sm">
              {/* Minimalist Tab/Header Chrome Bar */}
              <div className="flex items-center justify-between px-3 pt-2 bg-stone-100/70 backdrop-blur-md border-b border-stone-200/30 overflow-visible shrink-0">
                <div className="flex items-center gap-1 pb-2 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-sm shadow-[#FF5F56]/20" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-sm shadow-[#FFBD2E]/20" />
                  <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-sm shadow-[#27C93F]/20" />
                </div>

                {project.subProjects ? (
                  <div className="flex items-end gap-0.5 px-2 overflow-x-auto scrollbar-none max-w-[80%] -mb-[1px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubId(null);
                      }}
                      className={cn(
                        "px-2 py-1 text-[9px] font-medium rounded-t-lg transition-all border-t border-x shrink-0 select-none",
                        selectedSubId === null
                          ? "bg-white border-stone-200/50 text-forest-800 font-bold shadow-[0_-2px_6px_rgba(0,0,0,0.03)]"
                          : "bg-transparent border-transparent text-stone-400 hover:text-stone-600",
                      )}
                    >
                      ✦ Studio
                    </button>
                    {project.subProjects.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubId(sub.id);
                        }}
                        className={cn(
                          "px-2 py-1 text-[9px] font-medium rounded-t-lg transition-all border-t border-x shrink-0 select-none",
                          selectedSubId === sub.id
                            ? "bg-white border-stone-200/50 text-forest-800 font-bold shadow-[0_-2px_6px_rgba(0,0,0,0.03)]"
                            : "bg-transparent border-transparent text-stone-400 hover:text-stone-600",
                        )}
                      >
                        {sub.title.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] font-mono font-bold tracking-wider text-stone-400 select-none pb-2">
                    {project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.app
                  </span>
                )}

                <div className="w-6 pb-2 shrink-0" />
              </div>

              {/* Frame Viewport */}
              <div className="relative h-44 overflow-hidden bg-stone-900">
                <motion.div
                  key={displayImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={displayImage}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 380px"
                    quality={85}
                  />
                </motion.div>

                {/* Hover actions panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-forest-955/60 backdrop-blur-[2px] flex items-center justify-center gap-3 z-30"
                >
                  {displayDemoUrl && (
                    <motion.a
                      href={displayDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-full text-white transition-colors border border-white/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  )}
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-full text-white transition-colors border border-white/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                    </motion.a>
                  )}
                </motion.div>

                {/* Featured banner */}
                {project.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-dawn-500/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-md z-10 border border-dawn-400/20 select-none">
                    <Feather className="w-2.5 h-2.5" />
                    Featured
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Editorial Text Content Block */}
          <div
            className="relative p-6 z-10 select-none"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-forest-700 uppercase tracking-widest bg-forest-600/10 px-2 py-0.5 rounded-md">
                {project.category}
              </span>
              <span className="text-[10px] font-mono text-stone-500 font-semibold">
                {new Date(project.createdAt).getFullYear()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-forest-700 transition-colors h-7 overflow-hidden text-ellipsis whitespace-nowrap">
              {displayTitle}
            </h3>

            <p className="text-stone-600 text-xs mb-4 leading-relaxed line-clamp-2 h-8">
              {displayDescription}
            </p>

            {/* Core tech badges */}
            <div className="flex flex-wrap gap-1.5 mb-4 h-[22px] overflow-hidden">
              {displayTech.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[9px] font-semibold bg-forest-50/50 text-forest-800/80 rounded-md border border-forest-200/30"
                >
                  {tech}
                </span>
              ))}
              {displayTech.length > 3 && (
                <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-forest-50/50 text-forest-800/80 rounded-md border border-forest-200/30">
                  +{displayTech.length - 3}
                </span>
              )}
            </div>

            {/* Action Links */}
            <div className="flex items-center gap-4">
              {displayDemoUrl && (
                <a
                  href={displayDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest-700 hover:text-forest-900 text-xs font-bold transition-colors uppercase tracking-wider border-b border-transparent hover:border-forest-700"
                >
                  Open App →
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 hover:text-stone-700 text-xs font-semibold transition-colors uppercase tracking-wider border-b border-transparent hover:border-stone-400"
                >
                  Codebase
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Custom hook: encapsulates all horizontal scroll pinning,
   rAF animation, and DOM-based positioning logic.
   Extracted to keep ProjectsSection below the cognitive
   complexity threshold.
   ────────────────────────────────────────────────────────── */
function useHorizontalScroll(
  isDesktop: boolean,
  filteredProjects: Project[],
  containerRef: React.RefObject<HTMLDivElement | null>,
  trackRef: React.RefObject<HTMLDivElement | null>,
  stickyRef: React.RefObject<HTMLDivElement | null>,
  bgRef: React.RefObject<HTMLDivElement | null>,
) {
  const [scrollRange, setScrollRange] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const animatedProgress = useRef(0);
  const targetProgress = useRef(0);
  const rafId = useRef(0);
  const lastReportedProgress = useRef(0);

  // Recalculate pixel-based translation boundaries on mount/resize/filter
  useEffect(() => {
    const handleRecalculate = () => {
      if (isDesktop && trackRef.current) {
        const visibleWidth = window.innerWidth;
        const range = trackRef.current.scrollWidth - visibleWidth;
        const safeRange = Math.max(0, range);
        setScrollRange(safeRange);
        setContainerHeight(window.innerHeight + safeRange);
      }
    };

    const timer = setTimeout(handleRecalculate, 150);
    globalThis.addEventListener("resize", handleRecalculate);
    return () => {
      clearTimeout(timer);
      globalThis.removeEventListener("resize", handleRecalculate);
    };
  }, [filteredProjects, isDesktop, trackRef]);

  // Smooth scroll animation & pin-phase positioning
  useEffect(() => {
    if (!isDesktop) {
      setScrollProgress(0);
      animatedProgress.current = 0;
      targetProgress.current = 0;
      return;
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      animatedProgress.current = lerp(animatedProgress.current, targetProgress.current, 0.1);

      if (Math.abs(animatedProgress.current - targetProgress.current) < 0.0005) {
        animatedProgress.current = targetProgress.current;
      }

      const p = animatedProgress.current;

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-scrollRange * p}px)`;
      }
      if (bgRef.current) {
        bgRef.current.style.transform = `translateX(${-scrollRange * 0.32 * p}px)`;
      }

      if (Math.abs(p - lastReportedProgress.current) > 0.02 || p === 0 || p === 1) {
        lastReportedProgress.current = p;
        setScrollProgress(p);
      }

      if (Math.abs(animatedProgress.current - targetProgress.current) > 0.0005) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    const applyPinPosition = (
      el: HTMLElement,
      phase: "before" | "active" | "after",
    ) => {
      if (phase === "active") {
        el.style.position = "fixed";
        el.style.top = "0px";
      } else if (phase === "after") {
        el.style.position = "absolute";
        el.style.top = `${scrollRange}px`;
      } else {
        el.style.position = "absolute";
        el.style.top = "0px";
      }
    };

    const updateScrollState = () => {
      if (!containerRef.current || !stickyRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      targetProgress.current = Math.min(1, Math.max(0, -rect.top / scrollable));

      let phase: "before" | "active" | "after" = "active";
      if (rect.top >= 0) phase = "before";
      else if (rect.bottom <= window.innerHeight) phase = "after";

      applyPinPosition(stickyRef.current, phase);
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(animate);
    };

    updateScrollState();
    globalThis.addEventListener("scroll", updateScrollState, { passive: true });
    globalThis.addEventListener("resize", updateScrollState);

    return () => {
      cancelAnimationFrame(rafId.current);
      globalThis.removeEventListener("scroll", updateScrollState);
      globalThis.removeEventListener("resize", updateScrollState);
    };
  }, [isDesktop, containerHeight, scrollRange, containerRef, trackRef, stickyRef, bgRef]);

  return { scrollRange, containerHeight, scrollProgress };
}

/* ──────────────────────────────────────────────────────────
   Sub-components extracted to keep ProjectsSection below
   the cognitive complexity threshold.
   ────────────────────────────────────────────────────────── */

interface DesktopLayoutProps {
  readonly stickyRef: React.Ref<HTMLDivElement>;
  readonly bgRef: React.Ref<HTMLDivElement>;
  readonly trackRef: React.Ref<HTMLDivElement>;
  readonly activeCategory: ProjectCategory | "all";
  readonly filteredProjects: Project[];
  readonly scrollProgress: number;
  readonly canScrollLeft: boolean;
  readonly canScrollRight: boolean;
  readonly handleCategoryChange: (cat: ProjectCategory | "all") => void;
  readonly scrollToProject: (index: number) => void;
  readonly currentIndex: number;
}

function DesktopLayout({
  stickyRef, bgRef, trackRef,
  activeCategory, filteredProjects, scrollProgress,
  canScrollLeft, canScrollRight,
  handleCategoryChange, scrollToProject, currentIndex,
}: DesktopLayoutProps) {
  return (
    <div
      ref={stickyRef}
      className="h-screen flex flex-col justify-start pt-20 pb-8 overflow-hidden z-10 absolute left-0 right-0"
      style={{ top: 0 }}
    >
      <div
        ref={bgRef}
        className="absolute inset-y-0 left-0 w-[200vw] pointer-events-none select-none opacity-[0.22] z-0"
      >
        <svg className="w-full h-full text-river-400" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,200 Q 400,280 800,200 T 1600,200 T 2400,200 T 3200,200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,12" className="animate-river-flow-1" />
          <path d="M 100,450 Q 500,400 900,450 T 1700,450 T 2500,450 T 3300,450" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6,8" className="animate-river-flow-2" />
          <path d="M 50,700 Q 450,780 850,700 T 1650,700 T 2450,700 T 3250,700" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="14,14" className="animate-river-flow-3" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 md:px-24 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 select-none">
        <div>
          <p className="text-river-600/50 text-xs tracking-[0.3em] uppercase mb-2">Chapter Four</p>
          <h2 className="text-4xl font-bold text-stone-900">Stepping <span className="text-river-600">Stones</span></h2>
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300",
                activeCategory === cat.value
                  ? "bg-forest-700 text-white shadow-md shadow-forest-900/15"
                  : "bg-white/50 text-stone-600 border border-stone-300/30 hover:bg-white/80",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full select-none">
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-10 z-30">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: canScrollLeft ? 1 : 0, x: canScrollLeft ? 0 : -10, pointerEvents: canScrollLeft ? "auto" : "none" }}
            onClick={() => scrollToProject(currentIndex - 1)}
            className="p-4 rounded-full bg-white/85 hover:bg-white text-stone-850 border border-stone-200/60 backdrop-blur-md shadow-lg transition-all duration-300 pointer-events-auto hover:scale-110 active:scale-95 group/btn"
            aria-label="Previous Project"
          >
            <svg className="w-5 h-5 transition-transform group-hover/btn:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: canScrollRight ? 1 : 0, x: canScrollRight ? 0 : 10, pointerEvents: canScrollRight ? "auto" : "none" }}
            onClick={() => scrollToProject(currentIndex + 1)}
            className="p-4 rounded-full bg-white/85 hover:bg-white text-stone-850 border border-stone-200/60 backdrop-blur-md shadow-lg transition-all duration-300 pointer-events-auto hover:scale-110 active:scale-95 group/btn"
            aria-label="Next Project"
          >
            <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <div ref={trackRef} className="flex gap-8 px-12 md:px-24 w-max py-4">
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="w-[380px] shrink-0">
                  <ProjectCard project={project} index={index} />
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="w-screen flex items-center justify-center py-12 pr-48">
                  <p className="text-stone-500">No projects found in this category.</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 md:px-24 mt-6 flex flex-col gap-4 select-none shrink-0">
        <div className="w-full h-1 bg-stone-200/50 rounded-full relative">
          <div className="absolute top-0 bottom-0 left-0 bg-forest-600 transition-all duration-350 ease-out rounded-full" style={{ width: `${scrollProgress * 100}%` }} />
          {filteredProjects.map((proj, idx) => {
            const fraction = idx / (filteredProjects.length - 1 || 1);
            const isActive = scrollProgress >= fraction - 0.05;
            return (
              <button
                key={proj.id}
                onClick={() => scrollToProject(idx)}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 cursor-pointer shadow-sm hover:scale-125",
                  isActive ? "bg-forest-600 border-forest-600 scale-110" : "bg-white border-stone-300 hover:border-forest-400"
                )}
                style={{ left: `${fraction * 100}%`, transform: `translate(-50%, -50%)` }}
                aria-label={`Go to project ${idx + 1}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center text-xs text-stone-450 mt-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-500">Scroll down to step across the river</span>
            <span className="animate-bounce">→</span>
          </div>
          <div className="flex gap-6 font-mono font-medium">
            <span>{filteredProjects.length} Stones</span>
            <span>{Math.round(scrollProgress * 100)}% Crossed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MobileLayoutProps {
  readonly activeCategory: ProjectCategory | "all";
  readonly filteredProjects: Project[];
  readonly handleCategoryChange: (cat: ProjectCategory | "all") => void;
}

function MobileLayout({ activeCategory, filteredProjects, handleCategoryChange }: MobileLayoutProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-river-600/50 text-sm tracking-[0.3em] uppercase mb-4">Chapter Four</p>
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Stepping <span className="text-river-600">Stones</span></h2>
        <p className="text-stone-600/70 max-w-xl mx-auto text-sm">Products and experiments — stepping stones across the river of practice.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
              activeCategory === cat.value
                ? "bg-forest-700 text-white"
                : "bg-white/60 text-stone-600 border border-stone-300/40",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>
      {filteredProjects.length === 0 && (
        <div className="text-center py-12"><p className="text-stone-500">No projects found in this category.</p></div>
      )}
    </div>
  );
}

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => { setIsDesktop(globalThis.innerWidth >= 1024); };
    handleResize();
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const handleCategoryChange = (category: ProjectCategory | "all") => { setActiveCategory(category); };

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const { scrollRange, containerHeight, scrollProgress } = useHorizontalScroll(
    isDesktop, filteredProjects, containerRef, trackRef, stickyRef, bgRef,
  );

  const currentIndex = Math.max(0, Math.min(
    filteredProjects.length - 1,
    Math.round(scrollProgress * (filteredProjects.length - 1 || 1)),
  ));

  const scrollToProject = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const ti = Math.max(0, Math.min(filteredProjects.length - 1, index));
    const fraction = ti / (filteredProjects.length - 1 || 1);
    window.scrollTo({ top: absoluteTop + fraction * scrollRange, behavior: "smooth" });
  };

  return (
    <section
      id="projects"
      ref={isDesktop ? containerRef : undefined}
      className={cn("relative", isDesktop ? "py-0 overflow-visible" : "overflow-hidden py-24 md:py-32")}
      style={{
        height: isDesktop ? `${containerHeight ?? window.innerHeight}px` : undefined,
        background: "linear-gradient(180deg, rgba(211, 237, 158, 0.2) 0%, rgba(219, 239, 254, 0.15) 10%, rgba(239, 248, 255, 0.1) 30%, rgba(239, 248, 255, 0.1) 70%, rgba(219, 239, 254, 0.15) 90%, rgba(191, 227, 254, 0.25) 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(147,210,253,0.15),transparent_60%)]" />
      </div>

      {isDesktop ? (
        <DesktopLayout
          stickyRef={stickyRef} bgRef={bgRef} trackRef={trackRef}
          activeCategory={activeCategory} filteredProjects={filteredProjects}
          scrollProgress={scrollProgress}
          canScrollLeft={currentIndex > 0}
          canScrollRight={currentIndex < filteredProjects.length - 1}
          handleCategoryChange={handleCategoryChange}
          scrollToProject={scrollToProject}
          currentIndex={currentIndex}
        />
      ) : (
        <MobileLayout activeCategory={activeCategory} filteredProjects={filteredProjects} handleCategoryChange={handleCategoryChange} />
      )}

      {!isDesktop && (
        <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-2 gap-4 text-center">
          {[
            { value: `${projects.length}+`, label: "Total Projects", color: "text-forest-700" },
            { value: `${new Set(projects.flatMap((p) => p.technologies)).size}+`, label: "Tech Used", color: "text-river-600" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-stone-200/30">
              <div className={`text-xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};


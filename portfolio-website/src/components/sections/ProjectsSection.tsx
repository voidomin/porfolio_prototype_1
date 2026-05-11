"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ExternalLink, Github, Eye, Feather } from "lucide-react";
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
  const [imageLoaded, setImageLoaded] = useState(false);

  // 3D Tilt Coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery-smooth elastic reactions
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { damping: 25, stiffness: 180 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { damping: 25, stiffness: 180 });

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="perspective-1000 w-full cursor-pointer select-none"
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
            background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2) 0%, transparent 60%)"
          }}
        />

        {/* Browser Chrome Shell Wrapper */}
        <div className="p-3 pb-0" style={{ transform: "translateZ(20px)" }}>
          <div className="rounded-2xl overflow-hidden shadow-inner border border-stone-200/50 bg-stone-100/40 backdrop-blur-sm">
            {/* Minimalist Tab/Header Chrome Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-100/70 backdrop-blur-md border-b border-stone-200/30">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-sm shadow-[#FF5F56]/20" />
                <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-sm shadow-[#FFBD2E]/20" />
                <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-sm shadow-[#27C93F]/20" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-stone-400 select-none">
                {project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.app
              </span>
              <div className="w-12" /> {/* Balancing space */}
            </div>

            {/* Frame Viewport */}
            <div className="relative h-44 overflow-hidden bg-stone-900">
              <motion.img
                src={project.image}
                alt={project.title}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-700",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.6 }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-400 animate-pulse" />
              )}

              {/* Hover actions panel */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-forest-950/60 backdrop-blur-[2px] flex items-center justify-center gap-3 z-30"
              >
                {project.demoUrl && (
                  <motion.a
                    href={project.demoUrl}
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
        <div className="relative p-6 z-10 select-none" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-forest-700 uppercase tracking-widest bg-forest-600/10 px-2 py-0.5 rounded-md">
              {project.category}
            </span>
            <span className="text-[10px] font-mono text-stone-500 font-semibold">
              {new Date(project.createdAt).getFullYear()}
            </span>
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-forest-700 transition-colors">
            {project.title}
          </h3>

          <p className="text-stone-600 text-xs mb-4 leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Core tech badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[9px] font-semibold bg-forest-50/50 text-forest-800/80 rounded-md border border-forest-200/30"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-forest-50/50 text-forest-800/80 rounded-md border border-forest-200/30">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
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
  );
};

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">(
    "all"
  );
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Responsive device detector
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(globalThis.innerWidth >= 1024);
    };
    handleResize();
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  const handleCategoryChange = (category: ProjectCategory | "all") => {
    setActiveCategory(category);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: isDesktop ? containerRef : undefined,
  });

  // Calculate mathematically correct pixel-based translation boundaries on mount/resize/filter!
  useEffect(() => {
    const handleRecalculate = () => {
      if (isDesktop && trackRef.current) {
        // Pixel translation is track width minus window view, plus precise centering padding
        const range = trackRef.current.scrollWidth - window.innerWidth + 160;
        setScrollRange(Math.max(0, range));
      }
    };

    const timer = setTimeout(handleRecalculate, 150);
    globalThis.addEventListener("resize", handleRecalculate);
    return () => {
      clearTimeout(timer);
      globalThis.removeEventListener("resize", handleRecalculate);
    };
  }, [filteredProjects, isDesktop]);

  useEffect(() => {
    if (isDesktop && scrollYProgress) {
      return scrollYProgress.on("change", (v: number) => setScrollProgress(v));
    }
  }, [isDesktop, scrollYProgress]);

  // Precise pixel transforms
  const xTranslation = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  // Background layer translates slower (at 32% velocity) for high-end parallax depth!
  const bgTranslation = useTransform(scrollYProgress, [0, 1], [0, -scrollRange * 0.32]);

  return (
    <section
      id="projects"
      ref={isDesktop ? containerRef : undefined}
      className={cn(
        "relative",
        isDesktop ? "h-[300vh] py-0 overflow-visible" : "overflow-hidden py-24 md:py-32"
      )}
      style={{
        background:
          "linear-gradient(180deg, rgba(211, 237, 158, 0.2) 0%, rgba(219, 239, 254, 0.15) 10%, rgba(239, 248, 255, 0.1) 30%, rgba(239, 248, 255, 0.1) 70%, rgba(219, 239, 254, 0.15) 90%, rgba(191, 227, 254, 0.25) 100%)",
      }}
    >
      {/* River shimmer overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(147,210,253,0.15),transparent_60%)]" />
      </div>

      {isDesktop ? (
        /* DESKTOP PINNED HORIZONTAL LAYOUT */
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden z-10">
          
          {/* Parallax Background River Currents */}
          <motion.div 
            style={{ x: bgTranslation }} 
            className="absolute inset-y-0 left-0 w-[200vw] pointer-events-none select-none opacity-[0.22] z-0"
          >
            <svg className="w-full h-full text-river-400" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,200 Q 400,280 800,200 T 1600,200 T 2400,200 T 3200,200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10,12" />
              <path d="M 100,450 Q 500,400 900,450 T 1700,450 T 2500,450 T 3300,450" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6,8" />
              <path d="M 50,700 Q 450,780 850,700 T 1650,700 T 2450,700 T 3250,700" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="14,14" />
            </svg>
          </motion.div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-12 md:px-24 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 select-none">
            {/* Left section headers */}
            <div>
              <p className="text-river-600/50 text-xs tracking-[0.3em] uppercase mb-2">
                Chapter Four
              </p>
              <h2 className="text-4xl font-bold text-stone-900">
                Stepping <span className="text-river-600">Stones</span>
              </h2>
            </div>
            
            {/* Category selection tabs */}
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300",
                    activeCategory === cat.value
                      ? "bg-forest-700 text-white shadow-md shadow-forest-900/15"
                      : "bg-white/50 text-stone-600 border border-stone-300/30 hover:bg-white/80"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal scrolling panel */}
          <div className="relative z-10 w-full overflow-hidden select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  ref={trackRef}
                  style={{ x: xTranslation }}
                  className="flex gap-8 px-12 md:px-24 w-max py-4"
                >
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
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scrolling hint bar */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-12 md:px-24 mt-8 flex justify-between items-center text-xs text-stone-400 select-none shrink-0">
            <div className="flex items-center gap-2">
              <span>Scroll down to step across</span>
              <span className="animate-bounce">→</span>
            </div>
            <div className="flex gap-6">
              <span>{filteredProjects.length} Stones</span>
              <span>{Math.round(scrollProgress * 100)}% Crossed</span>
            </div>
          </div>
        </div>
      ) : (
        /* MOBILE VERTICAL SCROLL LAYOUT */
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-river-600/50 text-sm tracking-[0.3em] uppercase mb-4">
              Chapter Four
            </p>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              Stepping <span className="text-river-600">Stones</span>
            </h2>
            <p className="text-stone-600/70 max-w-xl mx-auto text-sm">
              Products and experiments — stepping stones across the river of practice.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium transition-all duration-300",
                  activeCategory === cat.value
                    ? "bg-forest-700 text-white"
                    : "bg-white/60 text-stone-600 border border-stone-300/40"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects vertical grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500">No projects found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* Stats overlay (always rendered at the base of the scroll track or section) */}
      {!isDesktop && (
        <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-2 gap-4 text-center">
          {[
            { value: `${projects.length}+`, label: "Total Projects", color: "text-forest-700" },
            { value: `${new Set(projects.flatMap((p) => p.technologies)).size}+`, label: "Tech Used", color: "text-river-600" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-stone-200/30">
              <div className={`text-xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

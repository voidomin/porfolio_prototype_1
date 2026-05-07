"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Eye, Feather } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Project, type ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
   ProjectsSection – "Chapter 4: Stepping Stones"
   Projects presented as stepping stones across a river.
   Each card has an earthy/stone texture with water
   shimmer effects.
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative rounded-3xl overflow-hidden shadow-xl transition-all duration-500"
      style={{
        background: "linear-gradient(145deg, #efede6, #ddd9cc)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Liquid Water Ripple on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* Primary expanding ring */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.5 }}
              animate={{ scale: 3.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-24 h-24 rounded-full border-2 border-river-400/30" />
            </motion.div>
            {/* Secondary delayed expanding ring */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.4 }}
              animate={{ scale: 2.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, delay: 0.25, ease: "easeOut" }}
              className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-24 h-24 rounded-full border border-river-300/20" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Project image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ duration: 0.6 }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-400 animate-pulse" />
        )}

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-forest-950/50 flex items-center justify-center gap-3"
        >
          {project.demoUrl && (
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/15 backdrop-blur-sm rounded-full text-white hover:bg-white/25 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          )}
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/15 backdrop-blur-sm rounded-full text-white hover:bg-white/25 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
          )}
          <motion.button
            className="p-3 bg-white/15 backdrop-blur-sm rounded-full text-white hover:bg-white/25 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Featured feather badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-dawn-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-md">
            <Feather className="w-3 h-3" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-6 z-10">
        {/* Water shimmer at top of content */}
        <div className="absolute top-0 left-0 right-0 h-px water-shimmer" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-forest-700 uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-xs text-stone-500">
            {new Date(project.createdAt).getFullYear()}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-stone-900 mb-3 group-hover:text-forest-700 transition-colors">
          {project.title}
        </h3>

        <p className="text-stone-600 text-sm mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs bg-forest-50 text-forest-800 rounded-lg border border-forest-200/50"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2.5 py-1 text-xs bg-forest-50 text-forest-800 rounded-lg border border-forest-200/50">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-700 hover:text-forest-900 text-sm font-medium transition-colors"
            >
              Live Demo →
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-stone-700 text-sm font-medium transition-colors"
            >
              Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">(
    "all"
  );
  const [filteredProjects, setFilteredProjects] = useState(projects);

  const handleCategoryChange = (category: ProjectCategory | "all") => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === category)
      );
    }
  };

  return (
    <section
      id="projects"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #d3ed9e 0%, #dbeffe 10%, #eff8ff 30%, #eff8ff 70%, #dbeffe 90%, #bfe3fe 100%)",
      }}
    >
      {/* River shimmer overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(147,210,253,0.15),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-river-600/50 text-sm tracking-[0.3em] uppercase mb-4">
            Chapter Four
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Stepping{" "}
            <span className="text-river-600">Stones</span>
          </h2>
          <p className="text-stone-600/70 max-w-xl mx-auto">
            Products and experiments — stepping stones across the river of
            practice and craft.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === cat.value
                  ? "bg-forest-700 text-white shadow-lg shadow-forest-900/20"
                  : "bg-white/60 text-stone-600 border border-stone-300/40 hover:border-forest-400/40 hover:bg-white/80"
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-stone-500">No projects found in this category.</p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: `${projects.length}+`, label: "Total Projects", color: "text-forest-700" },
            { value: projects.filter((p) => p.category === "web").length.toString(), label: "Web Applications", color: "text-river-600" },
            { value: projects.filter((p) => p.featured).length.toString(), label: "Featured Projects", color: "text-forest-700" },
            { value: `${new Set(projects.flatMap((p) => p.technologies)).size}+`, label: "Technologies Used", color: "text-river-600" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-stone-200/30">
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-stone-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/portfolio";
import { BackLink } from "@/components/ui/BackLink";
import { ChapterMarker } from "@/components/ui/ChapterMarker";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TechChip } from "@/components/ui/TechChip";
import { ProjectHero } from "./ProjectHero";

interface ProjectPageProps {
  params: { slug: string };
}

function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProject(params.slug);
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: `${project.title} — Case Study | Akash`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.description,
      type: "article",
      images: [{ url: project.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study`,
      description: project.description,
    },
  };
}

// Used only when a project has no real `outcome` — a generic, honestly-labeled
// "Status" line derived from what's actually known, rather than claiming an
// "Outcome" that was never reported.
function deriveStatus(project: NonNullable<ReturnType<typeof getProject>>): string {
  if (project.demoUrl) {
    return `Deployed and live — try it directly at the link below.`;
  }
  if (project.githubUrl) {
    return `Open-sourced and available to explore on GitHub.`;
  }
  return `Completed as a ${project.category} project.`;
}

const SECTION_HEADING = "text-xs font-bold uppercase tracking-widest text-forest-700 mb-3";

export default function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const project = getProject(params.slug);
  if (!project) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-stone-50 pt-28 pb-24 md:pt-32">
      {/* Ambient glow overlays — this page sits off the homepage's scrolling
          chapter system (see ChapterMarker's own homepage usage), so it can't
          reuse NatureScene directly; this recreates a lighter version of the
          same warm/nature tone with two fixed radial-gradient glows instead. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 inset-x-0 h-[50vh] bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,123,234,0.10),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[45vw] h-[45vh] bg-[radial-gradient(circle_at_100%_100%,rgba(125,181,35,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <BackLink href="/#projects" label="Back to Projects" variant="glass" className="mb-10" />

        <ChapterMarker color="#257bea" className="mx-0" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-forest-700 uppercase tracking-widest bg-forest-600/10 px-2.5 py-1 rounded-md">
            {project.category}
          </span>
          <span className="text-xs font-mono text-stone-500 font-semibold">
            {new Date(project.createdAt).getFullYear()}
          </span>
        </div>

        <p className="text-river-600/60 text-xs tracking-[0.3em] uppercase mb-2">Case Study</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 mb-6">
          {project.title}
        </h1>

        <ProjectHero
          cover={project.image}
          coverAlt={project.imageAlt ?? project.title}
          images={project.images}
        />

        <div className="flex flex-wrap gap-4 mb-12">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest-800 text-white font-semibold text-sm hover:bg-forest-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 bg-white/40 backdrop-blur-sm text-stone-700 font-semibold text-sm hover:bg-stone-100 transition-colors"
            >
              <Github className="w-4 h-4" />
              View Source
            </a>
          )}
        </div>

        <GlassPanel padding="lg" className="mb-6">
          <h2 className={SECTION_HEADING}>Overview</h2>
          <p className="text-stone-700 leading-relaxed text-base">{project.description}</p>
        </GlassPanel>

        {project.longDescription && (
          <GlassPanel padding="lg" className="mb-6">
            <h2 className={SECTION_HEADING}>Approach</h2>
            <p className="text-stone-700 leading-relaxed text-base">{project.longDescription}</p>
          </GlassPanel>
        )}

        <GlassPanel padding="lg" className="mb-6">
          <h2 className={SECTION_HEADING}>{project.outcome ? "Outcome" : "Status"}</h2>
          <p className="text-stone-700 leading-relaxed text-base">
            {project.outcome ?? deriveStatus(project)}
          </p>
        </GlassPanel>

        <GlassPanel padding="lg" className="mb-10">
          <h2 className={SECTION_HEADING}>Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechChip key={tech} label={tech} />
            ))}
          </div>
        </GlassPanel>

        {project.subProjects && project.subProjects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-5">
              Included Builds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {project.subProjects.map((sub) => (
                <GlassPanel key={sub.id} padding="none" className="overflow-hidden">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={sub.image}
                      alt={sub.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 380px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-stone-900 mb-1.5">{sub.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3">{sub.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {sub.technologies.map((tech) => (
                        <TechChip key={tech} label={tech} size="xs" />
                      ))}
                    </div>
                    {sub.demoUrl && (
                      <a
                        href={sub.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-forest-700 hover:text-forest-900 text-xs font-bold transition-colors uppercase tracking-wider"
                      >
                        Open App →
                      </a>
                    )}
                  </div>
                </GlassPanel>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/portfolio";

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

function deriveOutcome(project: NonNullable<ReturnType<typeof getProject>>): string {
  if (project.demoUrl) {
    return `Deployed and live — try it directly at the link below.`;
  }
  if (project.githubUrl) {
    return `Open-sourced and available to explore on GitHub.`;
  }
  return `Completed as a ${project.category} project.`;
}

export default function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const project = getProject(params.slug);
  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-stone-50 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-forest-700 uppercase tracking-widest bg-forest-600/10 px-2.5 py-1 rounded-md">
            {project.category}
          </span>
          <span className="text-xs font-mono text-stone-500 font-semibold">
            {new Date(project.createdAt).getFullYear()}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-6">
          {project.title}
        </h1>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-200 shadow-lg mb-10">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-100 transition-colors"
            >
              <Github className="w-4 h-4" />
              View Source
            </a>
          )}
        </div>

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-3">
            Overview
          </h2>
          <p className="text-stone-700 leading-relaxed text-base">{project.description}</p>
        </section>

        {project.longDescription && (
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-3">
              Approach
            </h2>
            <p className="text-stone-700 leading-relaxed text-base">{project.longDescription}</p>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-3">
            Outcome
          </h2>
          <p className="text-stone-700 leading-relaxed text-base">{deriveOutcome(project)}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-3">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-semibold bg-forest-50 text-forest-800 rounded-md border border-forest-200/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {project.subProjects && project.subProjects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-5">
              Included Builds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {project.subProjects.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm"
                >
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
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-[9px] font-semibold bg-forest-50 text-forest-800/80 rounded-md border border-forest-200/30"
                        >
                          {tech}
                        </span>
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
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import {
  personalProfile,
  experienceTimeline,
  skills,
  projects,
  contactInfo,
  socialLinks,
} from "@/data/portfolio";
import { PrintButton } from "@/components/ui/PrintButton";

/* ──────────────────────────────────────────────────────────
   Quick Overview — an on-site, print-friendly one-pager.
   Exists so a recruiter can screen the essentials in ~30
   seconds (or hit Print/Save-as-PDF themselves) without a
   static resume.pdf sitting on the server for anyone to grab.
   ────────────────────────────────────────────────────────── */

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  design: "Design",
  tools: "Tools & Platforms",
  other: "Research & Computer Science",
  personal: "Beyond the Screen",
};

function groupSkills() {
  const groups = new Map<string, string[]>();
  for (const skill of skills) {
    if (skill.category === "personal") continue; // hobbies — not relevant to a work summary
    const label = SKILL_CATEGORY_LABELS[skill.category] ?? skill.category;
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(skill.name);
  }
  return Array.from(groups.entries());
}

export default function OverviewPage() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const skillGroups = groupSkills();

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 py-12 px-6 print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
          <PrintButton />
        </div>

        <header className="mb-10 pb-6 border-b border-stone-200 print:border-black">
          <h1 className="text-3xl font-bold mb-1">{personalProfile.name}</h1>
          <p className="text-stone-600 font-medium mb-3">{personalProfile.headline}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {personalProfile.location}
            </span>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-1.5 hover:text-stone-800"
            >
              <Mail className="w-3.5 h-3.5" />
              {contactInfo.email}
            </a>
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-stone-800"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </header>

        <section className="mb-9">
          <p className="text-stone-700 leading-relaxed">{personalProfile.about}</p>
        </section>

        <section className="mb-9">
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-400 font-semibold mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {experienceTimeline.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-stone-900">{item.title}</h3>
                  <span className="text-xs text-stone-400 whitespace-nowrap">{item.period}</span>
                </div>
                <p className="text-sm text-stone-500 mb-1">{item.organization}</p>
                <p className="text-sm text-stone-600 leading-relaxed">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-9">
          <h2 className="text-xs tracking-[0.2em] uppercase text-stone-400 font-semibold mb-4">
            Skills
          </h2>
          <div className="space-y-2.5">
            {skillGroups.map(([label, names]) => (
              <div key={label} className="flex gap-3 text-sm">
                <span className="text-stone-400 shrink-0 w-40">{label}</span>
                <span className="text-stone-700">{names.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>

        {featuredProjects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs tracking-[0.2em] uppercase text-stone-400 font-semibold mb-4">
              Selected Projects
            </h2>
            <div className="space-y-4">
              {featuredProjects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-stone-900">{project.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-stone-400 mt-10 print:hidden">
          Full case studies, publications, and photography live at the main site — this page is a
          fast-scan summary only.
        </p>
      </div>
    </main>
  );
}

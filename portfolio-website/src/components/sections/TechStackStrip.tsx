"use client";

import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiVercel,
} from "react-icons/si";
import type { IconType } from "react-icons";

/* ──────────────────────────────────────────────────────────
   TechStackStrip – a literal "built with" statement placed
   right after the hero, not a proficiency claim. Framed as
   gear carried on the trail rather than a generic SaaS logo
   marquee, reusing the hero's own glass-pill treatment for
   visual continuity.
   ────────────────────────────────────────────────────────── */

interface TechItem {
  name: string;
  icon: IconType;
}

const TECH_STACK: TechItem[] = [
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Framer Motion", icon: SiFramer },
  { name: "Vercel", icon: SiVercel },
];

export const TechStackStrip = () => {
  return (
    <div className="relative z-10 py-10">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-xs tracking-[0.25em] uppercase text-forest-900/40 mb-5"
      >
        Built for this trail with
      </motion.p>

      <div className="flex flex-wrap items-center justify-center gap-3 px-6 max-w-3xl mx-auto">
        {TECH_STACK.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-950/5 backdrop-blur-md border border-forest-950/15 text-sm text-forest-900/80 hover:bg-forest-950/10 hover:border-forest-950/25 hover:shadow-md transition-colors"
            >
              <Icon className="h-4 w-4 text-forest-800" />
              {tech.name}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

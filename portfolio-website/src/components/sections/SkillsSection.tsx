"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/portfolio";
import { Skill, type SkillCategory } from "@/types";

/* ──────────────────────────────────────────────────────────
   SkillsSection – "Chapter 3: The Meadow"
   Bright, sunny meadow tones. Skill categories are
   garden beds, skill bars become growing vines/stems.
   ────────────────────────────────────────────────────────── */

const skillCategories: { [key in SkillCategory]: { name: string; emoji: string } } = {
  frontend: { name: "Frontend Development", emoji: "🌿" },
  backend: { name: "Backend Development", emoji: "🌱" },
  design: { name: "Design & UI/UX", emoji: "🌻" },
  tools: { name: "Tools & DevOps", emoji: "🍃" },
  other: { name: "Other Skills", emoji: "🌾" },
};

const SkillBar = ({ skill, index }: { skill: Skill; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className="space-y-2"
  >
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-meadow-900">
        {skill.name}
      </span>
      <span className="text-xs text-meadow-700/60 font-mono">
        {skill.level}%
      </span>
    </div>
    <div className="h-2.5 bg-meadow-900/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          delay: index * 0.06 + 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-full rounded-full relative"
        style={{
          background: skill.color
            ? `linear-gradient(90deg, ${skill.color}90, ${skill.color})`
            : "linear-gradient(90deg, #7db523, #9bcf3a)",
        }}
      >
        {/* Vine tip glow */}
        <div className="absolute right-0 top-0 bottom-0 w-2 rounded-full bg-white/30" />
      </motion.div>
    </div>
  </motion.div>
);

const SkillCategoryCard = ({
  category,
  categorySkills,
  index,
}: {
  category: SkillCategory;
  categorySkills: Skill[];
  index: number;
}) => {
  const meta = skillCategories[category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ 
        rotate: [0, -0.8, 0.6, -0.3, 0.15, 0],
        scale: 1.015,
      }}
      className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-meadow-300/30 shadow-lg shadow-meadow-900/5 hover:shadow-xl hover:border-meadow-400/40 transition-all duration-500 origin-bottom"
    >
      <div className="flex items-center gap-3 mb-6 select-none">
        <span className="text-2xl">{meta.emoji}</span>
        <h3 className="text-lg font-semibold text-meadow-900">
          {meta.name}
        </h3>
      </div>
      <div className="space-y-4">
        {categorySkills.map((skill, skillIndex) => (
          <SkillBar key={skill.id} skill={skill} index={skillIndex} />
        ))}
      </div>
    </motion.div>
  );
};

export const SkillsSection = () => {
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const category = skill.category as SkillCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<SkillCategory, Skill[]>
  );

  return (
    <section
      id="skills"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #224922 0%, #e8f5cc 10%, #f5fbe8 30%, #f5fbe8 70%, #e8f5cc 90%, #d3ed9e 100%)",
      }}
    >
      {/* Meadow atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(240,180,41,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(125,181,35,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-meadow-600/60 text-sm tracking-[0.3em] uppercase mb-4">
            Chapter Three
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-meadow-900 mb-4">
            The{" "}
            <span className="text-meadow-600">Meadow</span>
          </h2>
          <p className="text-meadow-700/60 max-w-xl mx-auto">
            A practical toolkit shaped by software, data, testing, and cloud
            work — blooming across disciplines.
          </p>
        </motion.div>

        {/* Skill categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {Object.entries(groupedSkills).map(
            ([category, categorySkills], index) => (
              <SkillCategoryCard
                key={category}
                category={category as SkillCategory}
                categorySkills={categorySkills}
                index={index}
              />
            )
          )}
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {
              value: `${skills.length}+`,
              label: "Technologies",
              color: "text-meadow-700",
            },
            {
              value: `${Math.round(
                skills.reduce((acc, s) => acc + s.level, 0) / skills.length
              )}%`,
              label: "Avg. Proficiency",
              color: "text-forest-600",
            },
            {
              value: Object.keys(groupedSkills).length.toString(),
              label: "Categories",
              color: "text-meadow-700",
            },
            {
              value: skills.filter((s) => s.level >= 85).length.toString(),
              label: "Expert Level",
              color: "text-forest-600",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              whileHover={{ 
                rotate: [0, -1.2, 0.9, -0.5, 0.2, 0],
                scale: 1.03,
              }}
              className="text-center p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-meadow-300/20 origin-bottom hover:border-meadow-400/40 hover:shadow-md transition-all duration-300"
            >
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1 select-none`}>
                {stat.value}
              </div>
              <div className="text-sm text-meadow-700/50 select-none">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

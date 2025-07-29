"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/portfolio";
import { Skill, type SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

const skillCategories: { [key in SkillCategory]: string } = {
  frontend: "Frontend Development",
  backend: "Backend Development",
  design: "Design & UI/UX",
  tools: "Tools & DevOps",
  other: "Other Skills",
};

const SkillBar = ({ skill, index }: { skill: Skill; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {skill.name}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: index * 0.1 + 0.3,
            ease: "easeOut",
          }}
          className="h-full rounded-full relative"
          style={{
            background: skill.color
              ? `linear-gradient(90deg, ${skill.color}CC, ${skill.color})`
              : "linear-gradient(90deg, #3b82f6, #8b5cf6)",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1 + 1,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const SkillCategory = ({
  category,
  categorySkills,
  index,
}: {
  category: SkillCategory;
  categorySkills: Skill[];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        {skillCategories[category]}
      </h3>
      <div className="space-y-4">
        {categorySkills.map((skill, skillIndex) => (
          <SkillBar key={skill.id} skill={skill} index={skillIndex} />
        ))}
      </div>
    </motion.div>
  );
};

export const SkillsSection = () => {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category as SkillCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Skills & <span className="text-primary-500">Expertise</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency
            levels across different domains of development and design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(
            ([category, categorySkills], index) => (
              <SkillCategory
                key={category}
                category={category as SkillCategory}
                categorySkills={categorySkills}
                index={index}
              />
            )
          )}
        </div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary-500">
                {skills.length}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Technologies
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary-500">
                {Math.round(
                  skills.reduce((acc, skill) => acc + skill.level, 0) /
                    skills.length
                )}
                %
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Proficiency
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary-500">
                {Object.keys(groupedSkills).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary-500">
                {skills.filter((skill) => skill.level >= 85).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Expert Level
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

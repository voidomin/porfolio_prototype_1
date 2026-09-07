"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Briefcase, Compass, Code2, Microscope, Database, TreePine } from "lucide-react";
import { aboutStats, experienceTimeline, personalProfile } from "@/data/portfolio";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

/* ──────────────────────────────────────────────────────────
   AboutSection – "Chapter 2: The Forest Path"
   Misty forest green tones, a winding trail for the
   experience timeline, and organic framing.
   ────────────────────────────────────────────────────────── */

const trailIconsById: Record<string, typeof Database> = {
  "exp-parentof": Database,
  "exp-freelance": Compass,
  "exp-merck": Code2,
  "exp-iisc": Microscope,
};

export const AboutSection = () => {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(13, 32, 13, 0.35) 0%, rgba(29, 61, 29, 0.45) 15%, rgba(38, 91, 38, 0.5) 50%, rgba(29, 61, 29, 0.45) 85%, rgba(34, 73, 34, 0.35) 100%)",
      }}
    >
      {/* Forest mist overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-forest-950/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(219,240,219,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(219,240,219,0.06),transparent_50%)]" />
      </div>

      {/* Decorative trees */}
      <div className="absolute left-4 top-20 opacity-10 pointer-events-none">
        <TreePine className="w-20 h-20 text-forest-300" />
      </div>
      <div className="absolute right-8 top-40 opacity-8 pointer-events-none">
        <TreePine className="w-16 h-16 text-forest-300" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-forest-300/60 text-sm tracking-[0.3em] uppercase mb-4">Chapter Two</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Forest <span className="text-forest-300">Path</span>
          </h2>
          <p className="text-forest-200/60 max-w-xl mx-auto">
            A quiet story of roots, engineering, and product craft.
          </p>
        </motion.div>

        {/* Profile + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start mb-24">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center lg:items-start"
          >
            {/* Monogram with organic frame */}
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-forest-400/30 to-forest-700/40 p-1 shadow-2xl shadow-forest-900/50">
                <div className="w-full h-full rounded-full bg-forest-900/80 backdrop-blur-sm flex items-center justify-center border border-forest-500/20 overflow-hidden">
                  {personalProfile.avatar && !avatarError ? (
                    <Image
                      src={personalProfile.avatar}
                      alt={personalProfile.name}
                      width={160}
                      height={160}
                      className="w-full h-full rounded-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="text-5xl font-bold text-forest-200 tracking-tight">
                      {personalProfile.name.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              {/* Organic leaf accent */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-forest-500/80 flex items-center justify-center shadow-lg">
                <TreePine className="w-5 h-5 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">{personalProfile.name}</h3>
            <p className="text-forest-300 font-medium text-sm mb-2">{personalProfile.headline}</p>
            <p className="text-forest-200/50 text-sm">{personalProfile.location}</p>
          </motion.div>

          {/* Bio content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-nature rounded-2xl p-8">
              <p className="text-forest-100/80 leading-relaxed text-lg mb-4">
                {personalProfile.about}
              </p>
              <p className="text-forest-100/60 leading-relaxed">{personalProfile.aboutExtended}</p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {aboutStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 glass-nature rounded-2xl"
            >
              <div className="text-2xl md:text-3xl font-bold text-forest-300 mb-2">
                <AnimatedNumber value={stat.value} />
              </div>
              <div className="text-sm text-forest-200/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Experience Timeline — Forest Trail */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-center mb-16 text-white">Professional Journey</h3>

          <div className="relative max-w-3xl mx-auto">
            {/* Trail line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-forest-500/40 via-forest-400/30 to-forest-500/40" />

            <div className="space-y-12">
              {experienceTimeline.map((item, index) => {
                const Icon = trailIconsById[item.id] ?? TreePine;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className={`relative flex items-start ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Trail node */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-forest-700/80 border-2 border-forest-400/40 flex items-center justify-center z-10 shadow-lg shadow-forest-900/30">
                      <Icon className="w-4 h-4 text-forest-300" />
                    </div>

                    {/* Card */}
                    <div
                      className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${
                        index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                      }`}
                    >
                      <div className="glass-nature rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-forest-300 font-medium text-sm mb-2">
                          <Briefcase className="h-3.5 w-3.5" />
                          {item.period}
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                        <div className="text-forest-400 font-medium text-sm mb-3">
                          {item.organization}
                        </div>
                        <p className="text-forest-200/60 text-sm leading-relaxed">{item.summary}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

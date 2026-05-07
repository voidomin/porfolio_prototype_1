"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { personalProfile } from "@/data/portfolio";

/* ──────────────────────────────────────────────────────────
   HeroSection – "Chapter 1: Dawn"
   Full-viewport cinematic hero where the name rises with
   the dawn. The NatureScene background provides mountains
   and sky; this section overlays text, location badge,
   and animated entrance.
   ────────────────────────────────────────────────────────── */

export const HeroSection = () => {
  const letterVariants = {
    hidden: { y: 80, opacity: 0, filter: "blur(8px)" },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: 0.5 + i * 0.06,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.8, ease: "easeOut" },
    }),
  };

  const nameLetters = personalProfile.name.split("");

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Dawn glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dawn-100/30 via-transparent to-transparent pointer-events-none z-[1]" />

      {/* Central content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Location badge */}
        <motion.div
          custom={0.3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-sm"
        >
          <MapPin className="h-4 w-4 text-dawn-400" />
          <span className="text-white/80">{personalProfile.location}</span>
        </motion.div>

        {/* Name — cinematic letter-by-letter reveal */}
        <div className="overflow-hidden mb-4">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight flex justify-center flex-wrap">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block text-white drop-shadow-[0_2px_30px_rgba(240,180,41,0.3)]"
                style={{
                  textShadow: "0 0 60px rgba(240, 180, 41, 0.2)",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Headline */}
        <motion.h2
          custom={1.2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-xl sm:text-2xl md:text-3xl font-medium text-dawn-200/90 mb-6"
          style={{
            textShadow: "0 2px 20px rgba(0,0,0,0.2)",
          }}
        >
          {personalProfile.headline}
        </motion.h2>

        {/* Intro */}
        <motion.p
          custom={1.5}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {personalProfile.intro}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={1.8}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#projects"
            className="px-8 py-4 bg-white/15 backdrop-blur-md border border-white/25 text-white font-medium rounded-full hover:bg-white/25 transition-all duration-300"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore My Journey
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-4 bg-dawn-500/80 backdrop-blur-md text-white font-medium rounded-full hover:bg-dawn-400/90 transition-all duration-300 shadow-lg shadow-dawn-500/20"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Floating tags */}
        <motion.div
          custom={2.2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3 justify-center mt-10"
        >
          {["Dawn trails", "Mountain calm", "Soft motion", "Data + craft"].map(
            (label) => (
              <span
                key={label}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/60"
              >
                {label}
              </span>
            )
          )}
        </motion.div>
      </div>

      {/* Scroll prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-[0.2em] uppercase">
            Begin the journey
          </span>
          <ArrowDown className="w-4 h-4" />
        </motion.a>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-forest-950/80 z-[1] pointer-events-none" />
    </section>
  );
};

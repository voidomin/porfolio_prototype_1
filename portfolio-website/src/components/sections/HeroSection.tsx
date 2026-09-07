"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, MapPin, CircleDot } from "lucide-react";
import { personalProfile } from "@/data/portfolio";
import { Magnetic } from "@/components/ui/Magnetic";

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
        delay: 0.2 + i * 0.04,
        duration: 0.7,
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0"
    >
      {/* Dawn glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dawn-200/20 via-transparent to-transparent pointer-events-none z-[1]" />

      {/* Central content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Location & availability badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <motion.div
            custom={0.1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest-950/5 backdrop-blur-md border border-forest-950/15 text-sm"
          >
            <MapPin className="h-4 w-4 text-forest-800" />
            <span className="text-forest-900 font-medium">{personalProfile.location}</span>
          </motion.div>

          {personalProfile.openToWork && (
            <motion.div
              custom={0.18}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest-950/5 backdrop-blur-md border border-forest-950/15 text-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <CircleDot className="relative h-2.5 w-2.5 text-green-600" />
              </span>
              <span className="text-forest-900 font-medium">Open to work</span>
            </motion.div>
          )}
        </div>

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
                className="inline-block text-forest-950 drop-shadow-[0_2px_15px_rgba(13,32,13,0.1)]"
                style={{
                  textShadow: "0 0 40px rgba(13, 32, 13, 0.05)",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* Headline — word-by-word stagger */}
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-medium text-forest-900 mb-6"
          style={{ textShadow: "0 1px 10px rgba(255,255,255,0.4)" }}
        >
          {personalProfile.headline.split(" ").map((word, i) => (
            <motion.span
              key={i}
              custom={0.5 + i * 0.06}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-block mr-[0.3em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* Intro */}
        <motion.p
          custom={0.85}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg text-forest-900/80 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {personalProfile.intro}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={1.05}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Magnetic strength={10}>
            <motion.a
              href="#projects"
              className="inline-block px-8 py-4 bg-forest-950/5 backdrop-blur-md border border-forest-950/20 text-forest-950 font-semibold rounded-full hover:bg-forest-950/10 transition-all duration-300"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore My Journey
            </motion.a>
          </Magnetic>
          <Magnetic strength={10}>
            <motion.a
              href="#contact"
              className="inline-block px-8 py-4 bg-forest-800 text-white font-semibold rounded-full hover:bg-forest-700 transition-all duration-300 shadow-lg shadow-forest-900/10"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Get In Touch
            </motion.a>
          </Magnetic>
        </motion.div>

        {/* Quick, screenable summary — no downloadable file, just an on-site one-pager */}
        <motion.div
          custom={1.15}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mt-5"
        >
          <Link
            href="/overview"
            className="text-sm text-forest-900/50 hover:text-forest-900/80 underline underline-offset-4 transition-colors"
          >
            Quick Overview →
          </Link>
        </motion.div>

        {/* Floating tags */}
        <motion.div
          custom={1.25}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3 justify-center mt-10"
        >
          {(
            personalProfile.tags ?? ["Data + Craft", "Full-Stack", "Mountain calm", "Dawn trails"]
          ).map((label) => (
            <span
              key={label}
              className="px-4 py-2 rounded-full bg-forest-950/5 backdrop-blur-sm border border-forest-950/10 text-sm text-forest-900/70"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 z-10"
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-2 text-forest-800/60 hover:text-forest-900 transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-semibold">
            Begin the journey
          </span>
          <ArrowDown className="w-4 h-4 text-forest-800" />
        </motion.a>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-forest-950/60 z-[1] pointer-events-none" />
    </section>
  );
};

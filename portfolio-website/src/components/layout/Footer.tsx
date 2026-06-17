"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Star } from "lucide-react";
import { socialLinks, personalProfile } from "@/data/portfolio";

/* ──────────────────────────────────────────────────────────
   Footer – "Night Falls"
   Deep indigo/navy with twinkling stars, moon, and
   constellation-style social links.
   ────────────────────────────────────────────────────────── */

const iconMap = {
  github: Github,
  linkedin: Linkedin,
};

function generateFooterStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 70,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    duration: 2 + Math.random() * 3,
  }));
}

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [stars] = useState(() => generateFooterStars(30));
  const [shootingStar, setShootingStar] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleHover = () => {
    if (!shootingStar) {
      setShootingStar(true);
      setTimeout(() => setShootingStar(false), 1500);
    }
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(26, 10, 9, 0.5) 0%, rgba(15, 13, 46, 0.7) 30%, rgba(10, 8, 32, 0.85) 100%)",
      }}
      onMouseEnter={handleHover}
    >
      {/* Stars */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star-dot animate-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Shooting star */}
      {shootingStar && (
        <motion.div
          className="absolute pointer-events-none"
          initial={{ x: "20%", y: "10%", opacity: 0 }}
          animate={{ x: "80%", y: "60%", opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_4px_2px_rgba(255,255,255,0.6)]" />
          <div className="w-20 h-[1px] bg-gradient-to-r from-white/60 to-transparent -translate-y-[1px] rotate-[35deg] origin-right" />
        </motion.div>
      )}

      {/* Moon glow */}
      <div className="absolute top-8 right-16 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-night-200/10 blur-xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="mb-8">
            <span className="text-2xl font-semibold tracking-wide text-white/90">
              {personalProfile.name}
            </span>
          </div>

          {/* Social links as constellation */}
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map((link) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap];
              if (!IconComponent) return null;

              return (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-night-300 hover:bg-night-500/30 hover:text-white hover:border-night-400/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-night-400"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-night-400/30" />
            <Star className="w-3 h-3 text-night-400/40" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-night-400/30" />
          </div>

          {/* Copyright */}
          <p className="text-sm text-night-300/40">
            © {currentYear} {personalProfile.name}. Built with calm focus and care under starlit
            skies.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

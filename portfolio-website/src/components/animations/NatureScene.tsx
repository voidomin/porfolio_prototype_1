"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { useScrollContext } from "@/contexts/ScrollContext";

/* ──────────────────────────────────────────────────────────
   NatureScene – fixed parallax background painting the full
   day-cycle. Sky gradient now driven by IntersectionObserver
   (fires only on section entry, not every scroll frame) and
   cross-fades via opacity — GPU-composited, zero JS per frame.
   ────────────────────────────────────────────────────────── */

const SKY_GRADIENTS: Record<string, string> = {
  home: "linear-gradient(180deg, #fef7e0 0%, #fdedb7 30%, #fbdf85 60%, #f0b429 100%)",
  about: "linear-gradient(180deg, #e0f0ff 0%, #93d2fd 30%, #60b8fa 60%, #3b99f5 100%)",
  skills: "linear-gradient(180deg, #c8e6c9 0%, #81c784 30%, #66bb6a 60%, #43a047 100%)",
  projects: "linear-gradient(180deg, #bbdefb 0%, #90caf9 30%, #64b5f6 60%, #42a5f5 100%)",
  publications: "linear-gradient(180deg, #fce8e6 0%, #f5b3af 40%, #e05d57 70%, #762b2a 100%)",
  photography: "linear-gradient(180deg, #fcdfa8 0%, #fbad60 40%, #e05d57 70%, #762b2a 100%)",
  contact: "linear-gradient(180deg, #1a1145 0%, #0f0d2e 40%, #0a0820 100%)",
};

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "publications",
  "photography",
  "contact",
];

const STARS_COUNT = 60;

function generateStars() {
  return Array.from({ length: STARS_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));
}

export const NatureScene = () => {
  const { scrollYProgress } = useScrollContext();
  const [stars] = useState(() => generateStars());
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSky, setActiveSky] = useState(SKY_GRADIENTS.home);

  useEffect(() => {
    setMounted(true);
    setIsMobile(globalThis.innerWidth < 768);
  }, []);

  // IntersectionObserver drives sky colour — zero scroll-frame JS computation
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && SKY_GRADIENTS[entry.target.id]) {
            setActiveSky(SKY_GRADIENTS[entry.target.id]);
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -15% 0px" }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [mounted]);

  // Parallax transforms for mountain layers — ALL hooks called before any return
  const mountainBackY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const mountainMidY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const mountainFrontY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Sun position — arcs across the sky as user scrolls
  const sunX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 50, 85]);
  const sunY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [70, 20, 15, 25, 80]);
  const sunScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.2, 1.1, 0.8]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.1, 0.82, 0.92, 1], [0.6, 1, 0.8, 0.15, 0]);

  // Moon opacity and position
  const moonOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 0.9]);
  const moonXVal = useTransform(scrollYProgress, [0.8, 1], [25, 20]);
  const moonYVal = useTransform(scrollYProgress, [0.8, 1], [42, 15]);
  const moonRight = useTransform(moonXVal, (v: number) => `${v}%`);
  const moonTop = useTransform(moonYVal, (v: number) => `${v}%`);

  // Star visibility
  const starsOpacity = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);

  // Sun CSS position values
  const sunLeft = useTransform(sunX, (v: number) => `${v}%`);
  const sunTop = useTransform(sunY, (v: number) => `${v}%`);

  // Cloud and mist opacity
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.7, 0.5, 0.3, 0]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0.6, 0.2, 0]);

  if (!mounted) return null;

  return (
    <div className="nature-scene">
      {/* ─── Sky Gradient — cross-fades on section change, no per-frame computation ─── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeSky}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ background: activeSky }}
        />
      </AnimatePresence>

      {/* ─── Sun ─── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          background: "radial-gradient(circle, #fef7e0 0%, #f0b429 40%, rgba(240,180,41,0) 70%)",
          boxShadow: "0 0 60px 20px rgba(240,180,41,0.3)",
          left: sunLeft,
          top: sunTop,
          scale: sunScale,
          opacity: sunOpacity,
          x: "-50%",
          y: "-50%",
        }}
      />

      {/* ─── Moon ─── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 40,
          height: 40,
          background:
            "radial-gradient(circle at 35% 35%, #e0e5ff 0%, #c7cfff 50%, rgba(199,207,255,0.3) 100%)",
          boxShadow: "0 0 40px 10px rgba(199,207,255,0.2)",
          right: moonRight,
          top: moonTop,
          opacity: moonOpacity,
        }}
      />

      {/* ─── Stars ─── */}
      <motion.div className="absolute inset-0" style={{ opacity: starsOpacity }}>
        {(isMobile ? stars.slice(0, 20) : stars).map((star) => (
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
      </motion.div>

      {/* ─── Clouds ─── */}
      <motion.div style={{ opacity: cloudOpacity }}>
        <div
          className="cloud animate-drift-cloud"
          style={{
            width: 200,
            height: 60,
            top: "12%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.7), transparent)",
          }}
        />
        <div
          className="cloud animate-drift-cloud-slow"
          style={{
            width: 280,
            height: 70,
            top: "22%",
            animationDelay: "-15s",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)",
          }}
        />
        <div
          className="cloud animate-drift-cloud"
          style={{
            width: 160,
            height: 50,
            top: "8%",
            animationDelay: "-30s",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.6), transparent)",
          }}
        />
      </motion.div>

      {/* ─── Mountain Layer 3 (back, lightest) ─── */}
      <motion.div className="mountain-layer" style={{ y: mountainBackY, height: "45%", zIndex: 1 }}>
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,400 L0,280 Q120,160 240,220 Q360,100 480,180 Q600,60 720,140 Q840,40 960,120 Q1080,60 1200,160 Q1320,100 1440,200 L1440,400 Z"
            fill="rgba(30,70,30,0.3)"
          />
        </svg>
      </motion.div>

      {/* ─── Mountain Layer 2 (mid) ─── */}
      <motion.div className="mountain-layer" style={{ y: mountainMidY, height: "38%", zIndex: 2 }}>
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,400 L0,300 Q100,180 200,240 Q320,120 440,200 Q560,80 680,160 Q800,60 920,140 Q1040,100 1160,180 Q1280,120 1440,220 L1440,400 Z"
            fill="rgba(20,50,20,0.45)"
          />
        </svg>
      </motion.div>

      {/* ─── Mountain Layer 1 (front, darkest) ─── */}
      <motion.div
        className="mountain-layer"
        style={{ y: mountainFrontY, height: "30%", zIndex: 3 }}
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,400 L0,320 Q80,240 200,280 Q320,200 440,260 Q560,180 680,220 Q800,140 920,200 Q1040,160 1160,220 Q1280,180 1440,260 L1440,400 Z"
            fill="rgba(15,35,15,0.6)"
          />
        </svg>
      </motion.div>

      {/* ─── Ground mist ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.08))",
          opacity: mistOpacity,
        }}
      />
    </div>
  );
};

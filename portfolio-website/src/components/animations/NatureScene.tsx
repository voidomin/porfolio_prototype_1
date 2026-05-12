"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   NatureScene – fixed parallax background that paints the
   entire day-cycle: dawn sky → noon → dusk → starlit night.
   Uses scroll position to shift sky gradients and move
   mountain layers at different parallax speeds.
   ────────────────────────────────────────────────────────── */

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
  const { scrollYProgress } = useScroll();
  const [stars] = useState(() => generateStars());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax transforms for mountain layers — ALL hooks called before any return
  const mountainBackY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const mountainMidY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const mountainFrontY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Sun position — arcs across the sky as user scrolls
  const sunX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 50, 85]);
  const sunY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [70, 20, 15, 25, 80]
  );
  const sunScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 1.2, 1.1, 0.8]
  );
  // Sun opacity - sets nicely during Golden Hour
  const sunOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.82, 0.92, 1],
    [0.6, 1, 0.8, 0.15, 0]
  );

  // Moon opacity - starts showing as we transition past golden hour
  const moonOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 0.9]);

  // Moon position - rises gracefully from behind mountains as night falls
  const moonXVal = useTransform(scrollYProgress, [0.8, 1], [25, 20]);
  const moonYVal = useTransform(scrollYProgress, [0.8, 1], [42, 15]);
  const moonRight = useTransform(moonXVal, (v) => `${v}%`);
  const moonTop = useTransform(moonYVal, (v) => `${v}%`);

  // Star visibility — fade in after golden hour as night settles
  const starsOpacity = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);

  // Sky gradient with inserted Golden Hour transition keyframe at 0.88
  const skyBackground = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 0.88, 1],
    [
      "linear-gradient(180deg, #fef7e0 0%, #fdedb7 30%, #fbdf85 60%, #f0b429 100%)", // Dawn / Hero
      "linear-gradient(180deg, #e0f0ff 0%, #93d2fd 30%, #60b8fa 60%, #3b99f5 100%)", // Forest / About
      "linear-gradient(180deg, #c8e6c9 0%, #81c784 30%, #66bb6a 60%, #43a047 100%)", // Meadow / Skills
      "linear-gradient(180deg, #bbdefb 0%, #90caf9 30%, #64b5f6 60%, #42a5f5 100%)", // River / Projects
      "linear-gradient(180deg, #fce8e6 0%, #f5b3af 40%, #e05d57 70%, #762b2a 100%)", // Clearing / Publications
      "linear-gradient(180deg, #fcdfa8 0%, #fbad60 40%, #e05d57 70%, #762b2a 100%)", // Golden Hour / Photography (Vibrant golden amber sunset)
      "linear-gradient(180deg, #1a1145 0%, #0f0d2e 40%, #0a0820 100%)", // Night / Campfire
    ]
  );

  // Sun left/top as CSS values
  const sunLeft = useTransform(sunX, (v) => `${v}%`);
  const sunTop = useTransform(sunY, (v) => `${v}%`);

  // Cloud opacity
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.7, 0.5, 0.3, 0]);

  // Mist opacity
  const mistOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0.6, 0.2, 0]);

  // Scroll progress for positioning
  const scrollLeft = useTransform(starsOpacity, (v) => v);

  if (!mounted) return null;

  return (
    <div className="nature-scene">
      {/* ─── Sky Gradient ─── */}
      <motion.div
        className="absolute inset-0"
        style={{ background: skyBackground }}
      />

      {/* ─── Sun ─── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          background:
            "radial-gradient(circle, #fef7e0 0%, #f0b429 40%, rgba(240,180,41,0) 70%)",
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
      </motion.div>

      {/* ─── Clouds ─── */}
      <motion.div style={{ opacity: cloudOpacity }}>
        <div
          className="cloud animate-drift-cloud"
          style={{
            width: 200,
            height: 60,
            top: "12%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.7), transparent)",
          }}
        />
        <div
          className="cloud animate-drift-cloud-slow"
          style={{
            width: 280,
            height: 70,
            top: "22%",
            animationDelay: "-15s",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)",
          }}
        />
        <div
          className="cloud animate-drift-cloud"
          style={{
            width: 160,
            height: 50,
            top: "8%",
            animationDelay: "-30s",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.6), transparent)",
          }}
        />
      </motion.div>

      {/* ─── Mountain Layer 3 (back, lightest) ─── */}
      <motion.div
        className="mountain-layer"
        style={{ y: mountainBackY, height: "45%", zIndex: 1 }}
      >
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,400 L0,280 Q120,160 240,220 Q360,100 480,180 Q600,60 720,140 Q840,40 960,120 Q1080,60 1200,160 Q1320,100 1440,200 L1440,400 Z"
            fill="rgba(30,70,30,0.3)"
          />
        </svg>
      </motion.div>

      {/* ─── Mountain Layer 2 (mid) ─── */}
      <motion.div
        className="mountain-layer"
        style={{ y: mountainMidY, height: "38%", zIndex: 2 }}
      >
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
          background:
            "linear-gradient(180deg, transparent, rgba(255,255,255,0.08))",
          opacity: mistOpacity,
        }}
      />
    </div>
  );
};

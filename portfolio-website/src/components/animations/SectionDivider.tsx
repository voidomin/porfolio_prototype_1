"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   SectionDivider – organic SVG terrain dividers between
   sections. Each variant creates a different landscape
   profile (mountain ridge, rolling hills, river bank,
   forest treeline, etc.)

   Each divider tracks its own scroll progress via a scoped
   useScroll({ target }) — not the shared page-wide scrollY —
   so it can give the terrain a subtle rise/settle parallax as
   it crosses the viewport, without adding another consumer of
   the global scroll listener or any hand-rolled scroll math.
   ────────────────────────────────────────────────────────── */

type DividerVariant =
  | "mountain-ridge"
  | "rolling-hills"
  | "forest-treeline"
  | "river-bank"
  | "dusk-horizon"
  | "night-hills";

interface SectionDividerProps {
  variant: DividerVariant;
  fillColor: string;
  className?: string;
  flip?: boolean;
}

const paths: Record<DividerVariant, string> = {
  "mountain-ridge":
    "M0,80 Q60,20 120,50 Q180,0 240,35 Q300,10 360,40 Q420,5 480,30 Q540,15 600,45 Q660,10 720,35 Q780,0 840,25 Q900,15 960,40 Q1020,5 1080,30 Q1140,20 1200,50 Q1260,10 1320,35 Q1380,25 1440,45 L1440,100 L0,100 Z",
  "rolling-hills":
    "M0,70 C120,30 240,60 360,40 C480,20 600,50 720,35 C840,20 960,55 1080,40 C1200,25 1320,45 1440,30 L1440,100 L0,100 Z",
  "forest-treeline":
    "M0,80 L40,50 L60,75 L100,35 L120,65 L160,25 L200,60 L240,20 L280,55 L320,30 L360,65 L400,15 L440,50 L480,25 L520,60 L560,20 L600,55 L640,30 L680,60 L720,15 L760,50 L800,30 L840,65 L880,20 L920,55 L960,25 L1000,60 L1040,30 L1080,55 L1120,15 L1160,50 L1200,35 L1240,60 L1280,20 L1320,50 L1360,30 L1400,55 L1440,40 L1440,100 L0,100 Z",
  "river-bank":
    "M0,60 Q180,80 360,55 Q540,30 720,50 Q900,70 1080,45 Q1260,20 1440,55 L1440,100 L0,100 Z",
  "dusk-horizon":
    "M0,65 C180,45 360,70 540,50 C720,30 900,60 1080,45 C1260,30 1440,55 1440,55 L1440,100 L0,100 Z",
  "night-hills":
    "M0,75 Q120,55 240,65 Q360,45 480,60 Q600,40 720,55 Q840,50 960,60 Q1080,45 1200,55 Q1320,50 1440,65 L1440,100 L0,100 Z",
};

export const SectionDivider = ({
  variant,
  fillColor,
  className = "",
  flip = false,
}: SectionDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Terrain gently rises as it enters, settles at rest, eases back as it
  // leaves — a soft parallax "lift" instead of a flat, static cut between
  // chapters. Pure transform + opacity, GPU-composited.
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [16, 0, -16]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden pointer-events-none ${className}`}
      style={{
        height: "80px",
        marginBottom: "-1px",
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    >
      <motion.svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
        style={{ y, opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={paths[variant]} fill={fillColor} />
      </motion.svg>
    </div>
  );
};

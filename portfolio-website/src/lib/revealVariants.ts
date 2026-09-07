import { Variants } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   Shared chapter-entrance variants. Every section previously
   used the exact same generic fade-up for its header reveal —
   these give each chapter a distinct, theme-matched personality
   while staying cheap (opacity/transform/filter only, all
   GPU-composited) and reusing the same whileInView/viewport
   trigger mechanism already proven robust across the site.
   ────────────────────────────────────────────────────────── */

/** Default — used where no more specific personality fits (kept for parity/fallback). */
export const fadeUpReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

/** Forest — content resolves out of mist rather than just sliding up. */
export const mistReveal: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Golden Hour / Campfire — a warm glow blooms outward as content settles in. */
export const glowBloomReveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/** River / Stepping Stones — content comes into focus, like a ripple settling. */
export const focusReveal: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Field Notes — settles in with a slight paper-like tilt correction. */
export const paperSettleReveal: Variants = {
  hidden: { opacity: 0, y: 24, rotate: -1.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

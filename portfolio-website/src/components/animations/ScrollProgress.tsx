"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useScrollContext } from "@/contexts/ScrollContext";

/* ──────────────────────────────────────────────────────────
   ScrollProgress – a "sun path" indicator at the very top
   of the viewport. A small glowing dot (sun/moon) moves
   from left to right as the user scrolls, transitioning
   from warm gold to cool silver.
   ────────────────────────────────────────────────────────── */

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScrollContext();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Progress bar color transition
  const barBackground = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [
      "linear-gradient(90deg, #f0b429, #f8cc4d)",
      "linear-gradient(90deg, #f0b429, #7db523)",
      "linear-gradient(90deg, #7db523, #e05d57)",
      "linear-gradient(90deg, #e05d57, #5d40e6)",
    ]
  );

  // Dot color (sun → moon)
  const dotColor = useTransform(scrollYProgress, [0, 0.5, 1], ["#f0b429", "#7db523", "#c7cfff"]);

  const dotGlow = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "0 0 8px 2px rgba(240,180,41,0.5)",
      "0 0 8px 2px rgba(125,181,35,0.4)",
      "0 0 8px 2px rgba(199,207,255,0.5)",
    ]
  );

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] print:hidden"
        style={{
          scaleX: smoothProgress,
          background: barBackground,
        }}
      />

      {/* Sun/Moon dot at the leading edge — positioned via transform only
          (never `left`), which is a layout-triggering property: animating
          it forces a synchronous reflow on every scroll-driven update and
          registers as continuous layout shift, exactly what a real
          production CLS trace (0.54, "Poor") flagged against this
          div.fixed.top-0.z-[61] element. `calc(Nvw - 50%)` does both jobs
          — travel across the viewport width and self-centering — in one
          compositor-only transform. */}
      <motion.div
        className="fixed top-0 left-0 z-[61] pointer-events-none print:hidden"
        style={{
          x: useTransform(smoothProgress, (v) => `calc(${v * 100}vw - 50%)`),
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full -translate-y-[1px]"
          style={{
            backgroundColor: dotColor,
            boxShadow: dotGlow,
          }}
        />
      </motion.div>
    </>
  );
};

"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/* ──────────────────────────────────────────────────────────
   StorybookCursor – Nature-themed custom cursor.
   A small leaf-like dot with an organic ring and
   "Explore" tooltip on hover.
   ────────────────────────────────────────────────────────── */

const interactiveSelector =
  'a, button, input, textarea, select, [role="button"], [data-cursor="interactive"]';

export const StorybookCursor = () => {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 32, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 500, damping: 32, mass: 0.35 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = globalThis as unknown as Window;
    const mediaQuery = root.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);

      const target = event.target as Element | null;
      setIsHovering(Boolean(target?.closest(interactiveSelector)));
    };

    const handleLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    root.addEventListener("pointermove", handleMove);
    root.addEventListener("pointerleave", handleLeave);

    return () => {
      root.removeEventListener("pointermove", handleMove);
      root.removeEventListener("pointerleave", handleLeave);
    };
  }, [prefersReducedMotion, x, y]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden lg:block"
      style={{ x: springX, y: springY }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Outer organic ring */}
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border backdrop-blur-sm"
        animate={{
          width: isHovering ? 52 : 28,
          height: isHovering ? 52 : 28,
          opacity: isVisible ? 1 : 0,
          borderColor: isHovering
            ? "rgba(125, 181, 35, 0.4)"
            : "rgba(255, 255, 255, 0.2)",
          backgroundColor: isHovering
            ? "rgba(125, 181, 35, 0.08)"
            : "rgba(255, 255, 255, 0.05)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />

      {/* Inner dot (leaf-green) */}
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md"
        animate={{
          width: isHovering ? 8 : 6,
          height: isHovering ? 8 : 6,
          opacity: isVisible ? 1 : 0,
          backgroundColor: isHovering ? "#7db523" : "rgba(255,255,255,0.8)",
          boxShadow: isHovering
            ? "0 0 12px 3px rgba(125,181,35,0.3)"
            : "0 0 4px 1px rgba(255,255,255,0.2)",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 30 }}
      />

      {/* Tooltip label */}
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-10 rounded-full bg-forest-800/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-forest-200 shadow-lg backdrop-blur-sm whitespace-nowrap"
        initial={false}
        animate={{
          opacity: isHovering ? 1 : 0,
          y: isHovering ? -32 : -24,
          scale: isHovering ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        Explore
      </motion.div>
    </motion.div>
  );
};

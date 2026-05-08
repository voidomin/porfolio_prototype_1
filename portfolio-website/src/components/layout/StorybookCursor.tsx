"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/* ──────────────────────────────────────────────────────────
   StorybookCursor – Premium Concentric Lagrangian Cursor
   Features dynamic trailing springs, scroll-adaptive colors,
   active tactile click down feedback, smart typing input 
   autohide features, and fully optimized, lint-safe React effects.
   ────────────────────────────────────────────────────────── */

const interactiveSelector =
  'a, button, input, textarea, select, [role="button"], [data-cursor="interactive"], .nature-card, .clickable-nature';

export const StorybookCursor = () => {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Raw coordinate motion values
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Coordinate Spring 1: Snap tracking for central core and tooltip
  const dotSpringX = useSpring(x, { stiffness: 450, damping: 28, mass: 0.35 });
  const dotSpringY = useSpring(y, { stiffness: 450, damping: 28, mass: 0.35 });

  // Coordinate Spring 2: Lagrangian fluid trailing tracking for outer rings
  const ringSpringX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.45 });
  const ringSpringY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.45 });

  const { scrollYProgress } = useScroll();

  // Dynamic color system mapping to storytelling chapters:
  // Dawn gold ➡️ Forest path green ➡️ Meadow yellow-green ➡️ Dusk rose ➡️ Night silver
  const cursorColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#f0b429", "#a3f3a3", "#7db523", "#f5b3af", "#c7cfff"]
  );

  // 1. Hook 1: Handle mounting, resize, and touchscreen coarse-pointer checks
  useEffect(() => {
    setMounted(true);

    const checkDevice = () => {
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(coarsePointer);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // 2. Hook 2: Handle pointer move, leave, click/down, and text input hover events
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);

      const target = event.target as Element | null;
      if (!target) return;

      setIsHovering(Boolean(target.closest(interactiveSelector)));

      // Check if mouse is hovering over typing fields where native carets are preferred
      const isText = Boolean(
        target.closest(
          'input[type="text"], input[type="email"], input[type="password"], textarea, [contenteditable="true"]',
        ),
      );
      setIsTextInput(isText);
    };

    const handleLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
      setIsClicked(false);
    };

    const handleDown = () => setIsClicked(true);
    const handleUp = () => setIsClicked(false);

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [prefersReducedMotion, isMobile, x, y]);

  if (prefersReducedMotion || !mounted || isMobile) return null;

  return (
    <>
      {/* ─── Lagging Concentric Outer Rings ─── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] flex items-center justify-center"
        style={{
          x: ringSpringX,
          y: ringSpringY,
        }}
        animate={{
          opacity: isVisible && !isTextInput ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Layer 1 (Outer Backdrop-Blur Ring) */}
        <motion.div
          className="absolute rounded-full border border-white/10 backdrop-blur-[1.5px]"
          style={{ borderColor: cursorColor }}
          animate={{
            width: isClicked ? 14 : isHovering ? 56 : 30,
            height: isClicked ? 14 : isHovering ? 56 : 30,
            backgroundColor: isHovering
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(255, 255, 255, 0)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />

        {/* Layer 2 (Interactive Spinning Dashed Focal Ring) */}
        <motion.div
          className="absolute rounded-full border border-dashed border-white/20"
          style={{ borderColor: cursorColor }}
          animate={{
            width: isClicked ? 0 : isHovering ? 46 : 20,
            height: isClicked ? 0 : isHovering ? 46 : 20,
            rotate: isHovering ? 360 : 0,
            opacity: isClicked ? 0 : 1,
          }}
          transition={{
            rotate: isHovering
              ? { repeat: Infinity, duration: 8, ease: "linear" }
              : { duration: 0.3 },
            width: { type: "spring", stiffness: 350, damping: 25 },
            height: { type: "spring", stiffness: 350, damping: 25 },
            opacity: { duration: 0.15 },
          }}
        />

        {/* Layer 3 (Soft Glowing Mid-Aura) */}
        <motion.div
          className="absolute rounded-full opacity-35 blur-[2.5px]"
          style={{ backgroundColor: cursorColor }}
          animate={{
            width: isClicked ? 24 : isHovering ? 28 : 12,
            height: isClicked ? 24 : isHovering ? 28 : 12,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />
      </motion.div>

      {/* ─── Snappy Central Core Dot ─── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10001] flex items-center justify-center"
        style={{
          x: dotSpringX,
          y: dotSpringY,
        }}
        animate={{
          opacity: isVisible ? (isTextInput ? 0.35 : 1) : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Layer 4 (Inner Central Core Solid Dot) */}
        <motion.div
          className="absolute rounded-full shadow-md mix-blend-difference"
          style={{ backgroundColor: cursorColor }}
          animate={{
            width: isTextInput ? 3 : isClicked ? 12 : isHovering ? 8 : 4.5,
            height: isTextInput ? 3 : isClicked ? 12 : isHovering ? 8 : 4.5,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
        />
      </motion.div>

      {/* ─── Isolated Snappy Floating Tooltip ─── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          x: dotSpringX,
          y: dotSpringY,
        }}
      >
        <motion.div
          className="-translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-lg backdrop-blur-[2px] whitespace-nowrap"
          style={{
            color: cursorColor,
            backgroundColor: "rgba(15, 13, 46, 0.85)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
          initial={false}
          animate={{
            opacity: isHovering && !isTextInput && !isClicked ? 0.95 : 0,
            y: isHovering ? -42 : -20,
            scale: isHovering ? 1 : 0.8,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          Explore
        </motion.div>
      </motion.div>
    </>
  );
};

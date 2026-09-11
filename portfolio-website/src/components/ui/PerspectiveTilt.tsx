"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/useSafeReducedMotion";

interface PerspectiveTiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees */
  maxTilt?: number;
  /** Positive pushes the layer toward the viewer, negative pushes it back */
  depth?: number;
}

/* ──────────────────────────────────────────────────────────
   PerspectiveTilt – wraps content in a real CSS 3D transform
   (perspective + rotateX/rotateY + translateZ) that responds to
   cursor position across its parent, spring-smoothed. Same
   transform-only, GPU-composited math family as the existing
   project-card 3D tilt and the hero's magnetic buttons — no new
   scroll math, no new rendering stack. No-op on touch devices
   (no mousemove) and disabled entirely under prefers-reduced-motion.
   ────────────────────────────────────────────────────────── */

export const PerspectiveTilt = ({
  children,
  className,
  maxTilt = 6,
  depth = 0,
}: PerspectiveTiltProps) => {
  // useSafeReducedMotion, not framer-motion's own useReducedMotion — this
  // return value changes what DOM structure gets rendered (see below), and
  // the raw hook reads the real preference synchronously on the client's
  // very first render, which can differ from the server's default-false
  // render and produce a genuine hydration mismatch.
  const prefersReducedMotion = useSafeReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springX = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      onTouchCancel={handleMouseLeave}
      className={className}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateZ: depth,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

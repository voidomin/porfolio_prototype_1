"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   TrailHiker – a small flat-vector hiker standing on a ridge,
   tucked into a corner of the hero. Leans gently toward the
   cursor (same spring-smoothed motion-value math as Magnetic
   and PerspectiveTilt) and plays a slow idle sway at rest, so
   it reads as "alive" rather than static decoration. Static
   pose under prefers-reduced-motion; the idle sway alone
   carries it on touch devices, where there's no cursor.
   ────────────────────────────────────────────────────────── */

export const TrailHiker = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  // Whole-viewport tracking (not just this element's bounds) so the hiker
  // reacts to the cursor anywhere in the hero, not only when hovered directly.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx);
      my.set(ny);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [prefersReducedMotion, mx, my]);

  const lean = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const drift = useTransform(springY, [-0.5, 0.5], [-3, 3]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="hidden sm:block absolute bottom-16 right-4 md:right-12 z-[3] pointer-events-none select-none w-32 md:w-40"
    >
      <motion.svg
        viewBox="0 0 160 140"
        className="w-full h-auto overflow-visible"
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotate: lean,
                y: drift,
              }
        }
      >
        {/* Ridge the hiker stands on */}
        <path
          d="M0,140 L0,95 Q40,60 80,85 Q120,55 160,90 L160,140 Z"
          fill="rgba(13, 32, 13, 0.28)"
        />

        {/* Hiker figure, standing on the ridge peak */}
        <g transform="translate(78, 48)">
          {/* Walking stick / trekking pole — sways gently at rest */}
          <motion.line
            x1="14"
            y1="8"
            x2="24"
            y2="46"
            stroke="rgba(13, 32, 13, 0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transformOrigin: "14px 8px" }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    rotate: [-4, 4, -4],
                  }
            }
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Legs */}
          <line
            x1="0"
            y1="30"
            x2="-4"
            y2="46"
            stroke="rgba(13, 32, 13, 0.75)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1="30"
            x2="6"
            y2="46"
            stroke="rgba(13, 32, 13, 0.75)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Body */}
          <path d="M-6,8 Q0,2 6,8 L8,30 Q0,34 -8,30 Z" fill="rgba(13, 32, 13, 0.75)" />

          {/* Arm holding the pole */}
          <line
            x1="4"
            y1="12"
            x2="14"
            y2="8"
            stroke="rgba(13, 32, 13, 0.75)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Head */}
          <circle cx="0" cy="-2" r="6" fill="rgba(13, 32, 13, 0.75)" />
        </g>
      </motion.svg>
    </div>
  );
};

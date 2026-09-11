"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChapterMarkerProps {
  color: string;
  className?: string;
}

/* ──────────────────────────────────────────────────────────
   ChapterMarker – a small trail-flag-on-a-post, planted at
   the top of each chapter as a recurring visual thread tying
   the storytelling together. Deliberately a simple geometric
   shape (post + triangle + mound) rather than a figure — easy
   to render convincingly as flat vector art, unlike a human
   figure. Drops in with a small bounce on scroll-into-view,
   then the flag gives a slow idle wave at rest.
   ────────────────────────────────────────────────────────── */

export const ChapterMarker = ({ color, className = "" }: ChapterMarkerProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ y: -24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 14 }}
      className={cn("mx-auto mb-3 w-fit", className)}
    >
      <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
        {/* Ground mound */}
        <ellipse cx="14" cy="31" rx="9" ry="2.5" fill={color} opacity="0.2" />
        {/* Post */}
        <line x1="8" y1="4" x2="8" y2="31" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Flag — gentle idle wave */}
        <motion.path
          d="M8,5 L23,9 L8,14 Z"
          fill={color}
          style={{ transformOrigin: "8px 9px" }}
          animate={prefersReducedMotion ? { skewY: 0 } : { skewY: [0, 6, 0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
};

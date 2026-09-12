"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LeafShape } from "@/components/ui/LeafShape";

/* ──────────────────────────────────────────────────────────
   FloatingLeaves – CSS-driven leaf particles that drift
   across the viewport with rotation. Creates an organic,
   living atmosphere throughout the page.
   ────────────────────────────────────────────────────────── */

interface Leaf {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const LEAF_COLORS = [
  "rgba(125, 181, 35, 0.5)",
  "rgba(90, 133, 41, 0.45)",
  "rgba(76, 111, 36, 0.4)",
  "rgba(177, 217, 111, 0.35)",
  "rgba(240, 180, 41, 0.3)",
];

function generateLeaves(count: number): Leaf[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: -5 - Math.random() * 10,
    endX: Math.random() * 100,
    endY: 105 + Math.random() * 10,
    rotation: Math.random() * 720 - 360,
    size: 8 + Math.random() * 12,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 25,
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
  }));
}

export const FloatingLeaves = () => {
  const prefersReducedMotion = useReducedMotion();
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = globalThis.innerWidth < 768;
    setIsMobile(mobile);
    setMounted(true);
    if (!mobile) setLeaves(generateLeaves(12));
  }, []);

  if (prefersReducedMotion || isMobile || !mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden print:hidden"
      style={{ zIndex: 4 }}
    >
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          initial={{
            x: `${leaf.startX}vw`,
            y: `${leaf.startY}vh`,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            x: `${leaf.endX}vw`,
            y: `${leaf.endY}vh`,
            rotate: leaf.rotation,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <LeafShape size={leaf.size} color={leaf.color} />
        </motion.div>
      ))}
    </div>
  );
};

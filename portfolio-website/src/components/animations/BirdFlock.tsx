"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   BirdFlock – animated SVG birds that fly across the
   viewport periodically. Simple V-shaped birds with
   wing-flap animation, flying in a loose formation.
   ────────────────────────────────────────────────────────── */

interface Bird {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: number;
}

interface Flock {
  id: number;
  birds: Bird[];
}

function createFlock(): Bird[] {
  const count = 4 + Math.floor(Math.random() * 3);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: -10 - i * 3,
    y: 15 + Math.random() * 25 + (i % 2 === 0 ? -5 : 5),
    size: 0.8 + Math.random() * 0.4,
    delay: i * 0.8 + Math.random() * 0.5,
    speed: 16 + Math.random() * 8,
  }));
}

const BirdShape = ({ size, color, isMobile }: { size: number; color: string; isMobile: boolean }) => (
  <svg
    width={24 * size}
    height={12 * size}
    viewBox="0 0 24 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M0,8 Q4,0 12,6 Q20,0 24,8"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      fill="none"
      animate={
        isMobile
          ? undefined
          : {
              d: [
                "M0,8 Q4,0 12,6 Q20,0 24,8",
                "M0,4 Q4,6 12,6 Q20,6 24,4",
                "M0,8 Q4,0 12,6 Q20,0 24,8",
              ],
            }
      }
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </svg>
);

export const BirdFlock = () => {
  const prefersReducedMotion = useReducedMotion();
  const [flocks, setFlocks] = useState<Flock[]>([]);
  const flockIdCounter = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(globalThis.innerWidth < 768);
    
    // Spawn a new flock every 12-20 seconds
    const spawnFlock = () => {
      flockIdCounter.current += 1;
      const nextId = flockIdCounter.current;
      setFlocks((prev) => {
        const newFlocks = [...prev, { id: nextId, birds: createFlock() }];
        // Keep max 3 flocks in memory
        if (newFlocks.length > 3) newFlocks.shift();
        return newFlocks;
      });
    };

    // Initial flock after a short delay
    const initialTimeout = setTimeout(spawnFlock, 3000);

    const interval = setInterval(spawnFlock, 15000 + Math.random() * 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      <AnimatePresence>
        {flocks.map((flock) => (
          <div key={`flock-${flock.id}`}>
            {flock.birds.map((bird) => (
              <motion.div
                key={`bird-${flock.id}-${bird.id}`}
                className="absolute"
                initial={{
                  x: `${bird.x}vw`,
                  y: `${bird.y}vh`,
                  opacity: 0,
                }}
                animate={{
                  x: "110vw",
                  y: `${bird.y - 5 + Math.random() * 10}vh`,
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: bird.speed,
                  delay: bird.delay,
                  ease: "linear",
                }}
              >
                <BirdShape
                  size={bird.size}
                  color="rgba(30,30,30,0.35)"
                  isMobile={isMobile}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

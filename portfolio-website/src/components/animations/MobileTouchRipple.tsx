"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   MobileTouchRipple – lightweight tap-ripple feedback for
   mobile, where the desktop-only InteractiveTrail cursor
   trail is disabled.
   ────────────────────────────────────────────────────────── */

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const MAX_RIPPLES = 5;

export const MobileTouchRipple = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(globalThis.innerWidth < 768);
    check();
    globalThis.addEventListener("resize", check);
    return () => globalThis.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const id = nextId.current++;
      setRipples((prev) => [
        ...prev.slice(-(MAX_RIPPLES - 1)),
        { id, x: touch.clientX, y: touch.clientY },
      ]);
    };

    globalThis.addEventListener("touchstart", handleTouchStart, { passive: true });
    return () => globalThis.removeEventListener("touchstart", handleTouchStart);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[75] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
            className="absolute w-10 h-10 rounded-full border-2 border-dawn-400/70"
            style={{ left: ripple.x - 20, top: ripple.y - 20 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedNumberProps {
  /** e.g. "2+", "9+", "88%", or non-numeric text like "Data + Product" (rendered as-is) */
  value: string;
  duration?: number;
  className?: string;
}

/* ──────────────────────────────────────────────────────────
   AnimatedNumber – counts up from 0 to the leading numeric
   part of `value` once it scrolls into view, keeping any
   trailing suffix (+, %, ...) intact. Falls back to rendering
   the raw string when it has no leading number.
   ────────────────────────────────────────────────────────── */

export const AnimatedNumber = ({ value, duration = 1200, className }: AnimatedNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(match ? `0${match[2]}` : value);

  useEffect(() => {
    if (!match || !isInView) return;

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const isInt = Number.isInteger(target);
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = target * eased;
      setDisplay(`${isInt ? Math.round(current) : current.toFixed(1)}${suffix}`);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // `match` is derived fresh from `value` every render — safe as a dep since
    // it's only ever read, never used to trigger unnecessary re-animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, duration]);

  return (
    <span ref={ref} className={className}>
      {match ? display : value}
    </span>
  );
};

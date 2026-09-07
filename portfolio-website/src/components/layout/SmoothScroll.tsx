"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { useReducedMotion } from "framer-motion";
import { setLenisInstance } from "@/lib/lenis";

/* ──────────────────────────────────────────────────────────
   SmoothScroll – wires up Lenis for eased wheel scrolling.
   Default options only: wrapper/content left as Lenis's own
   defaults, which animate the real document scroll position
   (not a virtualized transform), so framer-motion's useScroll,
   window.scrollY reads, and IntersectionObserver-based sections
   all keep working untouched. syncTouch stays at its default
   (off), so touch/mobile scroll is completely native.

   Skipped entirely under prefers-reduced-motion — those users
   get fully native, instant scroll, no easing at all.

   Lenis's own autoResize (a ResizeObserver on document.documentElement)
   does not reliably catch height changes driven by content growing
   taller — only viewport/window resizes — which is a known Lenis
   limitation, not specific to this codebase. Confirmed by testing: the
   Projects section grows the document's height dynamically via React
   state (its pinned-scroll container's height), and without an explicit
   nudge, Lenis's cached scroll limit can go stale and silently cap how
   far the page can scroll — it never self-corrects on its own. Fixed
   by checking scrollHeight on the already-running raf tick and calling
   lenis.resize() whenever it changes; a single property read per frame,
   correct regardless of what caused the height change.
   ────────────────────────────────────────────────────────── */

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis();
    setLenisInstance(lenis);

    let rafId: number;
    let lastHeight = document.documentElement.scrollHeight;
    const loop = (time: number) => {
      const height = document.documentElement.scrollHeight;
      if (height !== lastHeight) {
        lastHeight = height;
        lenis.resize();
      }
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
};

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollContext } from "@/contexts/ScrollContext";

const chapters = [
  {
    id: "home",
    title: "Chapter I",
    name: "Dawn Summit",
    subtitle: "Misty mountain peak at sunrise",
    icon: "🌅",
  },
  {
    id: "about",
    title: "Chapter II",
    name: "Pine Forest",
    subtitle: "Silent, towering green canopies",
    icon: "🌲",
  },
  {
    id: "skills",
    title: "Chapter III",
    name: "The Meadow",
    subtitle: "Sunlit wind-swept fields of grass",
    icon: "🌿",
  },
  {
    id: "projects",
    title: "Chapter IV",
    name: "Stepping Stones",
    subtitle: "Pristine mountain rivers and ripples",
    icon: "🪨",
  },
  {
    id: "publications",
    title: "Chapter V",
    name: "The Clearing",
    subtitle: "Deep editorial mountain hollows",
    icon: "📖",
  },
  {
    id: "photography",
    title: "Chapter VI",
    name: "Golden Hour",
    subtitle: "Warm ambers and visual memories",
    icon: "📷",
  },
  {
    id: "contact",
    title: "Chapter VII",
    name: "Campfire at Dusk",
    subtitle: "Gathering under rising ambers",
    icon: "🔥",
  },
];

interface SectionBound {
  id: string;
  top: number;
  bottom: number;
}

export const ChapterTitleIntro = () => {
  const [activeChapter, setActiveChapter] = useState<(typeof chapters)[0] | null>(null);
  const [show, setShow] = useState(false);
  const lastActiveId = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { scrollY } = useScrollContext();

  // Cache section positions so the scroll handler never reads the DOM
  const sectionBounds = useRef<SectionBound[]>([]);

  const cacheBounds = useCallback(() => {
    sectionBounds.current = chapters.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return { id, top: 0, bottom: 0 };
      return { id, top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight };
    });
  }, []);

  useEffect(() => {
    // Cache after a tick so sections have mounted and laid out
    const t = setTimeout(cacheBounds, 200);
    window.addEventListener("resize", cacheBounds);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", cacheBounds);
    };
  }, [cacheBounds]);

  useEffect(() => {
    const runScrollSpy = (currentScrollY: number) => {
      const viewportCenter = currentScrollY + globalThis.innerHeight / 2;
      const bounds = sectionBounds.current;

      for (let i = bounds.length - 1; i >= 0; i--) {
        const { id, top, bottom } = bounds[i];
        if (viewportCenter >= top && viewportCenter <= bottom) {
          if (lastActiveId.current !== id) {
            lastActiveId.current = id;
            const chapter = chapters.find((c) => c.id === id) ?? null;
            setActiveChapter(chapter);
            setShow(true);

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              setShow(false);
              timerRef.current = null;
            }, 2800);
          }
          break;
        }
      }
    };

    runScrollSpy(scrollY.get());
    const unsubscribe = scrollY.on("change", runScrollSpy);

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scrollY]);

  return (
    <div className="fixed bottom-6 left-6 z-[80] pointer-events-none select-none max-w-[340px] hidden md:block">
      <AnimatePresence>
        {show && activeChapter && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="pointer-events-auto flex items-stretch gap-4 p-4 rounded-2xl bg-stone-900/60 border border-amber-500/10 shadow-2xl relative overflow-hidden"
          >
            {/* Left accent bar */}
            <div className="w-1 bg-gradient-to-b from-amber-500/30 to-amber-500 rounded-full" />

            {/* Content */}
            <div className="flex flex-col gap-1 pr-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/60 font-mono">
                {activeChapter.title}
              </span>
              <h4 className="text-lg font-serif font-semibold text-white/90 leading-tight">
                {activeChapter.name} {activeChapter.icon}
              </h4>
              <p className="text-xs text-white/40 font-light italic">{activeChapter.subtitle}</p>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 2.8, ease: "linear" }}
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-500/10 to-amber-500/60"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

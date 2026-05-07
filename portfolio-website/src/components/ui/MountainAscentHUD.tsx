"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollProgress } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
   MountainAscentHUD – Floating Hiking Trail Scroll Navigator.
   Provides a vertical climb map tracker on the right edge:
   - Thin dotted trail line that lights up in gradients on scroll.
   - Tiny labeled checkpoints: Dawn, Forest, Meadow, River, Clearing, Golden Hour, Campfire.
   - Hover reveals clean glassmorphism parchment tags.
   - Clicks trigger cinematic smooth scrolls.
   - Completely hidden on mobile for clean responsiveness.
   ────────────────────────────────────────────────────────── */

const hudItems = [
  { id: "home", label: "Dawn Summit", icon: "🌅" },
  { id: "about", label: "Pine Forest", icon: "🌲" },
  { id: "skills", label: "Sunny Meadow", icon: "🌿" },
  { id: "projects", label: "Stepping Stones", icon: "🪨" },
  { id: "publications", label: "The Clearing", icon: "📖" },
  { id: "photography", label: "Golden Hour", icon: "📷" },
  { id: "contact", label: "Campfire Camp", icon: "🔥" },
];

export const MountainAscentHUD = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const scrollPercentage = useScrollProgress();

  useEffect(() => {
    const handleScrollSpy = () => {
      // Find the element currently centered in the viewport
      const viewportCenter = window.scrollY + window.innerHeight / 2;

      for (let i = hudItems.length - 1; i >= 0; i--) {
        const item = hudItems[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          // If the element crosses the middle or is close to the bottom
          if (viewportCenter >= top && viewportCenter <= top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy(); // Initial execution

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-5 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none pointer-events-auto">
      {/* HUD Container - More compact, ultra-refined */}
      <div className="relative flex flex-col items-center py-3.5 px-1.5 rounded-xl bg-black/15 backdrop-blur-md border border-white/5 shadow-2xl">
        
        {/* Base Hiking Trail (Background Dotted Line) */}
        <div className="absolute w-[2px] h-[calc(100%-32px)] bg-white/10 top-4 bottom-4 border-dashed border-r border-white/5" />

        {/* Lit Hiking Trail (Active Scroll Track) */}
        <div 
          className="absolute w-[1.5px] bg-gradient-to-b from-dawn-400 via-forest-400 to-amber-500 top-4 transition-all duration-300 origin-top"
          style={{
            height: `${(scrollPercentage / 100) * 88}%`,
            maxHeight: "100%",
          }}
        />

        {/* Trail Checkpoints - Tightened gap-4 */}
        <div className="flex flex-col gap-4 relative z-10">
          {hudItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                className="relative flex items-center justify-center cursor-pointer group"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => handleScrollTo(item.id)}
              >
                {/* Floating label tag on hover (slides in smoothly from left) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -15, scale: 0.95 }}
                      animate={{ opacity: 1, x: -8, scale: 1 }}
                      exit={{ opacity: 0, x: -12, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={cn(
                        "absolute right-full mr-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase whitespace-nowrap shadow-md backdrop-blur-md border",
                        isActive
                          ? "bg-forest-900/90 text-white border-forest-500/20"
                          : "bg-white/10 text-white/90 border-white/10"
                      )}
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Trail Dot Checkpoint - Sized down to w-5 h-5 */}
                <motion.div
                  className="relative flex items-center justify-center w-5 h-5"
                  whileHover={{ scale: 1.2 }}
                >
                  {/* Glowing halo pulse on active or hovered checkpoint - Snappy transition and fast breathing */}
                  {(isActive || isHovered) && (
                    <motion.div
                      layoutId="activeHalo"
                      className="absolute inset-0 rounded-full bg-forest-400/25"
                      animate={{ scale: [1.0, 1.35, 1.0] }}
                      transition={{
                        scale: { duration: 1.0, repeat: Infinity, ease: "easeInOut" },
                        layout: { type: "spring", stiffness: 380, damping: 25 } // High stiffness spring snap!
                      }}
                    />
                  )}

                  {/* Inner Dot Core - Sized down to w-2 h-2 */}
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300 border",
                      isActive
                        ? "bg-forest-400 border-forest-200 scale-110 shadow-[0_0_10px_rgba(74,222,128,0.7)]"
                        : "bg-white/20 border-white/10 hover:bg-white/80"
                    )}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

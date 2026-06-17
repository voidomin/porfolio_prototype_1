"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("intro-seen")) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("intro-seen", "1");
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background:
              "linear-gradient(180deg, #fef7e0 0%, #fdedb7 25%, #fbdf85 55%, #f0b429 80%, #224922 100%)",
          }}
        >
          {/* Mountain silhouettes */}
          <svg
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            viewBox="0 0 1440 300"
            preserveAspectRatio="none"
            height="220"
          >
            <path
              d="M0,300 L0,200 Q240,80 480,160 Q720,40 960,120 Q1200,60 1440,160 L1440,300 Z"
              fill="rgba(13,32,13,0.4)"
            />
            <path
              d="M0,300 L0,240 Q180,160 360,210 Q540,130 720,190 Q900,110 1080,175 Q1260,130 1440,200 L1440,300 Z"
              fill="rgba(13,32,13,0.75)"
            />
            <path
              d="M0,300 L0,265 Q360,215 720,255 Q1080,210 1440,265 L1440,300 Z"
              fill="rgba(13,32,13,0.95)"
            />
          </svg>

          {/* Sun */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.4 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8 z-10"
          >
            <div
              className="w-16 h-16 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, #fffde7 0%, #f0b429 55%, rgba(240,180,41,0) 100%)",
                boxShadow:
                  "0 0 60px 20px rgba(240,180,41,0.5), 0 0 120px 40px rgba(240,180,41,0.2)",
              }}
            />
          </motion.div>

          {/* Name + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: "easeOut" }}
            className="text-center z-10"
          >
            <h1
              className="text-6xl sm:text-7xl font-bold text-forest-950 tracking-tight leading-none mb-3"
              style={{ textShadow: "0 2px 20px rgba(255,255,255,0.4)" }}
            >
              Akash
            </h1>
            <p className="text-forest-800/50 text-xs tracking-[0.35em] uppercase font-semibold">
              Full-Stack &amp; Data Science
            </p>
          </motion.div>

          {/* Loading bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-forest-950/10 rounded-full overflow-hidden z-10">
            <motion.div
              className="h-full bg-forest-800/35 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

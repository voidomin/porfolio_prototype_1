"use client";

import { motion } from "framer-motion";
import { Camera, Sun, Image as ImageIcon } from "lucide-react";

/* ──────────────────────────────────────────────────────────
   PhotographySection – "Chapter 6: Golden Hour"
   Beautiful placeholder/coming-soon section styled as a
   nature postcard. Will be populated with actual images
   later.
   ────────────────────────────────────────────────────────── */

export const PhotographySection = () => {
  return (
    <section
      id="photography"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #fce8e6 0%, #fdedb7 20%, #fbdf85 50%, #fdedb7 80%, #fce8e6 100%)",
      }}
    >
      {/* Golden hour atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(240,180,41,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(251,223,133,0.15),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-dawn-700/50 text-sm tracking-[0.3em] uppercase mb-4">
            Chapter Six
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Golden{" "}
            <span className="text-dawn-600">Hour</span>
          </h2>
          <p className="text-stone-600/60 max-w-lg mx-auto">
            A quiet gallery waiting for the perfect light.
          </p>
        </motion.div>

        {/* Coming Soon Postcard */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-2xl mx-auto"
        >
          {/* Polaroid frame */}
          <div className="bg-white rounded-2xl p-4 pb-16 shadow-2xl shadow-dawn-800/15 rotate-[-0.5deg] hover:rotate-0 transition-transform duration-700">
            {/* Image area with nature gradient */}
            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-dawn-200 via-meadow-200 to-river-200">
              {/* Decorative nature scene inside postcard */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/40 backdrop-blur-sm mb-4"
                  >
                    <Camera className="w-8 h-8 text-dawn-600/80" />
                  </motion.div>

                  <p className="text-dawn-800/60 font-medium text-lg mb-2">
                    Coming Soon
                  </p>
                  <p className="text-dawn-700/40 text-sm max-w-xs">
                    Waiting for golden light — a collection of moments captured
                    in nature
                  </p>
                </div>
              </div>

              {/* Floating icons */}
              <motion.div
                animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 text-dawn-500/30"
              >
                <Sun className="w-10 h-10" />
              </motion.div>

              <motion.div
                animate={{ x: [0, -8, 0], y: [0, 6, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 text-meadow-500/25"
              >
                <ImageIcon className="w-8 h-8" />
              </motion.div>
            </div>

            {/* Postcard caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <p className="text-stone-400 text-sm italic font-serif">
                &ldquo;Every photograph tells a story of light and patience&rdquo;
              </p>
            </div>
          </div>

          {/* Second postcard (tilted behind) */}
          <div className="absolute inset-0 bg-white rounded-2xl shadow-xl shadow-dawn-800/10 -z-10 rotate-[2deg] translate-x-2 translate-y-2" />
          <div className="absolute inset-0 bg-white/80 rounded-2xl shadow-lg shadow-dawn-800/5 -z-20 rotate-[4deg] translate-x-4 translate-y-4" />
        </motion.div>
      </div>
    </section>
  );
};

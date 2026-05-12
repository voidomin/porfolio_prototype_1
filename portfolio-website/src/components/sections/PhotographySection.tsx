"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  Calendar,
  Aperture,
  Sliders,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from "lucide-react";
import { galleryImages } from "@/data/portfolio";
import { GalleryImage } from "@/types";

/* ──────────────────────────────────────────────────────────
   PhotographySection – "Chapter 6: Golden Hour"
   A highly elegant, premium photography portfolio.
   Uses an art-gallery matte frame aesthetic with gentle transitions
   and a comprehensive EXIF camera metadata lightbox.
   No 3D tilt or card-clones - completely unique look and feel.
   ────────────────────────────────────────────────────────── */

export const PhotographySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryImage | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  // Filter photos based on active category
  const filteredPhotos = galleryImages.filter((photo) => {
    if (activeCategory === "all") return true;
    return photo.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Extract unique categories from data
  const categories = [
    { id: "all", label: "All Explorations" },
    { id: "nature", label: "Nature & Wilderness" },
  ];

  // Open lightbox at specific index
  const openLightbox = (photo: GalleryImage) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setPhotoIndex(idx !== -1 ? idx : 0);
    setSelectedPhoto(photo);
  };

  // Navigate lightbox
  const nextPhoto = () => {
    const nextIdx = (photoIndex + 1) % filteredPhotos.length;
    setPhotoIndex(nextIdx);
    setSelectedPhoto(filteredPhotos[nextIdx]);
  };

  const prevPhoto = () => {
    const prevIdx = (photoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setPhotoIndex(prevIdx);
    setSelectedPhoto(filteredPhotos[prevIdx]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") setSelectedPhoto(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, photoIndex, filteredPhotos]);

  return (
    <section
      id="photography"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(252, 232, 230, 0.2) 0%, rgba(253, 237, 183, 0.25) 15%, rgba(251, 223, 133, 0.2) 50%, rgba(253, 237, 183, 0.25) 85%, rgba(252, 232, 230, 0.2) 100%)",
      }}
    >
      {/* Golden hour glowing atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(240,180,41,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_70%,rgba(251,223,133,0.12),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-dawn-700/50 text-sm tracking-[0.3em] uppercase mb-4">
            Chapter Six
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 font-sans">
            Golden <span className="text-dawn-600">Hour</span>
          </h2>
          <p className="text-stone-600/60 max-w-lg mx-auto text-sm leading-relaxed">
            Moments captured in transit. Stored with camera exposure profiles (EXIF) 
            to preserve the exact light and setting of each memory.
          </p>
        </div>

        {/* Categories tag navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-stone-900/5 backdrop-blur-md border border-stone-900/5 shadow-inner">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? "bg-stone-900 text-white shadow-md"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Art Gallery Photography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                layout
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                {/* Museum Matte Frame Border Style */}
                <div className="bg-white p-4 pb-6 rounded-xl shadow-xl shadow-stone-900/5 border border-stone-100 hover:shadow-2xl hover:shadow-stone-900/10 transition-all duration-500">
                  {/* Photo Canvas Frame */}
                  <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-stone-100">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Dark glass warm overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-4">
                      {photo.exif?.location && (
                        <span className="text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 drop-shadow-sm">
                          <MapPin className="w-3.5 h-3.5 text-dawn-400" />
                          {photo.exif.location}
                        </span>
                      )}
                      <span className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-stone-900 transition-all duration-300 shadow">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Clean text strip below like an exhibition print */}
                  <div className="mt-4 px-1 text-center">
                    <h3 className="text-stone-800 font-semibold tracking-wide text-sm font-sans">
                      {photo.title || "Untitled"}
                    </h3>
                    {photo.exif?.camera && (
                      <p className="text-stone-400/80 text-[10px] tracking-widest uppercase mt-1">
                        {photo.exif.camera}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Immersive Fullscreen EXIF Lightbox Modal ─── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-stone-950/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Background close click */}
            <div
              className="absolute inset-0 cursor-default"
              onClick={() => setSelectedPhoto(null)}
            />

            {/* Navigation buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 md:left-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-4 md:right-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Lightbox Canvas */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-6xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-white/5 grid grid-cols-1 lg:grid-cols-3 z-10"
            >
              {/* Image Canvas container (Left 2/3) */}
              <div className="lg:col-span-2 relative bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px] max-h-[75vh]">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              </div>

              {/* Technical EXIF Metadata Drawer (Right 1/3) */}
              <div className="p-6 md:p-8 bg-stone-900/90 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 text-stone-300">
                <div className="space-y-6">
                  {/* Photo Title */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-dawn-400 font-bold">
                      Photography Exhibition
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {selectedPhoto.title || "Untitled"}
                    </h3>
                    {selectedPhoto.description && (
                      <p className="text-stone-400 text-sm mt-3 leading-relaxed">
                        {selectedPhoto.description}
                      </p>
                    )}
                  </div>

                  <hr className="border-white/5" />

                  {/* Camera Settings / EXIF Panels */}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold mb-4">
                      Technical Profile (EXIF)
                    </p>

                    <div className="grid grid-cols-1 gap-4 text-xs font-mono">
                      {/* Camera Body */}
                      {selectedPhoto.exif?.camera && (
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                          <Camera className="w-4 h-4 text-dawn-400 shrink-0" />
                          <div>
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider">Camera Body</span>
                            <span className="text-white font-semibold">{selectedPhoto.exif.camera}</span>
                          </div>
                        </div>
                      )}

                      {/* Lens */}
                      {selectedPhoto.exif?.lens && (
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                          <Aperture className="w-4 h-4 text-dawn-400 shrink-0" />
                          <div>
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider">Optics / Lens</span>
                            <span className="text-white font-semibold">{selectedPhoto.exif.lens}</span>
                          </div>
                        </div>
                      )}

                      {/* Exposures parameters */}
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPhoto.exif?.focalLength && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">Focal</span>
                            <span className="text-white font-bold">{selectedPhoto.exif.focalLength}</span>
                          </div>
                        )}
                        {selectedPhoto.exif?.aperture && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">Aperture</span>
                            <span className="text-white font-bold">{selectedPhoto.exif.aperture}</span>
                          </div>
                        )}
                        {selectedPhoto.exif?.shutterSpeed && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">Shutter</span>
                            <span className="text-white font-bold">{selectedPhoto.exif.shutterSpeed}</span>
                          </div>
                        )}
                        {selectedPhoto.exif?.iso && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">ISO Speed</span>
                            <span className="text-white font-bold">{selectedPhoto.exif.iso}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footnotes: Location and Date */}
                <div className="space-y-3 pt-6 border-t border-white/5 text-xs text-stone-400 mt-6 lg:mt-0">
                  {selectedPhoto.exif?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-dawn-400 shrink-0" />
                      <span>{selectedPhoto.exif.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>Captured on {selectedPhoto.createdAt}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

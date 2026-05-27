"use client";

import { useState, useEffect, useCallback } from "react";
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
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { galleryImages } from "@/data/portfolio";
import { GalleryImage } from "@/types";

export default function PhotographyGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryImage | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  // Filter photos based on active category
  const filteredPhotos = galleryImages.filter((photo) => {
    if (activeCategory === "all") return true;
    return photo.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const categories = [
    { id: "all", label: "All Explorations" },
    { id: "nature", label: "Nature" },
    { id: "portrait", label: "Portrait" },
    { id: "street", label: "Street" },
    { id: "architecture", label: "Architecture" },
    { id: "other", label: "Other" },
  ];

  // Open lightbox at specific index
  const openLightbox = (photo: GalleryImage) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setPhotoIndex(idx !== -1 ? idx : 0);
    setSelectedPhoto(photo);
  };

  // Navigate lightbox
  const nextPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    const nextIdx = (photoIndex + 1) % filteredPhotos.length;
    setPhotoIndex(nextIdx);
    setSelectedPhoto(filteredPhotos[nextIdx]);
  }, [photoIndex, filteredPhotos]);

  const prevPhoto = useCallback(() => {
    if (filteredPhotos.length === 0) return;
    const prevIdx = (photoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setPhotoIndex(prevIdx);
    setSelectedPhoto(filteredPhotos[prevIdx]);
  }, [photoIndex, filteredPhotos]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") setSelectedPhoto(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, nextPhoto, prevPhoto]);

  // Masonry Breakpoints
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <main className="min-h-screen bg-stone-950 text-stone-200 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Golden hour glowing atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-[60vh] bg-[radial-gradient(ellipse_at_50%_0%,rgba(240,180,41,0.15),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-[radial-gradient(circle_at_100%_100%,rgba(251,223,133,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col min-h-full">
        {/* Header navigation */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-900 pb-8 mb-12">
          <div className="flex items-center gap-4">
            <Link
              href="/#photography"
              className="group p-3 rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition text-stone-400 hover:text-white flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <span className="text-[10px] text-dawn-500 uppercase tracking-[0.3em] font-bold">Chapter VI Exhibition</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide mt-0.5">Golden Hour Gallery</h1>
            </div>
          </div>
          <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
            A comprehensive visual record of settings, light, and optics. Move your cursor over cards to view Location tags.
          </p>
        </header>

        {/* Categories navigation filter */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap gap-1 p-1.5 rounded-2xl bg-stone-900/40 backdrop-blur-md border border-stone-850 shadow-inner max-w-full justify-center">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? "bg-white text-stone-950 shadow-md"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry Grid Exhibition */}
        {filteredPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center text-stone-500 border border-dashed border-stone-900 rounded-2xl bg-stone-900/10">
            <Compass className="w-12 h-12 text-stone-800 mb-4 animate-spin" style={{ animationDuration: '6s' }} />
            <h3 className="text-base font-bold text-stone-400">Exhibition Empty</h3>
            <p className="text-xs text-stone-600 max-w-sm mt-2">
              No photographs have been imported under this category yet. Select another filter or import new photos via the admin panel.
            </p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid flex w-auto -ml-8"
            columnClassName="my-masonry-grid_column pl-8 bg-clip-padding"
          >
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.8) }}
                className="mb-8 cursor-pointer group"
                onClick={() => openLightbox(photo)}
              >
                {/* Museum Matte Frame Border Style */}
                <div className="bg-stone-900/40 p-4 pb-6 rounded-2xl border border-stone-850 hover:border-stone-700/60 hover:bg-stone-900/60 hover:shadow-2xl hover:shadow-amber-950/5 transition-all duration-500">
                  {/* Photo Canvas Frame */}
                  <div className="relative rounded-lg overflow-hidden bg-stone-950">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Dark glass warm overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-4">
                      {photo.exif?.location && (
                        <span className="text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 drop-shadow-md">
                          <MapPin className="w-3.5 h-3.5 text-dawn-400" />
                          {photo.exif.location}
                        </span>
                      )}
                      <span className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-stone-950 transition-all duration-300 shadow">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Clean text strip below like an exhibition print */}
                  <div className="mt-4 px-1">
                    <h3 className="text-stone-200 font-semibold tracking-wide text-sm font-sans group-hover:text-white transition-colors">
                      {photo.title || "Untitled"}
                    </h3>
                    <div className="flex justify-between items-center mt-2.5">
                      {photo.exif?.camera ? (
                        <p className="text-stone-500 text-[9px] tracking-widest uppercase">
                          {photo.exif.camera}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="text-[9px] text-stone-600 font-mono">
                        {photo.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        )}
      </div>

      {/* ─── Immersive Fullscreen EXIF Lightbox Modal ─── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-stone-950/98 backdrop-blur-xl"
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
    </main>
  );
}

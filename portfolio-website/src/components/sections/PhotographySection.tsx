"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  MapPin,
  Calendar,
  Aperture,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { galleryImages } from "@/data/portfolio";
import { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";
/* ──────────────────────────────────────────────────────────
   PhotographySection – "Chapter 6: Golden Hour"
   A highly elegant, premium photography portfolio.
   Uses an art-gallery matte frame aesthetic with gentle transitions
   and a comprehensive EXIF camera metadata lightbox.
   No 3D tilt or card-clones - completely unique look and feel.
   ────────────────────────────────────────────────────────── */

const GalleryPhotoCard = memo(function GalleryPhotoCard({
  photo,
  onOpen,
  isDragging,
}: {
  photo: GalleryImage;
  onOpen: (p: GalleryImage) => void;
  isDragging: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      className="group select-none shrink-0 text-left cursor-pointer"
      onClick={() => { if (!isDragging) onOpen(photo); }}
    >
      <div className="bg-white p-4 pb-6 rounded-xl shadow-xl shadow-stone-900/5 border border-stone-100 hover:shadow-2xl hover:shadow-stone-900/10 transition-all duration-500">
        <div
          className="relative rounded-lg overflow-hidden bg-stone-100 h-[180px] sm:h-[240px] md:h-[280px]"
          style={{ aspectRatio: photo.width && photo.height ? `${photo.width}/${photo.height}` : "3/2" }}
        >
          {/* Shimmer skeleton while image loads */}
          {!loaded && (
            <div className="absolute inset-0 pulse-shimmer rounded-lg z-10" />
          )}
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 280px"
            quality={90}
            className={cn(
              "object-cover transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-between p-4 z-20">
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
        <div className="mt-4 px-1 text-center max-w-full">
          <h3 className="text-stone-800 font-semibold tracking-wide text-sm font-sans truncate">
            {photo.title || "Untitled"}
          </h3>
          {photo.exif?.camera && (
            <p className="text-stone-400/80 text-[10px] tracking-widest uppercase mt-1 truncate">
              {photo.exif.camera}
            </p>
          )}
        </div>
      </div>
    </button>
  );
});

export const PhotographySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryImage | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [dragConstraintsLeft, setDragConstraintsLeft] = useState(0);

  // Filter photos based on active category
  const filteredPhotos = galleryImages.filter((photo) => {
    if (activeCategory === "all") return true;
    return photo.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // Slice for home page exhibition (featured first, max 6)
  const featuredFilteredPhotos = filteredPhotos.filter((p) => p.featured);
  const homepagePhotos = featuredFilteredPhotos.length > 0 
    ? featuredFilteredPhotos.slice(0, 6) 
    : filteredPhotos.slice(0, 6);

  // Supported categories matching the upload form
  const categories = [
    { id: "all", label: "All" },
    { id: "nature", label: "Nature" },
    { id: "portrait", label: "Portrait" },
    { id: "street", label: "Street" },
    { id: "architecture", label: "Architecture" },
    { id: "other", label: "Other" },
  ];

  // Open lightbox at specific index
  const openLightbox = (photo: GalleryImage) => {
    const idx = homepagePhotos.findIndex((p) => p.id === photo.id);
    setPhotoIndex(idx === -1 ? 0 : idx);
    setSelectedPhoto(photo);
  };

  // Navigate lightbox
  const nextPhoto = useCallback(() => {
    if (homepagePhotos.length === 0) return;
    const nextIdx = (photoIndex + 1) % homepagePhotos.length;
    setPhotoIndex(nextIdx);
    setSelectedPhoto(homepagePhotos[nextIdx]);
  }, [photoIndex, homepagePhotos]);

  const prevPhoto = useCallback(() => {
    if (homepagePhotos.length === 0) return;
    const prevIdx = (photoIndex - 1 + homepagePhotos.length) % homepagePhotos.length;
    setPhotoIndex(prevIdx);
    setSelectedPhoto(homepagePhotos[prevIdx]);
  }, [photoIndex, homepagePhotos]);

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
  }, [selectedPhoto, nextPhoto, prevPhoto]);

  // Update drag constraints
  useEffect(() => {
    const updateConstraints = () => {
      if (carouselTrackRef.current && carouselContainerRef.current) {
        const trackWidth = carouselTrackRef.current.scrollWidth;
        const containerWidth = carouselContainerRef.current.offsetWidth;
        const maxScroll = trackWidth - containerWidth;
        setDragConstraintsLeft(maxScroll > 0 ? -maxScroll : 0);
      }
    };

    updateConstraints();
    const timer = setTimeout(updateConstraints, 1000);
    window.addEventListener("resize", updateConstraints);
    return () => {
      window.removeEventListener("resize", updateConstraints);
      clearTimeout(timer);
    };
  }, [homepagePhotos]);

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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
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
        </motion.div>

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

        {/* Art Gallery Photography Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
        <div
          ref={carouselContainerRef}
          className="relative w-full overflow-hidden py-4"
        >
          <motion.div
            ref={carouselTrackRef}
            drag="x"
            dragConstraints={{ left: dragConstraintsLeft, right: 0 }}
            dragElastic={0.25}
            dragTransition={{ power: 0.3, timeConstant: 250 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
            className="flex gap-8 cursor-grab active:cursor-grabbing w-max px-4"
          >
            {homepagePhotos.map((photo) => (
              <GalleryPhotoCard
                key={photo.id}
                photo={photo}
                onOpen={openLightbox}
                isDragging={isDragging}
              />
            ))}
          </motion.div>
        </div>
        </motion.div>

        {/* View More Button for full gallery page */}
        {filteredPhotos.length > 6 && (
          <div className="flex justify-center mt-16">
            <Link
              href="/photography"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-stone-900 text-white border border-stone-800 hover:bg-stone-850 hover:border-stone-700 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-stone-900/10 hover:shadow-stone-900/25"
            >
              View More Explorations
              <ArrowRight className="w-4 h-4 text-dawn-500 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}
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
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-default bg-transparent border-0 focus:outline-none"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close lightbox"
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
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  unoptimized
                  className="object-contain max-h-[75vh]"
                  priority
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

"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { glowBloomReveal } from "@/lib/revealVariants";
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
  const [isDragging, setIsDragging] = useState(false);

  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [dragConstraintsLeft, setDragConstraintsLeft] = useState(0);

  // Memoized — only recomputes when the active category filter changes
  const filteredPhotos = useMemo(
    () =>
      galleryImages.filter((photo) => {
        if (activeCategory === "all") return true;
        return photo.category.toLowerCase() === activeCategory.toLowerCase();
      }),
    [activeCategory]
  );

  const homepagePhotos = useMemo(() => {
    const featured = filteredPhotos.filter((p) => p.featured);
    return featured.length > 0 ? featured.slice(0, 6) : filteredPhotos.slice(0, 6);
  }, [filteredPhotos]);

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

  // Keyboard navigation + body scroll lock when lightbox is open
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

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPhoto]);

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
        {/* Section header — a warm glow blooms in, matching golden hour light */}
        <motion.div
          className="relative text-center mb-16"
          variants={glowBloomReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            aria-hidden
            className="absolute inset-x-0 -top-10 h-40 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(240,180,41,0.25),transparent_65%)]"
          />
          <p className="relative z-10 text-dawn-700/50 text-sm tracking-[0.3em] uppercase mb-4">
            Chapter Six
          </p>
          <h2 className="relative z-10 text-4xl md:text-5xl font-bold text-stone-900 mb-4 font-sans">
            Golden <span className="text-dawn-600">Hour</span>
          </h2>
          <p className="relative z-10 text-stone-600/60 max-w-lg mx-auto text-sm leading-relaxed">
            Moments captured in transit. Stored with camera exposure profiles (EXIF) to preserve the
            exact light and setting of each memory.
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
          <div ref={carouselContainerRef} className="relative w-full overflow-hidden py-4">
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
                <button
                  key={photo.id}
                  type="button"
                  className="group select-none shrink-0 text-left cursor-pointer"
                  onClick={() => {
                    if (!isDragging) openLightbox(photo);
                  }}
                >
                  <div className="bg-white p-4 pb-6 rounded-xl shadow-xl shadow-stone-900/5 border border-stone-100 hover:shadow-2xl hover:shadow-stone-900/10 transition-all duration-500">
                    {/* pulse-shimmer bg shows until the Next.js Image renders on top */}
                    <div
                      className="relative rounded-lg overflow-hidden pulse-shimmer h-[180px] sm:h-[240px] md:h-[280px]"
                      style={{
                        aspectRatio:
                          photo.width && photo.height ? `${photo.width}/${photo.height}` : "3/2",
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 280px"
                        quality={90}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                      />
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
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* View More Button for full gallery page */}
        {filteredPhotos.length > 6 && (
          <div className="flex justify-center mt-16">
            <Link
              href="/photography"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-stone-900 text-white border border-stone-800 hover:bg-stone-850 hover:border-stone-700 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-stone-900/10 hover:shadow-stone-900/25"
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
            className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/95 backdrop-blur-xl"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
          >
            {/* Click backdrop to close */}
            <div className="fixed inset-0 cursor-default" onClick={() => setSelectedPhoto(null)} />

            {/* Centering wrapper — sits above backdrop, centers content */}
            <div className="relative z-10 min-h-full flex items-center justify-center p-4 md:p-8">
              {/* Main Lightbox Canvas */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* ── Image pane ── */}
                <div className="relative bg-stone-950 flex items-center justify-center lg:flex-1 min-h-[220px]">
                  {/* Blurred bg fill — hides any remaining empty strips */}
                  <div
                    className="absolute inset-0 scale-110 blur-2xl opacity-40 pointer-events-none"
                    style={{
                      backgroundImage: `url(${selectedPhoto.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs the image's natural aspect ratio, which next/image's required width/height fights */}
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    className="relative z-10 block max-w-full max-h-[90vh] lg:max-h-[90vh] object-contain"
                    style={{ maxHeight: "min(90vh, 70vw)" }}
                  />

                  {/* Photo counter pill */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-stone-950/70 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-stone-400 tabular-nums">
                    {photoIndex + 1} / {homepagePhotos.length}
                  </div>
                </div>

                {/* ── Info panel ── */}
                <div
                  className="lg:w-72 xl:w-80 shrink-0 flex flex-col bg-stone-950/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/8 overflow-y-auto"
                  data-lenis-prevent
                  style={{ maxHeight: "90vh" }}
                >
                  {/* Close button inside panel */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-dawn-500 font-bold">
                      Exhibition
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(null)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 px-6 py-5 space-y-5">
                    {/* Title & description */}
                    <div>
                      <h3 className="text-xl font-bold text-white leading-snug">
                        {selectedPhoto.title || "Untitled"}
                      </h3>
                      {selectedPhoto.description && (
                        <p className="text-stone-400 text-sm mt-2.5 leading-relaxed">
                          {selectedPhoto.description}
                        </p>
                      )}
                    </div>

                    {/* Location + date */}
                    <div className="flex flex-col gap-2">
                      {selectedPhoto.exif?.location && (
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <MapPin className="w-3.5 h-3.5 text-dawn-500 shrink-0" />
                          <span>{selectedPhoto.exif.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-stone-600">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{selectedPhoto.createdAt}</span>
                      </div>
                    </div>

                    {/* EXIF — only shown if any data present */}
                    {selectedPhoto.exif && Object.values(selectedPhoto.exif).some(Boolean) && (
                      <>
                        <div className="border-t border-white/5 pt-5">
                          <p className="text-[9px] uppercase tracking-[0.25em] text-stone-600 font-bold mb-3">
                            Camera &amp; Exposure
                          </p>
                          <div className="space-y-2.5">
                            {selectedPhoto.exif.camera && (
                              <div className="flex items-center gap-3">
                                <Camera className="w-3.5 h-3.5 text-dawn-500 shrink-0" />
                                <div>
                                  <p className="text-[9px] text-stone-600 uppercase tracking-wider">
                                    Body
                                  </p>
                                  <p className="text-xs text-white font-medium">
                                    {selectedPhoto.exif.camera}
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedPhoto.exif.lens && (
                              <div className="flex items-center gap-3">
                                <Aperture className="w-3.5 h-3.5 text-dawn-500 shrink-0" />
                                <div>
                                  <p className="text-[9px] text-stone-600 uppercase tracking-wider">
                                    Lens
                                  </p>
                                  <p className="text-xs text-white font-medium">
                                    {selectedPhoto.exif.lens}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Exposure grid */}
                          {(selectedPhoto.exif.focalLength ||
                            selectedPhoto.exif.aperture ||
                            selectedPhoto.exif.shutterSpeed ||
                            selectedPhoto.exif.iso) && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              {[
                                { label: "Focal", value: selectedPhoto.exif.focalLength },
                                { label: "Aperture", value: selectedPhoto.exif.aperture },
                                { label: "Shutter", value: selectedPhoto.exif.shutterSpeed },
                                { label: "ISO", value: selectedPhoto.exif.iso },
                              ]
                                .filter((x) => x.value)
                                .map((x) => (
                                  <div
                                    key={x.label}
                                    className="bg-white/4 rounded-lg px-3 py-2.5 border border-white/5"
                                  >
                                    <p className="text-[9px] text-stone-600 uppercase tracking-wider mb-0.5">
                                      {x.label}
                                    </p>
                                    <p className="text-xs text-white font-bold font-mono">
                                      {x.value}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Navigation footer */}
                  <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={prevPhoto}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      type="button"
                      onClick={nextPhoto}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* end centering wrapper */}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

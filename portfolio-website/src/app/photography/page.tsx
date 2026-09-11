"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Compass,
  ArrowLeft,
  Tv,
  Sun,
  Play,
  Pause,
  Copy,
  Check,
  ImageOff,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { galleryImages } from "@/data/portfolio";
import { GalleryImage } from "@/types";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  sizes,
  priority = false,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="relative w-full h-full min-h-[140px] overflow-hidden flex flex-col items-center justify-center gap-2 bg-stone-900 text-stone-600">
        <ImageOff className="w-6 h-6" />
        <span className="text-[9px] uppercase tracking-wider font-semibold">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${isLoaded ? "" : "pulse-shimmer"}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={90}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-opacity duration-700 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
};

interface MosaicGridProps {
  filteredPhotos: GalleryImage[];
  openLightbox: (photo: GalleryImage) => void;
  galleryTheme: "minimal" | "matte";
}

const getCategoryBorderClass = (category?: string) => {
  switch (category?.toLowerCase()) {
    case "nature":
      return "border-emerald-500/20";
    case "portrait":
      return "border-pink-500/20";
    case "street":
      return "border-indigo-500/20";
    case "architecture":
      return "border-amber-500/20";
    default:
      return "border-stone-800/70";
  }
};

const MosaicGrid = ({ filteredPhotos, openLightbox, galleryTheme }: MosaicGridProps) => {
  return (
    <div className="mosaic-grid w-full px-[2px] sm:px-[3px] md:px-[4px]">
      {filteredPhotos.map((photo) => {
        const overallIdx = filteredPhotos.findIndex((p) => p.id === photo.id);
        const isFeatured = photo.featured;
        const categoryBorderClass = getCategoryBorderClass(photo.category);
        const isMatte = galleryTheme === "matte";

        if (isMatte) {
          return (
            <motion.button
              key={photo.id}
              type="button"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: Math.min(overallIdx * 0.08, 0.8),
              }}
              className="cursor-pointer group relative mb-0.5 sm:mb-[3px] md:mb-1 inline-block w-full break-inside-avoid text-left rounded-none border border-stone-200 bg-white p-3 pb-5 shadow-lg shadow-black/10 transition-all duration-500 hover:border-stone-300 hover:shadow-xl hover:shadow-black/15 md:hover:-translate-y-1"
              onClick={() => openLightbox(photo)}
            >
              <div className="relative overflow-hidden rounded-none bg-stone-100">
                <OptimizedImage
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width || 1920}
                  height={photo.height || 1280}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                  priority={overallIdx < 4}
                  className="block w-full h-auto transition-transform duration-500 ease-out md:group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-stone-950/5 opacity-0 transition-opacity duration-200 md:group-hover:opacity-100" />
              </div>

              <div className="mt-3 px-1 text-center max-w-full select-none">
                <h3 className="text-stone-855 font-semibold tracking-wide text-xs sm:text-sm font-sans truncate">
                  {photo.title || "Untitled"}
                </h3>
                {photo.exif?.camera && (
                  <p className="text-stone-400 text-[9px] sm:text-[10px] tracking-widest uppercase mt-0.5 truncate">
                    {photo.exif.camera}
                  </p>
                )}
              </div>
            </motion.button>
          );
        }

        return (
          <motion.button
            key={photo.id}
            type="button"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: Math.min(overallIdx * 0.08, 0.8),
            }}
            className={`cursor-pointer group relative mb-0.5 sm:mb-[3px] md:mb-1 inline-block w-full break-inside-avoid text-left rounded-none border bg-stone-950/95 shadow-md shadow-black/20 transition-all duration-500 hover:border-dawn-500/40 hover:shadow-xl hover:shadow-stone-950/25 md:hover:-translate-y-1 ${
              isFeatured
                ? "border-dawn-500/25 md:scale-[1.015] md:shadow-stone-950/30"
                : categoryBorderClass
            }`}
            onClick={() => openLightbox(photo)}
          >
            <div className="relative overflow-hidden rounded-none bg-stone-900/70">
              <OptimizedImage
                src={photo.src}
                alt={photo.alt}
                width={photo.width || 1920}
                height={photo.height || 1280}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
                priority={overallIdx < 4}
                className="block w-full h-auto transition-transform duration-500 ease-out md:group-hover:scale-[1.01]"
              />

              <div className="absolute inset-0 bg-stone-950/12 backdrop-blur-[4px] opacity-0 transition-opacity duration-150 md:group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 opacity-0 transition-opacity duration-150 md:group-hover:opacity-100 select-none">
                <div className="rounded-none border border-white/10 bg-stone-950/55 px-3 py-2 backdrop-blur-md">
                  <h3 className="text-xs sm:text-sm font-medium text-white leading-snug line-clamp-1">
                    {photo.title || "Untitled"}
                  </h3>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default function PhotographyGalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryImage | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  // View and Filters States
  const [viewMode, setViewMode] = useState<"grid" | "filmstrip">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCamera, setFilterCamera] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Autoplay / Slideshow States
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [autoplayPacing, setAutoplayPacing] = useState<number>(5);
  const [dominantColor, setDominantColor] = useState<string>("rgba(240, 180, 41, 0.15)");

  // Loupe States
  const [showLoupe, setShowLoupe] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0 });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [zoomBgSize, setZoomBgSize] = useState<string>("");
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const markImageFailed = (id: string) =>
    setFailedImages((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

  // Theme, clipboard and touch states
  const [galleryTheme, setGalleryTheme] = useState<"minimal" | "matte">("minimal");
  const [copiedSettings, setCopiedSettings] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Lightbox Touch Swipe Navigation handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diffX = touchStartX - touchEndX;
    const minSwipeDistance = 50; // swipe threshold in px

    if (diffX > minSwipeDistance) {
      nextPhoto();
    } else if (diffX < -minSwipeDistance) {
      prevPhoto();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Copy EXIF technical profile settings to clipboard
  const handleCopySettings = () => {
    if (!selectedPhoto) return;
    const exif = selectedPhoto.exif;
    const details = [
      selectedPhoto.title ? `Title: ${selectedPhoto.title}` : "",
      exif?.camera ? `Camera: ${exif.camera}` : "",
      exif?.lens ? `Lens: ${exif.lens}` : "",
      exif?.focalLength || exif?.aperture || exif?.shutterSpeed || exif?.iso
        ? `Settings: ${[
            exif.focalLength,
            exif.aperture,
            exif.shutterSpeed,
            exif.iso ? `ISO ${exif.iso}` : "",
          ]
            .filter(Boolean)
            .join(" · ")}`
        : "",
      exif?.location ? `Location: ${exif.location}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(details).then(() => {
      setCopiedSettings(true);
      setTimeout(() => setCopiedSettings(false), 2000);
    });
  };

  // Dynamic filter lists from database
  const cameraOptions = Array.from(
    new Set(galleryImages.map((img) => img.exif?.camera).filter(Boolean))
  );
  const locationOptions = Array.from(
    new Set(galleryImages.map((img) => img.exif?.location).filter(Boolean))
  );

  // Filter photos based on parameters
  const filteredPhotos = galleryImages.filter((photo) => {
    const matchesCategory =
      activeCategory === "all" || photo.category.toLowerCase() === activeCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      photo.title?.toLowerCase().includes(query) ||
      photo.description?.toLowerCase().includes(query) ||
      photo.exif?.camera?.toLowerCase().includes(query) ||
      photo.exif?.lens?.toLowerCase().includes(query) ||
      photo.exif?.location?.toLowerCase().includes(query);
    const matchesCamera = filterCamera === "all" || photo.exif?.camera === filterCamera;
    const matchesLocation = filterLocation === "all" || photo.exif?.location === filterLocation;
    return matchesCategory && matchesSearch && matchesCamera && matchesLocation;
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
    setPhotoIndex(idx === -1 ? 0 : idx);
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
      if (e.key === "Escape") {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else if (isCinemaMode) {
          setIsCinemaMode(false);
        }
      }
      if (!selectedPhoto) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, isCinemaMode, nextPhoto, prevPhoto]);

  useFocusTrap(Boolean(selectedPhoto), lightboxRef);

  // Body scroll lock when lightbox is open
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

  // Dynamic dominant color extraction for active photo in lightbox
  useEffect(() => {
    if (!selectedPhoto) {
      setIsAutoplay(false); // Turn off autoplay when closing the modal
      return;
    }

    // Default category fallback mapping
    const categoryColors: Record<string, string> = {
      nature: "rgba(16, 185, 129, 0.15)", // emerald
      portrait: "rgba(236, 72, 153, 0.15)", // pink
      street: "rgba(99, 102, 241, 0.15)", // indigo
      architecture: "rgba(245, 158, 11, 0.15)", // amber
      other: "rgba(168, 85, 247, 0.15)", // purple
    };

    const cat = selectedPhoto.category?.toLowerCase() || "";
    const fallbackColor = categoryColors[cat] || "rgba(240, 180, 41, 0.15)";
    setDominantColor(fallbackColor);

    // Try dynamic canvas extraction (supports CORS dynamically)
    const img = new globalThis.Image();
    img.crossOrigin = "anonymous";
    img.src = selectedPhoto.src;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 10, 10);
        const imgData = ctx.getImageData(0, 0, 10, 10).data;

        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < imgData.length; i += 4) {
          const pr = imgData[i];
          const pg = imgData[i + 1];
          const pb = imgData[i + 2];
          const pa = imgData[i + 3];

          if (pa < 150) continue; // skip highly transparent pixels

          r += pr;
          g += pg;
          b += pb;
          count++;
        }

        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          setDominantColor(`rgba(${r}, ${g}, ${b}, 0.22)`); // soft ambient glow
        }
      } catch {
        // Canvas extraction failed (e.g. CORS); fallback color already set
      }
    };
  }, [selectedPhoto]);

  // Autoplay timer effect
  useEffect(() => {
    if (!isAutoplay || !selectedPhoto) return;

    const timer = setInterval(() => {
      nextPhoto();
    }, autoplayPacing * 1000);

    return () => clearInterval(timer);
  }, [isAutoplay, selectedPhoto, autoplayPacing, nextPhoto]);

  // Helper to start the slideshow from the main page controls
  const startSlideshow = () => {
    if (filteredPhotos.length === 0) return;
    setPhotoIndex(0);
    setSelectedPhoto(filteredPhotos[0]);
    setIsAutoplay(true);
  };

  // Handle global click to exit cinema mode when clicking background
  useEffect(() => {
    if (!isCinemaMode) return;
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.target === mainRef.current || e.target === containerRef.current) {
        setIsCinemaMode(false);
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [isCinemaMode]);

  // Filmstrip horizontal scroll listener
  const filmstripContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = filmstripContainerRef.current;
    if (!el || viewMode !== "filmstrip") return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY * 1.2;
    };

    const onScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const pct = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(pct);
    };

    onScroll();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
    };
  }, [viewMode, filteredPhotos]);

  const scrollFilmstrip = (direction: "left" | "right") => {
    const el = filmstripContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollTo({
      left: el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  // Loupe Mouse Tracking
  const handleLoupeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container || !selectedPhoto) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (x < 0 || y < 0 || x > width || y > height) {
      setShowLoupe(false);
      return;
    }

    const imgWidth = selectedPhoto.width || 1920;
    const imgHeight = selectedPhoto.height || 1280;
    const imageRatio = imgWidth / imgHeight;
    const containerRatio = width / height;

    let renderedWidth: number;
    let renderedHeight: number;
    if (containerRatio > imageRatio) {
      renderedHeight = height;
      renderedWidth = height * imageRatio;
    } else {
      renderedWidth = width;
      renderedHeight = width / imageRatio;
    }

    const xOffset = (width - renderedWidth) / 2;
    const yOffset = (height - renderedHeight) / 2;

    if (x < xOffset || x > xOffset + renderedWidth || y < yOffset || y > yOffset + renderedHeight) {
      setShowLoupe(false);
      return;
    }

    const rx = ((x - xOffset) / renderedWidth) * 100;
    const ry = ((y - yOffset) / renderedHeight) * 100;

    setShowLoupe(true);
    setLoupePos({ x, y });
    setZoomPos({ x: rx, y: ry });
    setZoomBgSize(`${renderedWidth * 2.5}px auto`);
  };

  const renderGalleryContent = () => {
    if (filteredPhotos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-32 text-center text-stone-500 border border-dashed border-stone-900 rounded-2xl bg-stone-900/10 mx-6 md:mx-8">
          <Compass
            className="w-12 h-12 text-stone-800 mb-4 animate-spin"
            style={{ animationDuration: "6s" }}
          />
          <h3 className="text-base font-bold text-stone-400">Exhibition Empty</h3>
          <p className="text-xs text-stone-600 max-w-sm mt-2">
            No photographs match your query or have been imported under this category. Select
            another filter or import new photos.
          </p>
        </div>
      );
    }

    if (viewMode === "filmstrip") {
      return (
        <>
          {/* Cinematic Horizontal Filmstrip View Container */}
          <div className="relative group/filmstrip w-full px-4 md:px-16 my-auto">
            {/* Scroll Left Chevron Button */}
            <button
              type="button"
              onClick={() => scrollFilmstrip("left")}
              className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-stone-950/80 border border-stone-850 text-stone-400 hover:text-white hover:border-dawn-500/50 hover:bg-stone-900 shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 group-hover/filmstrip:opacity-100 hidden md:flex items-center justify-center cursor-pointer hover:scale-105"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scroll Right Chevron Button */}
            <button
              type="button"
              onClick={() => scrollFilmstrip("right")}
              className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-stone-950/80 border border-stone-850 text-stone-400 hover:text-white hover:border-dawn-500/50 hover:bg-stone-900 shadow-2xl backdrop-blur-md transition-all duration-300 opacity-0 group-hover/filmstrip:opacity-100 hidden md:flex items-center justify-center cursor-pointer hover:scale-105"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scroll Track */}
            <div
              ref={filmstripContainerRef}
              data-lenis-prevent
              className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap h-[68vh] w-full snap-x snap-mandatory scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-stone-950 py-4 select-none scroll-smooth"
            >
              {filteredPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => openLightbox(photo)}
                  className="inline-flex flex-col h-full snap-start px-2 cursor-pointer relative group/item overflow-hidden bg-stone-950 border border-stone-900/60 hover:border-dawn-500/40 transition-all duration-500 animate-fadeIn shrink-0 text-left"
                  style={{
                    aspectRatio:
                      photo.width && photo.height ? `${photo.width}/${photo.height}` : "3/2",
                  }}
                >
                  {/* Top film edge with repeating sprocket holes */}
                  <div
                    className="w-full h-5 bg-stone-900 shrink-0 relative flex items-center justify-between px-2 border-b border-black/40"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' y='2' width='12' height='6' rx='1' fill='%230c0a09'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "left center",
                    }}
                  >
                    <span className="absolute left-3 top-0.5 text-[8px] font-mono text-stone-500 tracking-widest z-10 bg-stone-900 px-1 pointer-events-none uppercase">
                      GH-{photo.id.replace("gal-", "")}
                    </span>
                  </div>

                  {/* Canvas frame container */}
                  <div className="relative flex-1 bg-black overflow-hidden w-full h-full">
                    {failedImages.has(photo.id) ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-600">
                        <ImageOff className="w-6 h-6" />
                        <span className="text-[9px] uppercase tracking-wider font-semibold">
                          Image unavailable
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={() => markImageFailed(photo.id)}
                        className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-103"
                        draggable="false"
                      />
                    )}

                    {/* Overlay details showing EXIF metadata on hover */}
                    <div className="absolute inset-0 bg-stone-950/85 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-stone-350 select-none whitespace-normal z-10">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-dawn-400 font-bold block mb-1">
                          {photo.category || "Exhibitions"}
                        </span>
                        <h3 className="text-sm font-extrabold text-white leading-snug">
                          {photo.title || "Untitled"}
                        </h3>
                        {photo.description && (
                          <p className="text-stone-400 text-[11px] mt-2.5 leading-relaxed line-clamp-4">
                            {photo.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 border-t border-stone-850 pt-3">
                        {photo.exif?.camera && (
                          <p className="text-[10px] font-mono text-stone-300 truncate flex items-center gap-2">
                            <Camera className="w-3.5 h-3.5 text-dawn-500 shrink-0" />
                            {photo.exif.camera}
                          </p>
                        )}
                        {photo.exif?.location && (
                          <p className="text-[10px] text-stone-300 truncate flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-dawn-500 shrink-0" />
                            {photo.exif.location}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-[9px] text-stone-500 font-mono pt-1">
                          <span>
                            {photo.exif?.aperture && `${photo.exif.aperture} `}
                            {photo.exif?.shutterSpeed && `${photo.exif.shutterSpeed} `}
                            {photo.exif?.iso && `ISO ${photo.exif.iso}`}
                          </span>
                          <span>{photo.createdAt}</span>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 border border-white/10 text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 hover:bg-white hover:text-stone-950">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom film edge with repeating sprocket holes */}
                  <div
                    className="w-full h-5 bg-stone-900 shrink-0 relative flex items-center justify-between px-2 border-t border-black/40"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' y='2' width='12' height='6' rx='1' fill='%230c0a09'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "left center",
                    }}
                  >
                    <span className="absolute right-3 bottom-0.5 text-[8px] font-mono text-stone-500 tracking-widest z-10 bg-stone-900 px-1 pointer-events-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Scroll Progress Bar Indicator */}
          {filteredPhotos.length > 0 && (
            <div className="w-full max-w-7xl mx-auto px-6 md:px-8 mt-6">
              <div className="h-[2px] w-full bg-stone-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dawn-500 transition-all duration-75 ease-out"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-stone-500 font-mono mt-2 uppercase tracking-widest">
                <span>Exhibition Track</span>
                <span>{Math.round(scrollProgress)}%</span>
              </div>
            </div>
          )}
        </>
      );
    }

    return (
      <MosaicGrid
        filteredPhotos={filteredPhotos}
        openLightbox={openLightbox}
        galleryTheme={galleryTheme}
      />
    );
  };

  return (
    <main
      ref={mainRef}
      className="min-h-screen bg-stone-950 text-stone-200 font-sans pt-4 pb-6 md:pt-6 md:pb-8 px-0 relative overflow-hidden cursor-default"
    >
      {/* Golden hour glowing atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-[60vh] bg-[radial-gradient(ellipse_at_50%_0%,rgba(240,180,41,0.15),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-[radial-gradient(circle_at_100%_100%,rgba(251,223,133,0.06),transparent_60%)]" />
      </div>

      {isCinemaMode && (
        <button
          onClick={() => setIsCinemaMode(false)}
          className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-stone-900 border border-stone-800 hover:border-dawn-500 text-white font-semibold text-xs uppercase tracking-widest rounded-full shadow-2xl shadow-black/80 hover:shadow-dawn-500/20 transition-all duration-300 flex items-center gap-2.5 animate-fadeIn group cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dawn-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-dawn-500"></span>
          </span>
          <Sun className="w-4 h-4 text-dawn-400 group-hover:rotate-45 transition-transform duration-500" />
          <span>Lights On</span>
        </button>
      )}

      <div ref={containerRef} className="relative z-10 w-full mx-auto flex flex-col min-h-full">
        {/* Control Dimming Wrapper */}
        <div
          className={`transition-opacity duration-750 ${isCinemaMode ? "opacity-5 pointer-events-none" : "opacity-100"}`}
        >
          {/* Header navigation */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-900 pb-4 sm:pb-8 mb-6 sm:mb-12 px-4 sm:px-6 md:px-8">
            <div className="flex items-center gap-4">
              <Link
                href="/#photography"
                className="group p-3 rounded-xl bg-stone-900 border border-stone-850 hover:bg-stone-800 transition text-stone-400 hover:text-white flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <div>
                <span className="text-[10px] text-dawn-500 uppercase tracking-[0.3em] font-bold">
                  Chapter VI Exhibition
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide mt-0.5">
                  Golden Hour Gallery
                </h1>
              </div>
            </div>
            <p className="hidden sm:block text-xs text-stone-500 max-w-xs leading-relaxed">
              A comprehensive visual record of settings, light, and optics. Move your cursor over
              cards to view details.
            </p>
          </header>

          {/* Categories navigation filter */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex flex-wrap gap-1 p-1.5 rounded-2xl bg-stone-900/40 backdrop-blur-md border border-stone-850 shadow-inner max-w-full justify-center">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
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

          {/* Advanced Filters Panel */}
          <div className="mb-6 sm:mb-8 px-4 sm:px-6 md:px-8 w-full grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 bg-stone-900/20 p-3 sm:p-4 border border-stone-900/40 rounded-2xl">
            <div className="relative col-span-1 md:col-span-2">
              <input
                type="text"
                placeholder="Search by title, location, camera body..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-950/80 border border-stone-850 rounded-xl px-4 py-2.5 text-xs text-stone-300 placeholder-stone-655 focus:outline-none focus:border-dawn-500/60 transition"
              />
            </div>
            <div>
              <select
                value={filterCamera}
                onChange={(e) => setFilterCamera(e.target.value)}
                className="w-full bg-stone-950/80 border border-stone-850 rounded-xl px-4 py-2.5 text-xs text-stone-300 focus:outline-none focus:border-dawn-500/60 transition cursor-pointer"
              >
                <option value="all">All Cameras</option>
                {cameraOptions.map((cam) => (
                  <option key={cam} value={cam}>
                    {cam}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-stone-950/80 border border-stone-850 rounded-xl px-4 py-2.5 text-xs text-stone-300 focus:outline-none focus:border-dawn-500/60 transition cursor-pointer"
              >
                <option value="all">All Locations</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode & Cinema Controller */}
          <div className="flex flex-wrap justify-between items-center gap-y-3 mb-6 sm:mb-10 px-4 sm:px-6 md:px-8 w-full">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 border-r border-white/5 pr-4 mr-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    viewMode === "grid"
                      ? "bg-white text-stone-950 shadow-md font-bold"
                      : "text-stone-400 hover:text-stone-200 bg-stone-900/30 border border-stone-850"
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode("filmstrip")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    viewMode === "filmstrip"
                      ? "bg-white text-stone-950 shadow-md font-bold"
                      : "text-stone-400 hover:text-stone-200 bg-stone-900/30 border border-stone-850"
                  }`}
                >
                  Cinematic Filmstrip
                </button>
              </div>

              {viewMode === "grid" && (
                <div className="flex items-center gap-1 bg-stone-900/50 p-1 rounded-xl border border-white/5 animate-fadeIn">
                  <button
                    onClick={() => setGalleryTheme("minimal")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                      galleryTheme === "minimal"
                        ? "bg-white text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Minimal
                  </button>
                  <button
                    onClick={() => setGalleryTheme("matte")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                      galleryTheme === "matte"
                        ? "bg-white text-stone-950 shadow-sm"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    Museum Matte
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startSlideshow}
                className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-dawn-400 hover:text-dawn-200 bg-stone-900/30 border border-stone-850 hover:border-dawn-500/30 transition flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Play Slideshow
              </button>

              <button
                onClick={() => setIsCinemaMode(true)}
                className="hidden sm:flex px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-stone-200 bg-stone-900/30 border border-stone-850 transition items-center gap-2 cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5" />
                Lights Out
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Content Workspace */}
        {renderGalleryContent()}
      </div>

      {/* ─── Immersive Fullscreen EXIF Lightbox Modal ─── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={lightboxRef}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-8 bg-stone-950/98 backdrop-blur-xl focus:outline-none"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedPhoto.title || "Photo"} — full view`}
          >
            {/* Background close click */}
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-default bg-transparent border-0 focus:outline-none"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close lightbox"
            />

            {/* Soft dynamic ambient glow backdrop */}
            <div
              className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none z-0 filter blur-[120px] opacity-40"
              style={{
                background: `radial-gradient(circle, ${dominantColor} 0%, transparent 65%)`,
              }}
            />

            {/* Navigation buttons — hidden on mobile (swipe to navigate) */}
            <button
              onClick={prevPhoto}
              className="hidden sm:block absolute left-4 md:left-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextPhoto}
              className="hidden sm:block absolute right-4 md:right-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-8 md:right-8 z-50 p-2 sm:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-stone-950 transition-all duration-300"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Main Lightbox Canvas */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-6xl max-h-screen sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] bg-stone-900 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-0 sm:border border-white/5 flex flex-col lg:flex-row z-10"
            >
              {/* Image Canvas container (Left 2/3) with Loupe Zoom */}
              <div
                ref={imageContainerRef}
                onMouseLeave={() => setShowLoupe(false)}
                onMouseMove={handleLoupeMouseMove}
                className="h-[42vh] lg:h-auto lg:flex-1 relative bg-stone-950 flex items-center justify-center overflow-hidden cursor-crosshair"
                role="img"
                aria-label="Magnifiable photo preview"
              >
                {/* Blurred bg fill — hides any empty strips */}
                <div
                  className="absolute inset-0 scale-110 blur-2xl opacity-30 pointer-events-none"
                  style={{
                    backgroundImage: `url(${selectedPhoto.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {failedImages.has(selectedPhoto.id) ? (
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-stone-600 py-24">
                    <ImageOff className="w-10 h-10" />
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      Image unavailable
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    onError={() => markImageFailed(selectedPhoto.id)}
                    className="relative z-10 block max-w-full object-contain select-none"
                    style={{ maxHeight: "min(72vh, 55vw)" }}
                    draggable="false"
                  />
                )}

                {/* Loupe magnifier circular display */}
                {showLoupe && (
                  <div
                    className="absolute w-44 h-44 rounded-full border-2 border-dawn-500 shadow-2xl pointer-events-none overflow-hidden z-20 bg-no-repeat bg-stone-900"
                    style={{
                      left: `${loupePos.x - 88}px`,
                      top: `${loupePos.y - 88}px`,
                      backgroundImage: `url(${selectedPhoto.src})`,
                      backgroundSize: zoomBgSize,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    }}
                  />
                )}
                {/* Autoplay progress bar */}
                {isAutoplay && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
                    <motion.div
                      key={`${selectedPhoto.id}-${autoplayPacing}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: autoplayPacing, ease: "linear" }}
                      className="h-full bg-dawn-500"
                    />
                  </div>
                )}
              </div>

              {/* Technical EXIF Metadata Drawer (Right 1/3) */}
              <div className="flex-1 min-h-0 lg:flex-none lg:w-80 xl:w-96 p-4 sm:p-6 md:p-8 bg-stone-900/90 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 text-stone-300 overflow-y-auto">
                <div className="space-y-6">
                  {/* Slideshow Playback Controls */}
                  <div className="bg-stone-950/60 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
                        Slideshow Autoplay
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAutoplay(!isAutoplay)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAutoplay
                            ? "bg-dawn-500 text-stone-950 shadow-md font-bold"
                            : "text-stone-300 bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {isAutoplay ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            Playing
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Paused
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-stone-500 font-semibold">
                        Pacing
                      </span>
                      <div className="inline-flex gap-1 p-0.5 rounded-lg bg-stone-900 border border-white/5">
                        {([3, 5, 10] as const).map((secs) => {
                          const isSel = autoplayPacing === secs;
                          return (
                            <button
                              key={secs}
                              type="button"
                              onClick={() => setAutoplayPacing(secs)}
                              className={`px-2.5 py-1 rounded-md text-[9px] font-mono tracking-wider transition ${
                                isSel
                                  ? "bg-white/15 text-white font-bold"
                                  : "text-stone-400 hover:text-stone-250"
                              }`}
                            >
                              {secs}s
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

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
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold">
                        Technical Profile (EXIF)
                      </p>
                      <button
                        type="button"
                        onClick={handleCopySettings}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-stone-400 hover:text-white transition-all text-[9px] uppercase font-bold"
                        aria-label="Copy camera details"
                      >
                        {copiedSettings ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400 font-bold" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Specs</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-xs font-mono">
                      {/* Camera Body */}
                      {selectedPhoto.exif?.camera && (
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                          <Camera className="w-4 h-4 text-dawn-400 shrink-0" />
                          <div>
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider">
                              Camera Body
                            </span>
                            <span className="text-white font-semibold">
                              {selectedPhoto.exif.camera}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Lens */}
                      {selectedPhoto.exif?.lens && (
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                          <Aperture className="w-4 h-4 text-dawn-400 shrink-0" />
                          <div>
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider">
                              Optics / Lens
                            </span>
                            <span className="text-white font-semibold">
                              {selectedPhoto.exif.lens}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Exposures parameters */}
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPhoto.exif?.focalLength && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">
                              Focal
                            </span>
                            <span className="text-white font-bold">
                              {selectedPhoto.exif.focalLength}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exif?.aperture && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">
                              Aperture
                            </span>
                            <span className="text-white font-bold">
                              {selectedPhoto.exif.aperture}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exif?.shutterSpeed && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">
                              Shutter
                            </span>
                            <span className="text-white font-bold">
                              {selectedPhoto.exif.shutterSpeed}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exif?.iso && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="block text-stone-500 text-[9px] uppercase tracking-wider mb-0.5">
                              ISO Speed
                            </span>
                            <span className="text-white font-bold">{selectedPhoto.exif.iso}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footnotes: Location and Date */}
                <div className="space-y-3 pt-6 border-t border-white/5 text-xs text-stone-400 mt-auto pt-6">
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Filter, ZoomIn } from "lucide-react";
import { galleryImages } from "@/data/portfolio";
import { GalleryImage, type GalleryCategory } from "@/types";
import { cn } from "@/lib/utils";

const categories: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All Photos" },
  { value: "nature", label: "Nature" },
  { value: "portrait", label: "Portrait" },
  { value: "street", label: "Street" },
  { value: "architecture", label: "Architecture" },
  { value: "other", label: "Other" },
];

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) => {
  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </>
        )}

        {/* Image Container */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative max-w-7xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="w-full h-full object-contain rounded-lg"
            />

            {/* Image Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg"
            >
              <h3 className="text-white text-xl font-semibold mb-2">
                {currentImage.title}
              </h3>
              {currentImage.description && (
                <p className="text-white/80 text-sm mb-2">
                  {currentImage.description}
                </p>
              )}
              <div className="flex items-center justify-between text-white/60 text-xs">
                <span className="capitalize">{currentImage.category}</span>
                <span>
                  {currentIndex + 1} of {images.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const GalleryItem = ({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={image.src}
        alt={image.alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          imageLoaded ? "opacity-100" : "opacity-0",
          "group-hover:scale-110"
        )}
        onLoad={() => setImageLoaded(true)}
      />

      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 animate-pulse" />
      )}

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-black/60 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
        >
          <ZoomIn className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>

      {/* Featured Badge */}
      {image.featured && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
          Featured
        </div>
      )}

      {/* Image Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {image.title && (
          <h4 className="text-white text-sm font-medium mb-1">{image.title}</h4>
        )}
        <div className="text-white/80 text-xs capitalize">{image.category}</div>
      </div>
    </motion.div>
  );
};

export const PhotographySection = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">(
    "all"
  );
  const [filteredImages, setFilteredImages] = useState(galleryImages);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCategoryChange = (category: GalleryCategory | "all") => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(
        galleryImages.filter((image) => image.category === category)
      );
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const featuredImages = filteredImages.filter((img) => img.featured);
  const regularImages = filteredImages.filter((img) => !img.featured);

  return (
    <section id="photography" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Photography <span className="text-primary-500">Gallery</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Capturing moments and telling stories through the lens - a
            collection of my favorite photographs
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={cn(
                "px-6 py-3 rounded-full font-medium transition-all duration-300",
                "border-2 border-transparent",
                activeCategory === category.value
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-500/50"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>{category.label}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Featured Images */}
            {featuredImages.length > 0 && (
              <div className="mb-16">
                <motion.h3
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
                >
                  Featured Photos
                </motion.h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {featuredImages.map((image, index) => (
                    <GalleryItem
                      key={image.id}
                      image={image}
                      index={index}
                      onClick={() =>
                        openLightbox(filteredImages.indexOf(image))
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Images */}
            {regularImages.length > 0 && (
              <div>
                {featuredImages.length > 0 && (
                  <motion.h3
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
                  >
                    Gallery
                  </motion.h3>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {regularImages.map((image, index) => (
                    <GalleryItem
                      key={image.id}
                      image={image}
                      index={index + featuredImages.length}
                      onClick={() =>
                        openLightbox(filteredImages.indexOf(image))
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* No Images Message */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400">
              No photos found in this category.
            </p>
          </motion.div>
        )}

        {/* Gallery Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {galleryImages.length}+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Photos
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {new Set(galleryImages.map((img) => img.category)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Categories
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {galleryImages.filter((img) => img.featured).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Featured Photos
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {new Date().getFullYear() - 2020}+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Years of Photography
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
};

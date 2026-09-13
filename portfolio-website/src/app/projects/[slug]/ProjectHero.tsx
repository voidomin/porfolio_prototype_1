"use client";

import { useState } from "react";
import Image from "next/image";

interface ProjectHeroProps {
  cover: string;
  coverAlt: string;
  images?: string[];
}

/** The case-study hero image. When `images` is populated, adds a small
 * clickable thumbnail strip beneath the main image; otherwise renders
 * exactly the single static hero, unchanged from before this existed. */
export function ProjectHero({ cover, coverAlt, images }: Readonly<ProjectHeroProps>) {
  const gallery = images && images.length > 0 ? images : null;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = gallery ? gallery[activeIndex] : cover;

  return (
    <div className="mb-10">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-200/60 shadow-lg">
        <Image
          src={activeSrc}
          alt={coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          priority
        />
      </div>
      {gallery && gallery.length > 1 && (
        <div className="flex gap-2 mt-3">
          {gallery.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show screenshot ${index + 1}`}
              aria-current={index === activeIndex}
              className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                index === activeIndex
                  ? "border-river-500"
                  : "border-transparent hover:border-stone-300"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

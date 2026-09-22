"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages, galleryTags } from "@/lib/gallery-data";
import { siteConfig } from "@/lib/site-config";

export function Gallery() {
  const [activeTag, setActiveTag] = useState("All");
  const filtered =
    activeTag === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.tag === activeTag);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2.5">
        {galleryTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`rounded-full border-[1.5px] px-5 py-2 text-[0.82rem] font-semibold transition-colors ${
              tag === activeTag
                ? "border-charcoal bg-charcoal text-white"
                : "border-line bg-white hover:border-terracotta"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img) => (
          <div
            key={img.src}
            className="group relative aspect-[4/5] overflow-hidden rounded-[14px] bg-charcoal shadow-soft"
          >
            <span className="absolute top-3 left-3 z-10 rounded-full bg-ivory/92 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-charcoal">
              {img.tag}
            </span>
            <Image
              src={img.src}
              alt={`${img.tag} before and after result at ${siteConfig.name}`}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 32vw, 48vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

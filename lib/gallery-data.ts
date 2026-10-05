// Real before/after client photos, self-hosted in public/images/gallery.

export type GalleryImage = {
  src: string;
  tag: string;
};

export const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/blonde-before-and-after-1.webp", tag: "Blonde" },
  { src: "/images/gallery/blonde-before-and-after-2.webp", tag: "Blonde" },
  { src: "/images/gallery/foils-1.webp", tag: "Highlights" },
  { src: "/images/gallery/foils-2.webp", tag: "Highlights" },
  { src: "/images/gallery/foils-3.webp", tag: "Highlights" },
  { src: "/images/gallery/balayage-1.webp", tag: "Balayage" },
  { src: "/images/gallery/balayage2.webp", tag: "Balayage" },
  { src: "/images/gallery/balayage-barclays.webp", tag: "Balayage" },
  { src: "/images/gallery/color-correction-1.webp", tag: "Color Correction" },
  { src: "/images/gallery/colorcorrection2.webp", tag: "Color Correction" },
  { src: "/images/gallery/custom-1.webp", tag: "Custom Color" },
  { src: "/images/gallery/f-c-1.webp", tag: "Fashion Color" },
  { src: "/images/gallery/foils-4.webp", tag: "Highlights" },
  { src: "/images/gallery/foils-5.webp", tag: "Highlights" },
  { src: "/images/gallery/foils-6.webp", tag: "Highlights" },
  { src: "/images/gallery/balayage3.webp", tag: "Balayage" },
  { src: "/images/gallery/balayage4.webp", tag: "Balayage" },
  { src: "/images/gallery/colorcorrection3.webp", tag: "Color Correction" },
  { src: "/images/gallery/colorcorrection4.webp", tag: "Color Correction" },
  { src: "/images/gallery/custom-2.webp", tag: "Custom Color" },
  { src: "/images/gallery/f-c-2.webp", tag: "Fashion Color" },
  { src: "/images/gallery/barclay-b-and-a-1.webp", tag: "Transformation" },
  { src: "/images/gallery/mens-before-and-after-1.webp", tag: "Men's Cut" },
  { src: "/images/gallery/mens-before-and-after-2.webp", tag: "Men's Cut" },
];

export const galleryTags = [
  "All",
  ...Array.from(new Set(galleryImages.map((img) => img.tag))),
];

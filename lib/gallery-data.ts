// Real before/after client photos, currently hotlinked from the salon's old
// WordPress host. TODO: self-host these (download + add to /public/gallery)
// before launch — see README "Open items".

export type GalleryImage = {
  src: string;
  tag: string;
};

export const galleryImages: GalleryImage[] = [
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/blonde-before-and-after-1-819x1024.png", tag: "Blonde" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/blonde-before-and-after-2-819x1024.png", tag: "Blonde" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/foils-1-819x1024.png", tag: "Highlights" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/foils-2-819x1024.png", tag: "Highlights" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/foils-3-819x1024.png", tag: "Highlights" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/balayage-1-819x1024.png", tag: "Balayage" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/balayage2-819x1024.png", tag: "Balayage" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/balayage-barclays-819x1024.png", tag: "Balayage" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/color-correction-1-819x1024.png", tag: "Color Correction" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/colorcorrection2-819x1024.png", tag: "Color Correction" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/custom-1-819x1024.png", tag: "Custom Color" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/F-C-1-819x1024.png", tag: "Fashion Color" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/foils-4-819x1024.png", tag: "Highlights" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/foils-5-819x1024.png", tag: "Highlights" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/foils-6-819x1024.png", tag: "Highlights" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/balayage3-819x1024.png", tag: "Balayage" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/balayage4-819x1024.png", tag: "Balayage" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/colorcorrection3-819x1024.png", tag: "Color Correction" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/colorcorrection4-819x1024.png", tag: "Color Correction" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/custom-2-819x1024.png", tag: "Custom Color" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/F-C-2-819x1024.png", tag: "Fashion Color" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/06/barclay-b-and-a-1-819x1024.png", tag: "Transformation" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/mens-before-and-after-1-819x1024.png", tag: "Men's Cut" },
  { src: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/mens-before-and-after-2-819x1024.png", tag: "Men's Cut" },
];

export const galleryTags = [
  "All",
  ...Array.from(new Set(galleryImages.map((img) => img.tag))),
];

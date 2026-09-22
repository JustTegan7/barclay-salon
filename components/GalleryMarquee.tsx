import Image from "next/image";
import { galleryImages } from "@/lib/gallery-data";
import { siteConfig } from "@/lib/site-config";

// Two rows, split from the same real gallery set, scrolling opposite
// directions — mirrors the original homepage's marquee effect.
const mid = Math.ceil(galleryImages.length / 2);
const rowA = galleryImages.slice(0, mid);
const rowB = galleryImages.slice(mid);

export function GalleryMarquee() {
  return (
    <div>
      <MarqueeRow images={rowA} />
      <MarqueeRow images={rowB} reverse />
    </div>
  );
}

function MarqueeRow({
  images,
  reverse = false,
}: {
  images: typeof galleryImages;
  reverse?: boolean;
}) {
  // Duplicate the set so the CSS animation (translateX 0 -> -50%) loops seamlessly.
  const doubled = [...images, ...images];

  return (
    <div className={`marquee-row mb-5 ${reverse ? "reverse" : ""}`}>
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="marquee-track flex w-max gap-5 py-1.5">
          {doubled.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="group relative h-[250px] w-[190px] flex-none overflow-hidden rounded-[14px] bg-charcoal shadow-soft sm:h-[300px] sm:w-[230px]"
            >
              <span className="absolute top-3 left-3 z-10 rounded-full bg-ivory/92 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-charcoal">
                {img.tag}
              </span>
              <Image
                src={img.src}
                alt={`${img.tag} before and after result at ${siteConfig.name}`}
                fill
                sizes="230px"
                loading="lazy"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

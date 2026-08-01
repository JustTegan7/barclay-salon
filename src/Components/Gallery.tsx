import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import g1 from "../assets/Gallery/1.jpg";
import g2 from "../assets/Gallery/2.jpg";
import g3 from "../assets/Gallery/3.jpg";
import g4 from "../assets/Gallery/4.jpg";
import g5 from "../assets/Gallery/5.jpg";
import g6 from "../assets/Gallery/6.jpg";
import g7 from "../assets/Gallery/7.jpg";
import g8 from "../assets/Gallery/8.jpg";
import g9 from "../assets/Gallery/9.jpg";
import g10 from "../assets/Gallery/10.jpg";

type Photo = { src: string; alt: string };

type Category = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  photos: Photo[];
};

// Categories mirror the live site's gallery structure. As real
// before/afters come in for Highlights, Color Correction, and
// Men's cuts, add them here as their own category.
const CATEGORIES: Category[] = [
  {
    id: "blonde-balayage",
    eyebrow: "Blonde & balayage",
    title: "Lived-In Blonde",
    intro:
      "Hand-painted balayage and dimensional blonding for soft, low-maintenance color that grows out beautifully.",
    photos: [
      { src: g1, alt: "Lived-in blonde — straight finish" },
      { src: g8, alt: "Textured blonde bob with highlights" },
      { src: g9, alt: "Red copper balayage with waves" },
    ],
  },
  {
    id: "fashion-custom-color",
    eyebrow: "Fashion & custom color",
    title: "Bold, Custom Color",
    intro:
      "From deep auburns to statement fashion tones, our colorists build a shade around what suits you — not just what's trending.",
    photos: [
      { src: g3, alt: "Bold black and red fashion color" },
      { src: g7, alt: "Deep crimson long layers" },
      { src: g5, alt: "Vibrant red — long sleek finish" },
      { src: g4, alt: "Rich auburn custom color" },
    ],
  },
  {
    id: "cuts-styles",
    eyebrow: "Cuts & styles",
    title: "Cuts, Curls & Blowouts",
    intro:
      "Precision cutting and finishing work — from voluminous curls to a glossy, polished blowout.",
    photos: [
      { src: g10, alt: "Dark chocolate blowout" },
      { src: g6, alt: "Dark waves with volume curls" },
      { src: g2, alt: "Glossy dark waves with curtain bangs" },
    ],
  },
];

const CategoryRail: React.FC<{
  category: Category;
  onPhotoClick: (src: string) => void;
}> = ({ category, onPhotoClick }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const didDrag = useRef(false);

  function scroll(dir: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 480 : -480, behavior: "smooth" });
  }

  function onMouseDown(e: React.MouseEvent) {
    const el = trackRef.current;
    if (!el) return;
    setIsDragging(true);
    didDrag.current = false;
    dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft };
    el.style.cursor = "grabbing";
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.pageX - dragStart.current.x;
    if (Math.abs(dx) > 4) didDrag.current = true;
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  }
  function onMouseUp() {
    setIsDragging(false);
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  }

  return (
    <div className="gallery-category" id={category.id}>
      <div className="gallery-header">
        <div className="gallery-header-left">
          <p className="about-eyebrow">{category.eyebrow}</p>
          <h3
            className="services-block-title"
            style={{ marginBottom: "0.5rem" }}
          >
            {category.title}
          </h3>
          <p
            className="section-body"
            style={{ marginBottom: 0, maxWidth: 640 }}
          >
            {category.intro}
          </p>
        </div>
        <div className="gallery-arrows">
          <button
            className="gallery-arrow"
            onClick={() => scroll("left")}
            aria-label={`Scroll ${category.title} left`}
          >
            ←
          </button>
          <button
            className="gallery-arrow"
            onClick={() => scroll("right")}
            aria-label={`Scroll ${category.title} right`}
          >
            →
          </button>
        </div>
      </div>

      <div
        className="gallery-track-wrap"
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="gallery-track">
          {category.photos.map((photo, i) => (
            <button
              key={i}
              className="gallery-slide"
              onClick={() => {
                if (!didDrag.current) onPhotoClick(photo.src);
              }}
              aria-label={`View: ${photo.alt}`}
              tabIndex={0}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={i < 2 ? "eager" : "lazy"}
                draggable={false}
              />
              <div className="gallery-slide-overlay">
                <span className="gallery-slide-icon">+</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <Link className="btn-outline" to="/services">
          View Services & Pricing →
        </Link>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-header">
        <div className="gallery-header-left">
          <p className="about-eyebrow">Our work</p>
          <h2 className="section-heading">From the Chair</h2>
          <p className="section-body" style={{ marginBottom: 0 }}>
            Real results from our stylists — color, cuts, and everything in
            between. Click any photo to enlarge it.
          </p>
        </div>
      </div>

      {CATEGORIES.map((category) => (
        <CategoryRail
          key={category.id}
          category={category}
          onPhotoClick={setLightbox}
        />
      ))}

      {lightbox && (
        <div
          className="gallery-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            className="gallery-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={lightbox}
            alt="Gallery photo"
            className="gallery-lightbox-img"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;

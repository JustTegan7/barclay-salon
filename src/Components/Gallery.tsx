import React, { useRef, useState } from "react";

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

const photos = [
  { src: g3, alt: "Bold black and red fashion color" },
  { src: g9, alt: "Red copper balayage with waves" },
  { src: g4, alt: "Rich auburn custom color" },
  { src: g7, alt: "Deep crimson long layers" },
  { src: g1, alt: "Lived-in blonde — straight finish" },
  { src: g5, alt: "Vibrant red — long sleek finish" },
  { src: g8, alt: "Textured blonde bob with highlights" },
  { src: g10, alt: "Dark chocolate blowout" },
  { src: g6, alt: "Dark waves with volume curls" },
  { src: g2, alt: "Glossy dark waves with curtain bangs" },
];

const Gallery: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
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

  function handlePhotoClick(src: string) {
    if (!didDrag.current) setLightbox(src);
  }

  return (
    <section className="gallery-section" id="gallery">
      <div className="gallery-header">
        <div className="gallery-header-left">
          <p className="about-eyebrow">Our work</p>
          <h2 className="section-heading">From the Chair</h2>
          <p className="section-body" style={{ marginBottom: 0 }}>
            Real results from our stylists — color, cuts, and everything in
            between.
          </p>
        </div>
        <div className="gallery-arrows">
          <button
            className="gallery-arrow"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            className="gallery-arrow"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
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
          {photos.map((photo, i) => (
            <button
              key={i}
              className="gallery-slide"
              onClick={() => handlePhotoClick(photo.src)}
              aria-label={`View: ${photo.alt}`}
              tabIndex={0}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={i < 3 ? "eager" : "lazy"}
                draggable={false}
              />
              <div className="gallery-slide-overlay">
                <span className="gallery-slide-icon">+</span>
              </div>
            </button>
          ))}
        </div>
      </div>

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

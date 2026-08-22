import React from "react";
import { Link } from "react-router-dom";

export const ReviewsSection: React.FC = () => {
  return (
    <section
      className="section"
      id="reviews"
      style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <p className="about-eyebrow">Client love</p>
        <h2 className="section-heading">Don't just take our word for it.</h2>
      </div>

      <div className="rating-banner" style={{ marginTop: "2rem" }}>
        <span className="num">4.2</span>
        <div>
          <span className="stars">★★★★☆</span>
          <small>273+ reviews across Google, Birdeye &amp; Yelp</small>
        </div>
      </div>

      <div
        className="services-cta"
        style={{ marginTop: "2rem" }}
      >
        <Link className="btn-outline" to="/reviews">
          Read &amp; Leave a Review →
        </Link>
      </div>
    </section>
  );
};

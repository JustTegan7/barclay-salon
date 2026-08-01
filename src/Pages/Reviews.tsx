import React from "react";
import { Link } from "react-router-dom";

const Reviews: React.FC = () => {
  return (
    <main className="app-main">
      <div className="contact-page">
        <div className="contact-hero">
          <p className="about-eyebrow">Tell us how we did</p>
          <h1 className="about-title" style={{ marginBottom: "1rem" }}>
            Review Us
          </h1>
          <p className="about-subtitle" style={{ marginBottom: 0 }}>
            Loved your visit? A quick review helps other Everett locals find us
            — and helps our stylists know what's working.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "2rem",
          }}
        >
          <a
            className="btn-primary"
            href="https://www.google.com/maps/search/?api=1&query=Barclay%27s+Salon+Everett+WA"
            target="_blank"
            rel="noreferrer"
          >
            Review Us on Google ↗
          </a>
          <a
            className="btn-outline"
            href="https://www.facebook.com/barclays.hair/reviews"
            target="_blank"
            rel="noreferrer"
          >
            Review Us on Facebook ↗
          </a>
        </div>

        <div className="contact-info-card" style={{ marginTop: "2.5rem" }}>
          <div className="contact-info-row">
            <p className="contact-info-label">Phone</p>
            <p className="contact-info-value">
              <a href="tel:4253531244">425-353-1244</a>
            </p>
          </div>
          <div className="contact-info-row">
            <p className="contact-info-label">Address</p>
            <p className="contact-info-value">
              320 112th Street Southwest
              <br />
              Everett, WA 98204
            </p>
          </div>
          <div className="contact-info-row">
            <p className="contact-info-label">Hours</p>
            <div className="hours-grid">
              <span className="hours-day">Sunday</span>
              <span className="hours-time">Closed</span>
              <span className="hours-day">Monday</span>
              <span className="hours-time">Closed</span>
              <span className="hours-day">Tue – Thu</span>
              <span className="hours-time">10am – 7pm</span>
              <span className="hours-day">Friday</span>
              <span className="hours-time">9am – 6pm</span>
              <span className="hours-day">Saturday</span>
              <span className="hours-time">9am – 5pm</span>
            </div>
          </div>
        </div>

        <div className="services-cta" style={{ marginTop: "2rem" }}>
          <Link to="/" className="btn-outline">
            ← Back Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Reviews;

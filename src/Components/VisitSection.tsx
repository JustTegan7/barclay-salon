import React from "react";

export const VisitSection: React.FC = () => {
  return (
    <section
      className="section"
      id="visit"
      style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <p className="about-eyebrow">Find us</p>
        <h2 className="section-heading">
          Everett, WA — easy to find, easy to visit.
        </h2>
      </div>

      <div className="visit-grid" style={{ marginTop: "2rem" }}>
        <div className="visit-card">
          <h3>Barclay's Salon</h3>
          <div className="visit-line">
            <span className="ic">📍</span>
            <div>
              <strong>320 112th Street Southwest</strong>
              Everett, WA 98204
              <br />
              <a
                className="btn-outline"
                style={{ marginTop: "10px", display: "inline-flex" }}
                href="https://www.google.com/maps/dir/?api=1&destination=Barclay's+Hair+Design,320+112th+St+SW,Everett,WA+98204"
                target="_blank"
                rel="noreferrer"
              >
                Get Directions →
              </a>
            </div>
          </div>
          <div className="visit-line">
            <span className="ic">📞</span>
            <div>
              <strong>425-353-1244</strong>
              <a href="tel:4253531244">Tap to call</a>
            </div>
          </div>
          <div className="visit-line">
            <span className="ic">🕐</span>
            <div style={{ width: "100%" }}>
              <strong>Hours</strong>
              <div className="hours-grid">
                <span className="hours-day">Tuesday – Thursday</span>
                <span className="hours-time">10am – 7pm</span>
                <span className="hours-day">Friday</span>
                <span className="hours-time">9am – 6pm</span>
                <span className="hours-day">Saturday</span>
                <span className="hours-time">9am – 5pm</span>
                <span className="hours-day">Sunday – Monday</span>
                <span className="hours-time">Closed</span>
              </div>
            </div>
          </div>
        </div>
        <div className="visit-map">
          <iframe
            title="Map to Barclay's Salon"
            src="https://www.google.com/maps?q=Barclay's+Salon+320+112th+Street+Southwest+Everett,+WA+98204&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

// src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import Gallery from "./Components/Gallery";
import BookingModal from "./Components/BookingModal";

import ServicesPage from "./Pages/Services";
import AboutPage from "./Pages/About";
import ContactPage from "./Pages/Contact";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import "./Pages/dashboard.css";

import heroPhoto from "./assets/Gallery/9.jpg";

import { apiGet } from "./api/client";
import type { Service } from "./types";

const SHOP_URL = "https://shop.saloninteractive.com/store/BARCLAYSALON";

const ScrollToHash: React.FC = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/") return;
    if (!hash) return;
    const id = hash.replace("#", "");
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [hash, pathname]);
  return null;
};

/** ── Home Page ─────────────────────────────────────────── */
const HomePage: React.FC<{ onQuickBook: () => void }> = ({ onQuickBook }) => {
  const [previewServices, setPreviewServices] = useState<Service[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setPreviewLoading(true);
        setPreviewError("");
        const data = await apiGet<Service[]>("/services");
        if (!cancelled) setPreviewServices((data ?? []).slice(0, 6));
      } catch (e) {
        console.error(e);
        if (!cancelled)
          setPreviewError("Services preview unavailable right now.");
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app-main">
      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-grid">
          <div>
            <p className="hero-intro-eyebrow">Everett's color destination</p>
            <h1 className="hero-title">
              Lived-in color &amp; modern cuts,
              <span className="hero-highlight"> tailored to you.</span>
            </h1>
            <p className="hero-tagline">
              Barclay's Salon is a family-owned Redken Club 5th Avenue salon,
              trusted for color excellence, healthy hair, and warm service since
              1977.
            </p>
            <div className="hero-cta-row">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={onQuickBook}
              >
                ✂ Book Your Appointment
              </button>
              <Link className="btn-outline" to="/services">
                View Services
              </Link>
            </div>
            <p className="hero-book-note">
              Online booking takes less than 60 seconds.
            </p>
            <div className="hero-meta">
              <span>Family-owned in Everett since 1977</span>
              <span>Redken &amp; Pureology products</span>
              <span>Ongoing advanced education for stylists</span>
            </div>
          </div>
          <aside className="hero-photo-card" aria-label="Salon work example">
            <img src={heroPhoto} alt="Custom color work by Barclay's Salon" />
            <div className="hero-photo-card-badge">
              Custom color · Everett, WA
            </div>
          </aside>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section
        className="section"
        id="about"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p className="about-eyebrow" style={{ marginBottom: "0.875rem" }}>
          Our story
        </p>
        <h2 className="section-heading">About Barclay's Salon</h2>
        <p className="section-body">
          Since 1977, Barclay's Salon has been part of the Everett community as
          a family-owned salon focused on beautiful, healthy hair. We've been a
          Redken Club 5th Avenue salon for over 30 years and proudly use Redken
          and Pureology products for their proven color protection and hair
          care.
        </p>
        <p className="section-body">
          Education is at the heart of what we do. Our team attends events like
          Redken Symposium in Las Vegas and other national shows throughout the
          year, bringing back fresh techniques and trend inspiration to every
          guest who sits in our chairs.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          <Link className="btn-outline" to="/about">
            Read Our Story
          </Link>
          <button type="button" className="btn-primary" onClick={onQuickBook}>
            Book Now
          </button>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section
        className="section"
        id="services"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <p className="about-eyebrow" style={{ marginBottom: "0.875rem" }}>
          Menu preview
        </p>
        <h2 className="section-heading">Services</h2>
        <p className="section-body">
          A quick peek at our menu. For the full list with all categories and
          pricing, visit the Services page.
        </p>
        {previewError ? (
          <p className="section-muted" style={{ marginTop: "10px" }}>
            {previewError}
          </p>
        ) : previewLoading ? (
          <p className="section-muted" style={{ marginTop: "10px" }}>
            Loading preview…
          </p>
        ) : previewServices.length > 0 ? (
          <div className="placeholder-rail">
            {previewServices.map((s) => (
              <div key={s.id} className="placeholder-card">
                <div>{s.name}</div>
                <div
                  className="section-muted"
                  style={{ marginTop: "6px", fontSize: "13px" }}
                >
                  {s.category} · ${Math.round(s.base_price_cents / 100)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="placeholder-rail">
            {[
              { name: "Haircut – Short", cat: "Haircuts", price: "$61+" },
              {
                name: "Full Foil Custom Blonding",
                cat: "Color",
                price: "$148+",
              },
              { name: "Full Balayage Service", cat: "Color", price: "$161+" },
              { name: "Brazilian Blowout", cat: "Texture", price: "$310+" },
              {
                name: "Full Balayage Custom Package",
                cat: "Packages",
                price: "$312+",
              },
              { name: "Brow Wax", cat: "Waxing", price: "$23+" },
            ].map((s) => (
              <div key={s.name} className="placeholder-card">
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "6px",
                  }}
                >
                  {s.cat}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text)",
                    marginBottom: "8px",
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "22px",
                    color: "var(--gold)",
                  }}
                >
                  {s.price}
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          <Link className="btn-outline" to="/services">
            View Full Menu →
          </Link>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <Gallery />

      {/* ── SHOP ── */}
      <section
        className="section"
        id="shop"
        style={{
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        <p className="about-eyebrow" style={{ marginBottom: "0.875rem" }}>
          Professional retail
        </p>
        <h2 className="section-heading">Shop Redken &amp; Pureology</h2>
        <p className="section-body">
          Browse our curated selection of professional haircare products — the
          same brands our stylists trust every day in the salon.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          <a
            className="btn-primary"
            href={SHOP_URL}
            target="_blank"
            rel="noreferrer"
          >
            Visit Our Shop ↗
          </a>
        </div>
      </section>
    </main>
  );
};

/** ── App Root ───────────────────────────────────────────── */
const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <div className="app">
      <ScrollToHash />
      <Navbar onQuickBook={openBooking} />

      <Routes>
        <Route path="/" element={<HomePage onQuickBook={openBooking} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      {isBookingOpen && <BookingModal onClose={closeBooking} />}
    </div>
  );
};

export default App;

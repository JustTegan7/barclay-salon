// src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";

import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import { TopBar } from "./Components/TopBar";
import { QuickStrip } from "./Components/QuickStrip";
import { PricingTabs } from "./Components/PricingTabs";
import { TeamSection } from "./Components/TeamSection";
import { ReviewsSection } from "./Components/ReviewsSection";
import { FaqSection } from "./Components/FaqSection";
import { VisitSection } from "./Components/VisitSection";
import { FinalCta } from "./Components/FinalCta";
import { MobileBookBar } from "./Components/MobileBookBar";
import Gallery from "./Components/Gallery";
import BookingModal from "./Components/BookingModal";

import ServicesPage from "./Pages/Services";
import AboutPage from "./Pages/About";
import ContactPage from "./Pages/Contact";
import SpecialsPage from "./Pages/Specials";
import ReviewsPage from "./Pages/Reviews";
import ApplyPage from "./Pages/Apply";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import "./Pages/dashboard.css";

import heroPhoto from "./assets/Gallery/9.jpg";

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
              <span>4.2★ · 273+ reviews across Google, Birdeye &amp; Yelp</span>
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

      {/* ── QUICK INFO STRIP ── */}
      <QuickStrip />

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

      {/* ── SERVICES & PRICING ── */}
      <section
        className="section"
        id="services"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <p className="about-eyebrow">Service menu</p>
          <h2 className="section-heading">Real pricing, no PDF required.</h2>
          <p className="section-body" style={{ margin: "0 auto" }}>
            Every price below is pulled straight from Barclay's current menu.
            Final pricing may vary by stylist &amp; hair length — ask at
            booking.
          </p>
        </div>
        <PricingTabs />
      </section>

      {/* ── GALLERY ── */}
      <Gallery />

      {/* ── TEAM ── */}
      <TeamSection onQuickBook={onQuickBook} />

      {/* ── REVIEWS ── */}
      <ReviewsSection />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── VISIT / LOCATION ── */}
      <VisitSection />

      {/* ── FINAL CTA ── */}
      <FinalCta onQuickBook={onQuickBook} />

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
      <TopBar />
      <Navbar onQuickBook={openBooking} />

      <Routes>
        <Route path="/" element={<HomePage onQuickBook={openBooking} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/specials" element={<SpecialsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/apply" element={<ApplyPage />} />
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
      <MobileBookBar onQuickBook={openBooking} />

      {isBookingOpen && <BookingModal onClose={closeBooking} />}
    </div>
  );
};

export default App;

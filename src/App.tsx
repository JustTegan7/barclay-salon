// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";

import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import Gallery from "./Components/Gallery";

import ServicesPage from "./Pages/Services";
import AboutPage from "./Pages/About";
import ContactPage from "./Pages/Contact";
import LoginPage from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import "./Pages/dashboard.css";

import logo from "./assets/Barclays_logo.png";
import heroPhoto from "./assets/gallery/9.jpg"; // coral balayage — vivid hero image

import { apiGet, apiPost } from "./api/client";
import type { Service } from "./types";

type Appointment = {
  id: string;
  service_id: string;
  service_name: string;
  datetime: string;
  status: string;
  created_at: string;
};

type CreateAppointmentResponse = {
  ok: boolean;
  appointment?: Appointment;
  error?: string;
};

function formatLocal(dtIso: string) {
  const d = new Date(dtIso);
  if (Number.isNaN(d.getTime())) return dtIso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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

            <img src={logo} alt="Barclay's Salon Logo" className="hero-logo" />

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

      {/* ── ABOUT (home section) ── */}
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
          /* Static fallback when API hasn't loaded */
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

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [serviceId, setServiceId] = useState<string>("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);

  const openBooking = () => setIsBookingOpen(true);

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPreferredDateTime("");
    setServiceId("");
    setSubmitError("");
    setSubmitLoading(false);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    resetForm();
    setServicesError("");
    setCreatedAppointment(null);
  };

  useEffect(() => {
    if (!isBookingOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setServicesLoading(true);
        setServicesError("");
        const data = await apiGet<Service[]>("/services");
        if (!cancelled) setServices(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setServicesError(
            "Could not load services. Check backend + VITE_API_URL.",
          );
          setServices([]);
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isBookingOpen]);

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, Service[]>();
    for (const s of services) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    for (const [cat, arr] of map.entries()) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
      map.set(cat, arr);
    }
    return map;
  }, [services]);

  async function submitAppointment() {
    setSubmitError("");
    setCreatedAppointment(null);
    if (!name.trim()) return setSubmitError("Please enter your name.");
    if (!serviceId) return setSubmitError("Please select a service.");
    if (!preferredDateTime)
      return setSubmitError("Please pick a date and time.");

    const iso = new Date(preferredDateTime).toISOString();

    try {
      setSubmitLoading(true);
      const res = await apiPost<CreateAppointmentResponse>(
        "/api/appointments",
        {
          name: name.trim(),
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          serviceId,
          datetime: iso,
        },
      );
      if (!res.ok || !res.appointment?.id)
        throw new Error(res.error || "Booking failed.");
      setCreatedAppointment(res.appointment);
      resetForm();
    } catch (e) {
      console.error(e);
      setSubmitError(
        e instanceof Error ? e.message : "Booking failed. Please try again.",
      );
    } finally {
      setSubmitLoading(false);
    }
  }

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      {/* ── Booking Modal ── */}
      {isBookingOpen && (
        <div className="modal-backdrop" onClick={closeBooking}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Quick Book Request</h2>
              <button
                type="button"
                className="modal-close"
                onClick={closeBooking}
                aria-label="Close booking form"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>Submit a request and we'll follow up to confirm details.</p>

              {servicesError && (
                <p className="modal-note" style={{ marginBottom: "1rem" }}>
                  <strong>{servicesError}</strong>
                </p>
              )}
              {submitError && (
                <p
                  className="modal-note"
                  style={{ marginBottom: "1rem", color: "#c0392b" }}
                >
                  <strong>{submitError}</strong>
                </p>
              )}

              {createdAppointment ? (
                <div className="modal-note" style={{ marginTop: "0.75rem" }}>
                  <div
                    style={{
                      fontWeight: 500,
                      marginBottom: "0.5rem",
                      fontSize: "15px",
                    }}
                  >
                    ✅ Request received
                  </div>
                  <div
                    style={{ display: "grid", gap: "6px", fontSize: "14px" }}
                  >
                    <div>
                      <strong>Service:</strong>{" "}
                      {createdAppointment.service_name}
                    </div>
                    <div>
                      <strong>Preferred time:</strong>{" "}
                      {formatLocal(createdAppointment.datetime)}
                    </div>
                    <div>
                      <strong>Status:</strong> {createdAppointment.status}
                    </div>
                    <div>
                      <strong>Reference:</strong>{" "}
                      <code>{createdAppointment.id}</code>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "1.25rem",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        setCreatedAppointment(null);
                        resetForm();
                      }}
                    >
                      Book another
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={closeBooking}
                    >
                      Close
                    </button>
                  </div>
                  <p className="section-muted" style={{ marginTop: "12px" }}>
                    Need a faster change? Call <strong>425-353-1244</strong>.
                  </p>
                </div>
              ) : (
                <>
                  <div className="modal-form">
                    <div>
                      <div className="modal-label">Name</div>
                      <input
                        className="modal-input"
                        placeholder="First & last name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="modal-label">Phone (optional)</div>
                      <input
                        className="modal-input"
                        placeholder="(555) 555-5555"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="modal-label">Email (optional)</div>
                      <input
                        className="modal-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="modal-label">
                        Preferred date &amp; time
                      </div>
                      <input
                        className="modal-input"
                        type="datetime-local"
                        value={preferredDateTime}
                        onChange={(e) => setPreferredDateTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="modal-label">Service interest</div>
                      <select
                        className="modal-select"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        disabled={servicesLoading}
                      >
                        <option value="">
                          {servicesLoading
                            ? "Loading services..."
                            : services.length === 0
                              ? "Select a service"
                              : "Select a service"}
                        </option>
                        {[...servicesByCategory.entries()].map(
                          ([category, items]) => (
                            <optgroup key={category} label={category}>
                              {items.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} — $
                                  {(s.base_price_cents / 100).toFixed(0)}
                                </option>
                              ))}
                            </optgroup>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginTop: "1.5rem",
                    }}
                  >
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={submitAppointment}
                      disabled={submitLoading || servicesLoading}
                    >
                      {submitLoading ? "Submitting…" : "Submit Request"}
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={closeBooking}
                    >
                      Close
                    </button>
                  </div>

                  <p className="modal-note" style={{ marginTop: "1.25rem" }}>
                    Until full real-time scheduling is live, please call{" "}
                    <strong>425-353-1244</strong> to book or adjust an
                    appointment.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

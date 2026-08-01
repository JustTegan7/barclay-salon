import React, { useState } from "react";
import { Link } from "react-router-dom";

const ROLES = [
  "Cuts & Styles",
  "Balayage & Color Specialist",
  "Salon Assistant / Apprentice",
  "Esthetician / Nail Tech",
  "Receptionist / Front Desk",
  "Other",
];

const ApplyPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      // Same Formspree endpoint as the general Contact form — the
      // hidden _subject field routes these into the inbox clearly
      // labeled, so no separate form ID is needed to ship this.
      const res = await fetch("https://formspree.io/f/xqeydoev", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-main">
      <div className="contact-page">
        <div className="contact-hero">
          <p className="about-eyebrow">Join the team</p>
          <h1 className="about-title" style={{ marginBottom: "1rem" }}>
            Apply Now
          </h1>
          <p className="about-subtitle" style={{ marginBottom: 0 }}>
            Tell us a bit about yourself and the role you're interested in. We
            review every application and reach out to candidates whose
            experience and passion align with our team.
          </p>
        </div>

        <div className="contact-body">
          <div>
            <h2 className="contact-form-title">Your information</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="_subject"
                value="New Job Application — Barclay's Salon"
              />
              <input type="hidden" name="form_type" value="Careers" />

              <div className="form-group">
                <label className="form-label" htmlFor="ap-name">
                  Name
                </label>
                <input
                  id="ap-name"
                  name="name"
                  className="form-input"
                  type="text"
                  placeholder="First & last name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ap-email">
                  Email
                </label>
                <input
                  id="ap-email"
                  name="email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ap-phone">
                  Phone
                </label>
                <input
                  id="ap-phone"
                  name="phone"
                  className="form-input"
                  type="tel"
                  placeholder="(555) 555-5555"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ap-role">
                  Position you're interested in
                </label>
                <select id="ap-role" name="role" className="form-input">
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ap-experience">
                  Tell us about your experience
                </label>
                <textarea
                  id="ap-experience"
                  name="experience"
                  className="form-textarea"
                  placeholder="Licenses, years behind the chair, a link to your portfolio or Instagram — whatever you'd like us to see first."
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending…" : "Submit Application"}
              </button>
            </form>

            {submitted && (
              <div className="contact-success visible">
                <p>
                  Thanks for applying! We'll review your information and reach
                  out if it's a fit. You can also reach us directly at{" "}
                  <strong>425-353-1244</strong>.
                </p>
              </div>
            )}

            {error && (
              <div className="contact-error visible">
                <p>
                  Something went wrong. Please try again or call us at{" "}
                  <strong>425-353-1244</strong>.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="contact-info-card">
              <div className="contact-info-row">
                <p className="contact-info-label">Prefer to call?</p>
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
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <Link className="btn-outline" to="/about">
                ← Back to About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApplyPage;

import React, { useState } from "react";

const ContactPage: React.FC = () => {
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
        {/* Hero */}
        <div className="contact-hero">
          <p className="about-eyebrow">Get in touch</p>
          <h1 className="about-title" style={{ marginBottom: "1rem" }}>
            Contact Us
          </h1>
          <p className="about-subtitle" style={{ marginBottom: 0 }}>
            Have a question or want to reach us directly? We'd love to hear from
            you.
          </p>
        </div>

        {/* Body */}
        <div className="contact-body">
          {/* Form */}
          <div>
            <h2 className="contact-form-title">Send a message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="ct-name">
                  Name
                </label>
                <input
                  id="ct-name"
                  name="name"
                  className="form-input"
                  type="text"
                  placeholder="First & last name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ct-email">
                  Email
                </label>
                <input
                  id="ct-email"
                  name="email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ct-phone">
                  Phone (optional)
                </label>
                <input
                  id="ct-phone"
                  name="phone"
                  className="form-input"
                  type="tel"
                  placeholder="(555) 555-5555"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ct-subject">
                  Subject
                </label>
                <select id="ct-subject" name="subject" className="form-input">
                  <option>General inquiry</option>
                  <option>Appointment question</option>
                  <option>Product question</option>
                  <option>Careers / employment</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ct-message">
                  Message
                </label>
                <textarea
                  id="ct-message"
                  name="message"
                  className="form-textarea"
                  placeholder="Tell us what's on your mind…"
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>

            {submitted && (
              <div className="contact-success visible">
                <p>
                  Thanks! We'll be in touch shortly. You can also reach us
                  directly at <strong>425-353-1244</strong>.
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

          {/* Info Card */}
          <div>
            <div className="contact-info-card">
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
              <div className="contact-info-row">
                <p className="contact-info-label">Online shop</p>
                <p className="contact-info-value">
                  <a
                    href="https://shop.saloninteractive.com/store/BARCLAYSALON"
                    target="_blank"
                    rel="noreferrer"
                  >
                    shop.saloninteractive.com ↗
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;

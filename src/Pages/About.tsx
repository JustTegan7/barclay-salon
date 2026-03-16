import React, { useState } from "react";

import strip1 from "../assets/gallery/1.jpg";
import strip2 from "../assets/gallery/4.jpg";
import strip3 from "../assets/gallery/7.jpg";
import strip4 from "../assets/gallery/8.jpg";

import photoRyan from "../assets/empPhotos/Ryan-Photo.jpg";
import photoMaryMichael from "../assets/empPhotos/Mary-Michael-Photo.jpg";
import photoVinz from "../assets/empPhotos/Vinz-Photo.jpg";
import photoSheryl from "../assets/empPhotos/Sheryl-Photo.jpg";

// ─── Types ───────────────────────────────────────────────
type HourRow = { days: string; time: string };
type TeamMember = {
  name: string;
  title: string;
  photo: string;
  since?: string;
  bio: string;
  education?: string[];
  specialty?: string[];
  languages?: string;
  hours: HourRow[];
  alt?: boolean; // flip layout left/right
  isReceptionist?: boolean;
};

// ─── Data ─────────────────────────────────────────────────
const TEAM: TeamMember[] = [
  {
    name: "Ryan Barclay",
    title: "Design & Color Specialist",
    photo: photoRyan,
    since: "1998",
    bio: "I enjoy creating 'looks' for people that accent their skin tone, facial shapes, and features to look their best — as well as suiting their personal style. Whether you're looking for a bold transformation or a refined update, I'll make sure you walk out feeling like the best version of yourself.",
    education: [
      "Gene Juarez — Seattle",
      "Redken Training — 16+ years and growing",
      "Certified Redken Colorist",
      "Redken Exchange NYC with NAHA specialists Chris Baran & Sam Villa",
      "Redken Exchange NYC Design, Color & Finish",
      "Redken Specialist",
      "Pureologist",
    ],
    hours: [
      { days: "Tuesday", time: "9a – 7p" },
      { days: "Wednesday", time: "9a – 5p" },
      { days: "Thursday", time: "9a – 7p" },
      { days: "Friday", time: "9a – 6p" },
      { days: "Saturday", time: "9a – 5p" },
    ],
  },
  {
    name: "Mary-Michael Johnson",
    title: "Design & Color Specialist",
    photo: photoMaryMichael,
    since: "2012",
    alt: true,
    bio: "Mary-Michael loves special occasion hair and makeup applications. Her upbeat personality and passion as a hair stylist will leave you feeling good inside and out. Come enjoy a day of laughter and invigoration — she brings energy and expertise to every single appointment.",
    education: [
      "Northwest Hair Academy — 2012",
      "Redken Symposium",
      "Extensive training in Ombré & Balayage",
    ],
    hours: [
      { days: "Tuesday – Wednesday", time: "10a – 7p" },
      { days: "Thursday", time: "10a – 6p" },
      { days: "Friday", time: "9a – 6p" },
      { days: "Saturday", time: "9a – 5p" },
    ],
  },
  {
    name: 'Vincent "Vinz" Pineda',
    title: "Design & Color Specialist",
    photo: photoVinz,
    since: "1998",
    bio: "I provide extensive, all-embracing quality hairstyles — from practicality to trending fashion-forward looks. I incorporate artistry with the balance of nature and science. You will leave feeling refreshed, confident, and empowered.",
    education: [
      "Licensed: Washington State, Calgary AB & the Philippines",
      "David's Salon Master Class",
      "John Paul Mitchell Advanced Haircuts",
      "Redken Color & Products",
      "L'Oréal Cut & Color Roadshow",
      "Elgon Seminar & Training",
    ],
    specialty: [
      "Blonding & Balayage specialist",
      "Custom fashion colors",
      "Gray coverage",
      "Precise women's & men's cuts",
      "Perm services & Keratin treatments",
      "Japanese Straightening (Rebonding)",
      "Special occasion hair & makeup",
      "Threading",
    ],
    languages: "English, Tagalog",
    hours: [
      { days: "Tuesday – Thursday", time: "2p – 7p" },
      { days: "Friday", time: "9a – 6p" },
      { days: "Saturday", time: "9a – 5p" },
    ],
  },
  {
    name: "Sheryl",
    title: "Receptionist & Salon Coordinator",
    photo: photoSheryl,
    alt: true,
    isReceptionist: true,
    bio: "Sheryl is the heart of Barclay's front desk — the warm, welcoming face you'll see the moment you walk in. She keeps everything running smoothly so every stylist can focus on what they do best, and every guest feels taken care of from start to finish.",
    hours: [
      { days: "Tuesday – Friday", time: "See salon hours" },
      { days: "Saturday", time: "See salon hours" },
    ],
  },
];

// ─── Individual Stylist Section ───────────────────────────
const StylistSection: React.FC<{ member: TeamMember; index: number }> = ({
  member,
  index,
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = !!(member.education || member.specialty);

  return (
    <section
      className={`stylist-section${member.alt ? " alt" : ""}${member.isReceptionist ? " receptionist" : ""}`}
      aria-label={member.name}
    >
      <div className="stylist-inner">
        {/* Photo */}
        <div className="stylist-photo-wrap">
          <img
            src={member.photo}
            alt={`${member.name}, ${member.title} at Barclay's Salon`}
            className="stylist-photo"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {member.since && (
            <div className="stylist-since-badge">Est. {member.since}</div>
          )}
        </div>

        {/* Content */}
        <div className="stylist-content">
          <div>
            <h3 className="stylist-name">{member.name}</h3>
            <p className="stylist-title">{member.title}</p>
            {member.languages && (
              <span className="stylist-lang">{member.languages}</span>
            )}
          </div>

          <p className="stylist-bio">{member.bio}</p>

          {/* Hours */}
          <div className="stylist-hours">
            <p className="stylist-block-label">Hours</p>
            <div className="stylist-hours-grid">
              {member.hours.map((h, i) => (
                <React.Fragment key={i}>
                  <span className="stylist-hday">{h.days}</span>
                  <span className="stylist-htime">{h.time}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Education / Specialty accordion */}
          {hasDetails && (
            <div>
              <button
                className="stylist-accordion-btn"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                {expanded ? "Hide details ↑" : "Education & specialties ↓"}
              </button>

              {expanded && (
                <div
                  className="stylist-accordion-body"
                  style={{ marginTop: "1.75rem" }}
                >
                  {member.education && (
                    <div>
                      <p className="stylist-detail-label">Education</p>
                      <ul className="stylist-detail-list">
                        {member.education.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {member.specialty && (
                    <div>
                      <p className="stylist-detail-label">Specialties</p>
                      <ul className="stylist-detail-list">
                        {member.specialty.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Page ─────────────────────────────────────────────────
const AboutPage: React.FC = () => (
  <main className="about">
    {/* ── Hero ── */}
    <header className="about-hero">
      <div className="section about-hero-inner">
        <p className="about-eyebrow">About Barclay's Salon</p>
        <h1 className="about-title">Everett family-owned since 1977</h1>
        <p className="about-subtitle">
          Craftsmanship, care, and connection — plus modern education to keep
          your look fresh and timeless.
        </p>
        <div className="about-hero-meta">
          <span className="about-pill">Family-owned</span>
          <span className="about-pill">Everett roots</span>
          <span className="about-pill">Redken Club 5th Avenue</span>
          <span className="about-pill">Continued education</span>
        </div>
      </div>
    </header>

    {/* ── Our Story ── */}
    <section className="section">
      <div className="about-grid">
        <div className="about-card">
          <h2 className="about-h2">Our Story</h2>
          <p>
            Barclay's Salon has been proudly family-owned and operated in
            Everett since 1977. What began as a local salon has grown into a
            trusted community staple, serving generations of clients while
            staying true to the values it was founded on: craftsmanship, care,
            and connection.
          </p>
          <p>
            We believe great hair is personal. That belief has guided us for
            decades, shaping how we train, how we listen, and how we serve every
            guest who walks through our doors.
          </p>
          <p>
            Education is central to who we are. Our team regularly participates
            in continued training — including Redken Symposium in Las Vegas — to
            stay current with modern trends and advanced techniques.
          </p>
        </div>
        <aside className="about-callout">
          <h3 className="about-h3">What we're known for</h3>
          <ul className="about-list">
            <li>Thoughtful consultation + real listening</li>
            <li>Precision cuts &amp; custom color</li>
            <li>Professional products + hair integrity</li>
            <li>Warm, welcoming atmosphere</li>
          </ul>
          <div className="about-divider" />
          <p className="about-small">
            We've served Everett for decades — and we're just getting started.
          </p>
        </aside>
      </div>
    </section>

    {/* ── Values ── */}
    <section
      className="section"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="about-card">
        <h2 className="about-h2">Mission &amp; Values</h2>
        <div className="mission-block about-mission">
          <h3 className="about-h3">Our Mission</h3>
          <p className="about-lead">
            Our mission is to help every client feel confident, cared for, and
            truly themselves — combining expert technique with genuine
            listening, thoughtful consultation, and a space where everyone feels
            welcome.
          </p>
        </div>
        <h3 className="about-h3 about-values-title">Our Values</h3>
        <div className="about-values">
          <div className="about-value">
            <h4>Quality</h4>
            <p>
              From precision cuts to custom color, we protect the integrity of
              your hair with professional products and proven techniques.
            </p>
          </div>
          <div className="about-value">
            <h4>Community</h4>
            <p>
              Many of our clients have been with us for years. We're honored to
              be part of their lives and milestones.
            </p>
          </div>
          <div className="about-value">
            <h4>Confidence through style</h4>
            <p>
              Great hair has power. We help you leave feeling confident,
              comfortable, and empowered.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ── Photo Strip ── */}
    <div className="about-photo-strip">
      <img src={strip1} alt="Blonde balayage" />
      <img src={strip2} alt="Auburn custom color" />
      <img src={strip3} alt="Deep red long layers" />
      <img src={strip4} alt="Textured blonde bob" />
    </div>

    {/* ── Team header ── */}
    <div
      className="section"
      style={{ borderTop: "1px solid var(--border)", paddingBottom: "1rem" }}
    >
      <p className="about-eyebrow">The people behind the chair</p>
      <h2 className="about-h2">Meet Our Team</h2>
      <p className="about-lead" style={{ maxWidth: "58ch" }}>
        Our stylists bring decades of combined experience and a genuine passion
        for their craft — each one continuing their education so every
        appointment delivers your best look yet.
      </p>
    </div>

    {/* ── Individual Stylist Sections ── */}
    {TEAM.map((member, i) => (
      <StylistSection key={member.name} member={member} index={i} />
    ))}

    {/* ── Careers ── */}
    <section
      className="section careers-section"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="careers-layout">
        <div>
          <p className="about-eyebrow">Work with us</p>
          <h2 className="about-h2">We're Hiring</h2>
          <p className="careers-body">
            Barclay's Salon is always looking for talented, passionate
            professionals who value education, teamwork, and exceptional client
            experiences. If you want to grow your craft alongside industry
            experts in a supportive environment — we'd love to hear from you.
          </p>

          <div className="careers-roles">
            {[
              "Licensed stylists & colorists",
              "Balayage & color specialists",
              "Salon assistants & apprentices",
              "Estheticians & nail techs",
              "Receptionist & front desk",
            ].map((r) => (
              <div key={r} className="careers-role">
                <span className="careers-role-dot" />
                {r}
              </div>
            ))}
          </div>

          <div className="careers-cta-row">
            {/*
              Replace this href with your real Google Form link.
              Go to forms.google.com → create form → Share → Copy link
            */}
            <a
              className="btn-primary"
              href="https://forms.google.com"
              target="_blank"
              rel="noreferrer"
            >
              Apply Now ↗
            </a>
            <a href="tel:4253531244" className="btn-outline">
              Call 425-353-1244
            </a>
          </div>
          <p className="about-small" style={{ marginTop: "1.25rem" }}>
            We review all applications and reach out to candidates whose
            experience and passion align with our team.
          </p>
        </div>

        <div className="careers-perks-card">
          <p
            className="stylist-block-label"
            style={{ marginBottom: "1.375rem" }}
          >
            Why Barclay's
          </p>
          <ul className="careers-perks-list">
            {[
              "Redken & Pureology education access",
              "National shows & Redken Symposium",
              "Supportive, experienced team",
              "Established Everett clientele since 1977",
              "Flexible scheduling",
              "A salon that invests in your growth",
            ].map((p) => (
              <li key={p}>
                <span className="careers-check">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </main>
);

export default AboutPage;

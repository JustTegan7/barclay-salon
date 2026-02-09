import React from "react";

const AboutPage: React.FC = () => {
  return (
    <main className="about">
      <header className="about-hero">
        <div className="section about-hero-inner">
          <p className="about-eyebrow">About Barclay’s Salon</p>
          <h1 className="about-title">Everett family-owned since 1977</h1>
          <p className="about-subtitle">
            Craftsmanship, care, and connection—plus modern education to keep
            your look fresh and timeless.
          </p>

          <div className="about-hero-meta">
            <span className="about-pill">Family-owned</span>
            <span className="about-pill">Everett roots</span>
            <span className="about-pill">Continued education</span>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="about-grid">
          <div className="about-card">
            <h2 className="about-h2">Our Story</h2>
            <p>
              Barclay’s Salon has been proudly family-owned and operated in
              Everett since 1977. What began as a local salon has grown into a
              trusted community staple, serving generations of clients while
              staying true to the values it was founded on: craftsmanship, care,
              and connection.
            </p>
            <p>
              We believe great hair is personal. That belief has guided us for
              decades, shaping how we train, how we listen, and how we serve
              every guest who walks through our doors. While styles and
              techniques evolve, our commitment to quality and authenticity has
              never changed.
            </p>
            <p>
              Education is central to who we are. Our team regularly
              participates in continued training to stay current with modern
              trends, advanced techniques, and industry best practices—ensuring
              our clients receive results that feel both fresh and timeless.
            </p>
          </div>

          <aside className="about-callout">
            <h3 className="about-h3">What we’re known for</h3>
            <ul className="about-list">
              <li>Thoughtful consultation + real listening</li>
              <li>Precision cuts & custom color</li>
              <li>Professional products + hair integrity</li>
              <li>Warm, welcoming atmosphere</li>
            </ul>

            <div className="about-divider" />

            <p className="about-small">
              We’ve served Everett for decades—and we’re just getting started.
            </p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="about-card">
          <h2 className="about-h2">Mission &amp; Values</h2>

          <div className="mission-block about-mission">
            <h3 className="about-h3">Our Mission</h3>
            <p className="about-lead">
              Our mission is to help every client feel confident, cared for, and
              truly themselves. We do this by combining expert technique with
              genuine listening, thoughtful consultation, and an environment
              where everyone feels welcome.
            </p>
          </div>

          <h3 className="about-h3 about-values-title">Our Values</h3>
          <div className="about-values">
            <div className="about-value">
              <h4>Quality</h4>
              <p>
                We take pride in our work—from precision cuts to custom color—
                and use professional products and techniques that protect the
                integrity of your hair.
              </p>
            </div>

            <div className="about-value">
              <h4>Community</h4>
              <p>
                As a long-standing Everett business, we value relationships.
                Many of our clients have been with us for years, and we’re
                honored to be part of their lives and milestones.
              </p>
            </div>

            <div className="about-value">
              <h4>Confidence Through Style</h4>
              <p>
                Great hair has power. Our goal is not just to create a look you
                love, but to help you leave feeling confident, comfortable, and
                empowered.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="about-card">
          <h2 className="about-h2">Our Team</h2>
          <p>
            Behind every great service is a skilled professional who cares
            deeply about their craft.
          </p>
          <p>
            Our team of stylists brings together experience, creativity, and
            specialized expertise across cutting, coloring, and styling. Each
            stylist continues their education to stay current with trends while
            tailoring their work to fit each client’s lifestyle and personality.
          </p>

          <div className="about-team-note">
            <h3 className="about-h3">What you’ll find here:</h3>
            <ul className="about-list">
              <li>Stylist photos</li>
              <li>Name and specialty or focus area</li>
              <li>A short bio highlighting experience or passion</li>
              <li>
                Optional{" "}
                <span className="about-inline-chip">Book with [Name]</span>{" "}
                button for easy scheduling
              </li>
            </ul>
            <p className="about-small">
              We believe choosing a stylist should feel personal—and we’re proud
              of the talented team that makes Barclay’s Salon what it is.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="about-card about-careers">
          <h2 className="about-h2">Careers</h2>
          <h3 className="about-h3">Join Our Team</h3>
          <p>
            Barclay’s Salon is always interested in connecting with passionate,
            motivated professionals who value education, teamwork, and
            exceptional client experiences.
          </p>
          <p>
            We offer a supportive environment where stylists can grow their
            skills, build lasting client relationships, and be part of a salon
            that values professionalism and community.
          </p>

          <div className="about-careers-ctaRow">
            <a className="btn-outline" href="#apply">
              Apply Here
            </a>
            <p className="about-small" id="apply">
              (Links to application form or external hiring page)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

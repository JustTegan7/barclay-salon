import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      style={{ padding: "48px 16px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1
          id="hero-title"
          style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}
        >
          Tegan Rogers
        </h1>
        <p style={{ fontSize: "1.125rem", opacity: 0.9, marginTop: 8 }}>
          Full-Stack AI Developer in training — shipping clean, typed React +
          FastAPI with a path to Azure.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link
            to="/projects"
            aria-label="View Projects"
            style={{
              padding: "10px 14px",
              background: "#154D57",
              color: "#fff",
              borderRadius: 10,
              border: "2px solid #0f172a",
              fontWeight: 700,
            }}
          >
            View Projects
          </Link>
          <a
            href="mailto:justtegan7@gmail.com"
            aria-label="Contact Tegan by email"
            style={{
              padding: "10px 14px",
              background: "#fff",
              color: "#0f172a",
              borderRadius: 10,
              border: "2px solid #0f172a",
              fontWeight: 700,
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}

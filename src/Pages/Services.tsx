// src/Pages/Services.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { apiGet } from "../api/client";
import type { Service } from "../types";

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet<Service[]>("/services");
        if (!cancelled) setServices(data ?? []);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Could not load services. Check backend + VITE_API_URL.");
          setServices([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <main className="app-main">
      <section className="section">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h1 className="section-heading" style={{ margin: 0 }}>
            Services
          </h1>

          <Link className="btn-outline" to="/">
            ← Back Home
          </Link>
        </div>

        <p className="section-body" style={{ marginTop: "12px" }}>
          Full service menu. Pricing may vary by stylist and consultation needs.
        </p>

        {error && (
          <p className="modal-note" style={{ marginTop: "12px" }}>
            <strong>{error}</strong>
          </p>
        )}

        {loading ? (
          <p className="section-muted" style={{ marginTop: "12px" }}>
            Loading services…
          </p>
        ) : services.length === 0 ? (
          <p className="section-muted" style={{ marginTop: "12px" }}>
            No services available.
          </p>
        ) : (
          <div style={{ marginTop: "16px", display: "grid", gap: "22px" }}>
            {[...servicesByCategory.entries()].map(([category, items]) => (
              <div key={category}>
                <h2 className="section-heading" style={{ fontSize: "1.25rem" }}>
                  {category}
                </h2>

                <div className="placeholder-rail">
                  {items.map((s) => (
                    <div key={s.id} className="placeholder-card">
                      <div style={{ fontWeight: 800 }}>{s.name}</div>
                      <div
                        className="section-muted"
                        style={{ marginTop: "6px" }}
                      >
                        ${Math.round(s.base_price_cents / 100)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: "18px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link className="btn-primary" to="/#services">
            See preview section
          </Link>
          <Link className="btn-outline" to="/#shop">
            Shop Online
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;

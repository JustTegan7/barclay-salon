import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SERVICES_CATALOG } from "../data/servicesCatalog";

function formatPrice(cents: number, note?: string): string {
  if (note) {
    // Notes already carry the display string for irregular pricing
    // ("$93+ per hour", "Upon consultation", etc.) — prefer the
    // human-written phrasing when present.
    const match = note.match(/\$[\d,]+\+?(?:\s*per\s*\w+)?/i);
    if (match) return match[0];
    if (/consultation/i.test(note)) return "Custom";
  }
  if (!cents) return "Custom";
  return `$${Math.round(cents / 100)}+`;
}

const CATEGORY_ORDER = [
  "Designer Haircuts & Styles",
  "Color",
  "Texture",
  "Treatments",
  "Waxing",
  "Packages",
];

const CATEGORY_LABEL: Record<string, string> = {
  "Designer Haircuts & Styles": "Haircuts",
  Color: "Color",
  Texture: "Texture",
  Treatments: "Treatments",
  Waxing: "Waxing",
  Packages: "Packages",
};

export const PricingTabs: React.FC = () => {
  const [active, setActive] = useState(CATEGORY_ORDER[0]);

  const byCategory = useMemo(() => {
    const map: Record<string, typeof SERVICES_CATALOG> = {};
    for (const item of SERVICES_CATALOG) {
      if (!item.is_active) continue;
      (map[item.category] ||= []).push(item);
    }
    return map;
  }, []);

  return (
    <div>
      <div className="price-tabs" role="tablist" aria-label="Service categories">
        {CATEGORY_ORDER.filter((c) => byCategory[c]?.length).map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            className={`tab-btn${active === cat ? " active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {CATEGORY_LABEL[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="price-panels">
        {CATEGORY_ORDER.filter((c) => byCategory[c]?.length).map((cat) => (
          <div
            key={cat}
            className={`price-panel${active === cat ? " active" : ""}`}
            role="tabpanel"
          >
            <div className="price-table">
              {byCategory[cat].map((item) => (
                <div className="price-row" key={item.id}>
                  <span className="name">{item.name}</span>
                  <span className="amt">
                    {formatPrice(item.base_price_cents, item.note)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="price-note">
        "+" pricing reflects starting rates — your stylist will confirm exact
        cost at consultation. Pricing may vary by stylist &amp; hair length.
      </p>
      <div className="services-cta">
        <Link className="btn-outline" to="/services">
          View Full Menu →
        </Link>
      </div>
    </div>
  );
};

import React from "react";

type Props = {
  onQuickBook: () => void;
};

export const FinalCta: React.FC<Props> = ({ onQuickBook }) => {
  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="final-cta">
        <h2>Ready for your next great hair day?</h2>
        <p>
          Booking takes less than two minutes and you'll get a confirmation
          instantly.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="btn-light" onClick={onQuickBook}>
            Book Online Now →
          </button>
          <a
            className="btn-light"
            style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.5)" }}
            href="tel:4253531244"
          >
            Call 425-353-1244
          </a>
        </div>
      </div>
    </section>
  );
};

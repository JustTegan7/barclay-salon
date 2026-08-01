import React from "react";
import { Link } from "react-router-dom";

const OFFERS = [
  { service: "Balayage Service", amount: "$25 off" },
  { service: "Foil Service", amount: "$20 off" },
  { service: "Color Service", amount: "$10 off" },
  { service: "Haircut Service", amount: "$5 off" },
];

const SpecialsPage: React.FC = () => {
  return (
    <main className="app-main">
      <div className="services-modern">
        <div className="services-hero">
          <p className="about-eyebrow">A welcoming gift for you</p>
          <h1>New Guest Special</h1>
          <p>
            First time in our chair? Take your choice of service off your visit
            — pick whichever offer below fits what you're booking.
          </p>
        </div>

        <div className="services-block">
          <h2 className="services-block-title">Your Choice of Service</h2>
          <div className="services-grid">
            {OFFERS.map((offer) => (
              <div key={offer.service} className="service-modern-card">
                <span className="service-modern-name">{offer.service}</span>
                <span className="service-modern-price">{offer.amount}</span>
              </div>
            ))}
          </div>
          <p className="services-note" style={{ marginTop: "1rem" }}>
            One offer per new guest. Mention the special when you book.
          </p>
        </div>

        <div className="services-cta">
          <Link to="/contact" className="btn-outline">
            Ask a Question
          </Link>
          <Link to="/" className="btn-outline">
            ← Back Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SpecialsPage;

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "../assets/Barclays_logo.png";

type NavbarProps = {
  onQuickBook?: () => void;
};

const SHOP_URL = "https://shop.saloninteractive.com/store/BARCLAYSALON";

function SmartAboutLink() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <a
      href="#about"
      onClick={(e) => {
        e.preventDefault();

        // On home: scroll to the About section
        if (location.pathname === "/") {
          const el = document.getElementById("about");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          else window.location.hash = "#about";
          return;
        }

        // Elsewhere: go to the About page
        navigate("/about");
      }}
    >
      About
    </a>
  );
}

export const Navbar: React.FC<NavbarProps> = ({ onQuickBook }) => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" aria-label="Barclay’s Salon home">
          <img src={Logo} alt="Barclay’s Salon logo" className="navbar-logo" />
          <span className="navbar-brand-text">Barclay’s Salon</span>
        </Link>

        <span className="navbar-tagline">
          Everett • Since 1977 • Redken Club 5th Ave
        </span>
      </div>

      <div className="navbar-right">
        <nav className="navbar-links" aria-label="Primary">
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname !== "/") {
                navigate("/#services");
                return;
              }
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Services
          </a>

          <SmartAboutLink />

          <a
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname !== "/") {
                navigate("/#shop");
                return;
              }
              document
                .getElementById("shop")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Shop
          </a>

          <a href={SHOP_URL} target="_blank" rel="noreferrer">
            Shop Online
          </a>
        </nav>

        <button
          type="button"
          className="btn-primary navbar-cta"
          onClick={onQuickBook}
        >
          <span>✂</span>
          <span>Quick Book</span>
        </button>
      </div>
    </header>
  );
};

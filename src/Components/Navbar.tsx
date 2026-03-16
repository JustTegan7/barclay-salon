import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../assets/Barclays_logo.png";
import { useAuth } from "../context/useAuth";

type NavbarProps = {
  onQuickBook?: () => void;
};

const SHOP_URL = "https://shop.saloninteractive.com/store/BARCLAYSALON";

export const Navbar: React.FC<NavbarProps> = ({ onQuickBook }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" aria-label="Barclay's Salon home">
          <img src={Logo} alt="Barclay's Salon logo" className="navbar-logo" />
          <span className="navbar-brand-text">Barclay's Salon</span>
        </Link>
        <span className="navbar-tagline">
          Everett · Since 1977 · Redken Club 5th Ave
        </span>
      </div>

      <div className="navbar-right">
        <nav className="navbar-links" aria-label="Primary">
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href={SHOP_URL} target="_blank" rel="noreferrer">
            Shop ↗
          </a>

          {!user ? (
            <Link to="/login">Login</Link>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <button
          type="button"
          className="navbar-cta"
          onClick={onQuickBook}
        >
          <span>✂</span>
          <span>Book Now</span>
        </button>
      </div>
    </header>
  );
};

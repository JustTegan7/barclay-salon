import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Address + Map */}
        <div>
          <div className="footer-heading">Barclay's Salon</div>
          <div className="footer-subtle">
            320 112th Street Southwest
            <br />
            Everett, WA 98204
            <br />
            <a href="tel:4253531244" style={{ color: "inherit" }}>
              425-353-1244
            </a>
          </div>

          <div className="footer-map" aria-label="Map to Barclay's Salon">
            <iframe
              title="Barclay's Salon Location"
              src="https://www.google.com/maps?q=Barclay's+Salon+320+112th+Street+Southwest+Everett,+WA+98204&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Hours */}
        <div>
          <div className="footer-heading">Hours</div>
          <ul className="footer-hours-list footer-subtle">
            <li>
              <span>Sunday</span>
              <span>Closed</span>
            </li>
            <li>
              <span>Monday</span>
              <span>Closed</span>
            </li>
            <li>
              <span>Tue – Thu</span>
              <span>10am – 7pm</span>
            </li>
            <li>
              <span>Friday</span>
              <span>9am – 6pm</span>
            </li>
            <li>
              <span>Saturday</span>
              <span>9am – 5pm</span>
            </li>
          </ul>
          <div className="footer-pill">Walk-ins are always welcome</div>
        </div>

        {/* Social */}
        <div>
          <div className="footer-heading">Connect</div>
          <div className="footer-social footer-subtle">
            <a
              href="https://www.facebook.com/barclays.hair/"
              target="_blank"
              rel="noreferrer"
              aria-label="Barclay's Salon on Facebook"
            >
              Facebook ↗
            </a>
            <a
              href="https://www.instagram.com/barclayssalon/"
              target="_blank"
              rel="noreferrer"
              aria-label="Barclay's Salon on Instagram"
            >
              Instagram ↗
            </a>
            <a
              href="https://shop.saloninteractive.com/store/BARCLAYSALON"
              target="_blank"
              rel="noreferrer"
              aria-label="Barclay's Salon online shop"
              style={{ color: "var(--gold)", marginTop: "0.5rem" }}
            >
              Shop Online ↗
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Barclay's Salon. All rights reserved.</span>
        <span>Color, cut &amp; care specialists in Everett, WA.</span>
      </div>
    </footer>
  );
};

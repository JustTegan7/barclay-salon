import React from "react";

export const TopBar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-info">
          <span>📍 320 112th St SW, Everett, WA 98204</span>
          <span>🕐 Tue–Thu 10–7 · Fri 9–6 · Sat 9–5</span>
        </div>
        <div className="topbar-info">
          <span>
            <a href="tel:4253531244">📞 425-353-1244</a>
          </span>
          <span>
            <a
              href="https://www.instagram.com/barclayssalon/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </span>
          <span>
            <a
              href="https://www.facebook.com/barclays.hair/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

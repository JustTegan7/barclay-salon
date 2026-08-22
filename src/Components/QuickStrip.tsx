import React from "react";

const HOURS_TODAY: Record<number, string> = {
  0: "Closed today",
  1: "Closed today",
  2: "Open today 10am–7pm",
  3: "Open today 10am–7pm",
  4: "Open today 10am–7pm",
  5: "Open today 9am–6pm",
  6: "Open today 9am–5pm",
};

export const QuickStrip: React.FC = () => {
  const today = HOURS_TODAY[new Date().getDay()];

  return (
    <div className="quickstrip">
      <div className="quickstrip-inner">
        <div className="qs-item">
          <span className="qs-icon">📍</span>
          <div>
            <h4>Location</h4>
            <p>
              320 112th St SW
              <br />
              Everett, WA 98204
            </p>
          </div>
        </div>
        <div className="qs-item">
          <span className="qs-icon">🕐</span>
          <div>
            <h4>Hours Today</h4>
            <p>{today}</p>
          </div>
        </div>
        <div className="qs-item">
          <span className="qs-icon">📞</span>
          <div>
            <h4>Call or Text</h4>
            <p>
              <a href="tel:4253531244">425-353-1244</a>
            </p>
          </div>
        </div>
        <div className="qs-item">
          <span className="qs-icon">🚶</span>
          <div>
            <h4>Walk-ins</h4>
            <p>
              Always welcome — <a href="#faq">see FAQ</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

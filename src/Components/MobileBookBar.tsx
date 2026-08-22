import React from "react";

type Props = {
  onQuickBook: () => void;
};

export const MobileBookBar: React.FC<Props> = ({ onQuickBook }) => {
  return (
    <div className="mobile-book">
      <button type="button" className="btn-hero-primary" onClick={onQuickBook}>
        Book Now
      </button>
      <a className="btn-outline" href="tel:4253531244">
        Call
      </a>
    </div>
  );
};

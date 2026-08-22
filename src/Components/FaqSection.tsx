import React, { useState } from "react";

type FaqItem = {
  q: string;
  a: React.ReactNode;
};

const FAQS: FaqItem[] = [
  {
    q: "Do I need an appointment, or can I walk in?",
    a: (
      <>
        Walk-ins are always welcome, but booking online guarantees your
        preferred stylist and time — especially on Fridays and Saturdays,
        our busiest days.
      </>
    ),
  },
  {
    q: "What's your cancellation policy?",
    a: (
      <>
        We require a card to reserve your appointment time. If you need to
        cancel or reschedule, please give us at least 48 hours' notice so we
        can rebook the slot. After a second missed appointment, a deposit
        will be required for future bookings.
      </>
    ),
  },
  {
    q: "I'm a new client — where do I start?",
    a: (
      <>
        Not sure which service to book? Call us at{" "}
        <a href="tel:4253531244">425-353-1244</a> or send a message from our{" "}
        Contact page — we'll help map out the right plan for your hair goals
        before anything is charged.
      </>
    ),
  },
  {
    q: "Is there parking near the salon?",
    a: (
      <>
        Parking is available right at the salon. If you have any trouble
        finding a spot, give us a call at{" "}
        <a href="tel:4253531244">425-353-1244</a> and we'll help you out.
      </>
    ),
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="section"
      id="faq"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <p className="about-eyebrow">Good to know</p>
        <h2 className="section-heading">Frequently asked questions.</h2>
      </div>

      <div className="faq-list" style={{ marginTop: "2rem" }}>
        {FAQS.map((item, i) => (
          <div className={`faq-item${openIndex === i ? " open" : ""}`} key={item.q}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>{item.q}</span>
              <span className="plus">+</span>
            </button>
            <div className="faq-a">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

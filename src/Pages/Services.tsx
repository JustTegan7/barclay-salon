import React from "react";
import { Link } from "react-router-dom";

type ServiceItem = {
  name: string;
  price: string;
};

type Category = {
  title: string;
  note?: string;
  services: ServiceItem[];
};

const SERVICE_DATA: Category[] = [
  {
    title: "Designer Haircuts & Styles",
    note: "Book cuts for current length of hair.",
    services: [
      { name: "Haircut – Buzz Cut", price: "$32+" },
      { name: "Haircut – Children / 12", price: "$38+" },
      { name: "Haircut – Clippers (with some scissor work)", price: "$55+" },
      { name: "Shampoo / Blowout", price: "$42+" },
      { name: "Haircut – Short", price: "$61+" },
      { name: "Haircut – Medium", price: "$74+" },
      { name: "Haircut – Long", price: "$79+" },
      { name: "Haircut – Extra Long", price: "$84+" },
    ],
  },
  {
    title: "Color",
    note: "If booking a stand-alone chemical service, there will be an extra blow-dry charge added.",
    services: [
      { name: "Full Foil Custom Blonding Service", price: "$148+" },
      { name: "Partial Foil Custom Blonding Service", price: "$127+" },
      { name: "Full Balayage Custom Blonding Service", price: "$161+" },
      { name: "Partial Balayage Custom Blonding Service", price: "$145+" },
      { name: "Full Mesh Cap Custom Blonding Service", price: "$108+" },
      { name: "Partial Mesh Cap Custom Blonding Service", price: "$93+" },
      { name: "Custom Color", price: "$101+" },
      { name: "Men's Camo Color", price: "$60+" },
      { name: "Bleach Retouch", price: "$107+ per hour" },
      { name: "Color Correction", price: "$107+ per hour" },
      { name: "Glaze", price: "$50+" },
      { name: "Brow Color", price: "$23+" },
      { name: "Fashion Color", price: "$101+" },
    ],
  },
  {
    title: "Texture",
    note: "Haircuts are not included.",
    services: [
      { name: "Full Perm", price: "$106+" },
      { name: "Partial Perm", price: "$87+" },
      { name: "Spiral Perm", price: "$145+" },
      { name: "Straightening", price: "$69+ per hour" },
      { name: "Hair Extensions", price: "Upon consultation" },
      { name: "Brazilian Blowout", price: "$310+" },
    ],
  },
  {
    title: "Treatments",
    services: [
      { name: "ABC Bonding Deep Treatment", price: "$30+" },
      { name: "Cat Treatment", price: "$20+" },
    ],
  },
  {
    title: "Waxing",
    services: [
      { name: "Chin Wax", price: "$18+" },
      { name: "Brow Wax", price: "$23+" },
      { name: "Nose Wax", price: "$18+" },
      { name: "Lip Wax", price: "$18+" },
      { name: "Ear Wax", price: "$18+" },
    ],
  },
  {
    title: "Packages",
    note: "Starting at listed price.",
    services: [
      { name: "Custom Color & Glaze Package", price: "$151+" },
      { name: "Full Foil Custom Package", price: "$299+" },
      { name: "Partial Foil Custom Package", price: "$278+" },
      { name: "Full Balayage Custom Package", price: "$312+" },
      { name: "Partial Balayage Custom Package", price: "$296+" },
      { name: "Full Mesh Cap Custom Package", price: "$259+" },
      { name: "Special Shine Bomb Blowout", price: "$101+" },
    ],
  },
];

const ServicesPage: React.FC = () => {
  return (
    <main className="app-main">
      <div className="services-modern">
        <div className="services-hero">
          <p className="about-eyebrow">Full menu</p>
          <h1>Our Services</h1>
          <p>
            Professional hair design, color, texture, and beauty services in
            Everett since 1977.
          </p>
        </div>

        {SERVICE_DATA.map((category) => (
          <div key={category.title} className="services-block">
            <h2 className="services-block-title">{category.title}</h2>
            {category.note && (
              <p className="services-note">{category.note}</p>
            )}
            <div className="services-grid">
              {category.services.map((service) => (
                <div key={service.name} className="service-modern-card">
                  <span className="service-modern-name">{service.name}</span>
                  <span className="service-modern-price">{service.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="services-cta">
          <Link to="/contact" className="btn-outline">
            Contact Us
          </Link>
          <Link to="/" className="btn-outline">
            ← Back Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ServicesPage;

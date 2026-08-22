import React from "react";

import RyanPhoto from "../assets/empPhotos/Ryan-Photo.jpg";
import MaryMichaelPhoto from "../assets/empPhotos/Mary-Michael-Photo.jpg";
import VinzPhoto from "../assets/empPhotos/Vinz-Photo.jpg";
import SherylPhoto from "../assets/empPhotos/Sheryl-Photo.jpg";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: string;
  action: { label: string } & (
    | { kind: "book" }
    | { kind: "call"; href: string }
  );
};

const TEAM: TeamMember[] = [
  {
    name: "Ryan",
    role: "Design & Color Specialist",
    bio: "Second-generation stylist at Barclay's, specializing in dimensional color and precision design cuts.",
    photo: RyanPhoto,
    action: { kind: "book", label: "Book with Ryan →" },
  },
  {
    name: "Mary-Michael",
    role: "Design & Color Specialist",
    bio: "Known for seamless balayage and natural-looking blonding that grows out beautifully.",
    photo: MaryMichaelPhoto,
    action: { kind: "book", label: "Book with Mary-Michael →" },
  },
  {
    name: 'Vincent "Vinz" Pineda',
    role: "Design & Color Specialist",
    bio: "Brings a modern eye to men's and women's cuts alike, with a focus on low-maintenance color.",
    photo: VinzPhoto,
    action: { kind: "book", label: "Book with Vinz →" },
  },
  {
    name: "Sheryl",
    role: "Receptionist & Salon Coordinator",
    bio: "The friendly voice on the phone — Sheryl helps match you with the right stylist for your goals.",
    photo: SherylPhoto,
    action: { kind: "call", href: "tel:4253531244", label: "Call Sheryl →" },
  },
];

type Props = {
  onQuickBook: () => void;
};

export const TeamSection: React.FC<Props> = ({ onQuickBook }) => {
  return (
    <section
      className="section"
      id="team"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <p className="about-eyebrow" style={{ marginBottom: "0.875rem" }}>
        Who's touching your hair
      </p>
      <h2 className="section-heading">
        Meet the team behind the transformations.
      </h2>
      <p className="section-body">
        Every stylist at Barclay's trains continuously on Redken's newest
        color &amp; cutting techniques.
      </p>

      <div className="team-grid" style={{ marginTop: "2rem" }}>
        {TEAM.map((member) => (
          <article className="team-card" key={member.name}>
            <div className="team-photo">
              <img
                src={member.photo}
                alt={`${member.name}, ${member.role} at Barclay's Salon`}
                loading="lazy"
              />
            </div>
            <div className="team-info">
              <h3>{member.name}</h3>
              <span className="team-role">{member.role}</span>
              <p className="team-bio">{member.bio}</p>
              {member.action.kind === "book" ? (
                <button
                  type="button"
                  className="team-book-link"
                  onClick={onQuickBook}
                >
                  {member.action.label}
                </button>
              ) : (
                <a className="team-book-link" href={member.action.href}>
                  {member.action.label}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

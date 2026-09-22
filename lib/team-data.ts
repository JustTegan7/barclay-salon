import { siteConfig } from "./site-config";

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  bookHref: string;
  bookLabel: string;
};

export const teamMembers: TeamMember[] = [
  {
    slug: "ryan",
    name: "Ryan",
    role: "Design & Color Specialist",
    bio: "Second-generation stylist at Barclay's, specializing in dimensional color and precision design cuts.",
    photo:
      "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2023/06/Ryan-Barclays.jpg",
    bookHref: siteConfig.bookingUrl,
    bookLabel: "Book with Ryan",
  },
  {
    slug: "mary-michael",
    name: "Mary-Michael",
    role: "Design & Color Specialist",
    bio: "Known for seamless balayage and natural-looking blonding that grows out beautifully.",
    photo:
      "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2018/01/Mary-Michael-LEe.jpg",
    bookHref: siteConfig.bookingUrl,
    bookLabel: "Book with Mary-Michael",
  },
  {
    slug: "vinz-pineda",
    name: 'Vincent "Vinz" Pineda',
    role: "Design & Color Specialist",
    bio: "Brings a modern eye to men's and women's cuts alike, with a focus on low-maintenance color.",
    photo:
      "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2025/08/Vinz-Barclays-salon.jpg",
    bookHref: siteConfig.bookingUrl,
    bookLabel: "Book with Vinz",
  },
  {
    slug: "sheryl",
    name: "Sheryl",
    role: "Receptionist & Salon Coordinator",
    bio: "The friendly voice on the phone — Sheryl helps match you with the right stylist for your goals.",
    photo:
      "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2021/12/Sheryl-picture-2021-1.jpg",
    // Sheryl takes calls, not bookings — keep this on the phone line, not siteConfig.bookingUrl.
    bookHref: siteConfig.phoneHref,
    bookLabel: "Call Sheryl",
  },
];

// Central place for Barclay's Salon's real business info.
// Every component/page should read from here rather than hardcoding values,
// so a change (new phone number, new booking link, etc.) only has to happen once.

export const siteConfig = {
  name: "Barclay's Salon",
  legalName: "Barclay's Salon",
  shortName: "Barclay's",
  tagline: "Everett's Trusted Salon Since 1977",
  founded: 1977,
  description:
    "Barclay's Salon has served Everett, WA since 1977. Expert color, balayage, cuts & styling. Book online in seconds, walk-ins always welcome.",

  url: "https://www.barclaysalon.com",

  logo: "https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2017/06/Barclays_logo.png",
  ogImage: "/og-image.png",

  phone: "425-353-1244",
  phoneHref: "tel:+14253531244",

  address: {
    street: "320 112th St SW",
    city: "Everett",
    state: "WA",
    stateFull: "Washington",
    zip: "98204",
    country: "US",
    // Used for embeds / directions links.
    lat: 47.896238,
    lng: -122.240758,
  },

  hours: [
    { days: "Tuesday", open: "10:00", close: "19:00", label: "10am – 7pm" },
    { days: "Wednesday", open: "10:00", close: "19:00", label: "10am – 7pm" },
    { days: "Thursday", open: "10:00", close: "19:00", label: "10am – 7pm" },
    { days: "Friday", open: "09:00", close: "18:00", label: "9am – 6pm" },
    { days: "Saturday", open: "09:00", close: "17:00", label: "9am – 5pm" },
    { days: "Sunday", open: null, close: null, label: "Closed" },
    { days: "Monday", open: null, close: null, label: "Closed" },
  ],

  // Grouped for the compact hours table used across the site.
  hoursGrouped: [
    { days: "Tuesday – Thursday", label: "10am – 7pm" },
    { days: "Friday", label: "9am – 6pm" },
    { days: "Saturday", label: "9am – 5pm" },
    { days: "Sunday – Monday", label: "Closed" },
  ],

  social: {
    instagram: "https://www.instagram.com/barclayssalon",
    facebook: "https://www.facebook.com/barclays.hair/",
  },

  // TODO (open decision, per launch checklist): booking is still on the salon's
  // old Envision/SalonVision system. Swap this single value if/when the salon
  // owner moves to a new booking platform — every CTA on the site reads from here.
  bookingUrl: "https://www.barclayshairdesign.com/book-online/",
  fullServiceMenuUrl: "https://www.barclayshairdesign.com/all-services/",
  giftCertificateUrl:
    "https://www.salonvision.com/barclayssalonllc/GiftCertificatePop.aspx",
  reviewsUrl: "https://reviews.envisiongo.com/barclays-salon/",

  rating: {
    value: 4.2,
    count: 273,
    countLabel: "273+",
    platforms: ["Google", "Birdeye", "Yelp"],
  },

  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.074776465985!2d-122.24075768435938!3d47.896237979204955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549006b77dc117df%3A0x687823854b48ce0d!2sBarclay's+Hair+Design!5e0!3m2!1sen!2sus!4v1497377935260",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Barclay's+Hair+Design,320+112th+St+SW,Everett,WA+98204",

  // Set this once a GA4 property exists for the site (see launch checklist).
  gaMeasurementId: "",
} as const;

export type SiteConfig = typeof siteConfig;

export const navLinks = [
  { href: "/services", label: "Services & Pricing" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Our Stylists" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit Us" },
] as const;

export const footerLinks = {
  explore: [
    { href: "/services", label: "Services & Pricing" },
    { href: "/gallery", label: "Gallery" },
    { href: "/team", label: "Our Stylists" },
    { href: "/about", label: "About" },
    { href: "/reviews", label: "Reviews" },
  ],
  book: [
    { href: siteConfig.bookingUrl, label: "Book Online", external: true },
    {
      href: siteConfig.giftCertificateUrl,
      label: "Gift Certificates",
      external: true,
    },
    { href: siteConfig.phoneHref, label: "Call the Salon", external: false },
  ],
  visit: [
    { href: siteConfig.directionsUrl, label: "320 112th St SW, Everett, WA", external: true },
    { href: "/faq", label: "FAQ", external: false },
    { href: "/contact", label: "Contact", external: false },
  ],
} as const;

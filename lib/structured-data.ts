import { siteConfig } from "./site-config";
import { faqItems } from "./faq-data";
import { teamMembers } from "./team-data";
import { serviceCategories } from "./services-data";

const dayMap: Record<string, string> = {
  Sunday: "Sunday",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
};

function openingHoursSpecification() {
  return siteConfig.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[h.days],
      opens: h.open,
      closes: h.close,
    }));
}

/** Core business schema for the whole site — render once, in the root layout. */
export function hairSalonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    image: teamMembers[0]?.photo,
    logo: siteConfig.logo,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.address.lat,
      longitude: siteConfig.address.lng,
    },
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.rating.value,
      reviewCount: siteConfig.rating.count,
    },
    hasOfferCatalog: offerCatalogSchema(),
  };
}

/** OfferCatalog built from the real service menu, nested under HairSalon. */
export function offerCatalogSchema() {
  return {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: serviceCategories.map((cat) => ({
      "@type": "OfferCatalog",
      name: cat.label,
      itemListElement: cat.items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.desc,
        },
      })),
    })),
  };
}

/** Generated straight from lib/faq-data.ts so schema and visible text can't drift apart. */
export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** One Person entity per stylist, for the /team page. */
export function teamSchema() {
  return teamMembers.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    image: member.photo,
    worksFor: {
      "@type": "HairSalon",
      name: siteConfig.name,
    },
  }));
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

/** Serializes a JSON-LD object safely for a <script> tag (scrubs `<`). */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

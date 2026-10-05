import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { FaqAccordion } from "@/components/FaqAccordion";
import { faqItems } from "@/lib/faq-data";
import { jsonLdString, breadcrumbSchema, faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about booking, cancellations, walk-ins, and parking at Barclay's Salon in Everett, WA.",
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqPageSchema()) }}
      />
      <PageHero
        eyebrow="Good To Know"
        title="Frequently asked questions."
        crumbs={crumbs}
      />
      <Section>
        <FaqAccordion items={faqItems} />
      </Section>
    </>
  );
}

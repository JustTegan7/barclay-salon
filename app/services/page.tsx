import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { PriceTabs } from "@/components/PriceTabs";
import { ButtonLink } from "@/components/Button";
import { siteConfig } from "@/lib/site-config";
import { jsonLdString, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Full service menu and real pricing for haircuts, color, balayage, texture treatments, waxing, and packages at Barclay's Salon in Everett, WA.",
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services & Pricing", path: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      <PageHero
        eyebrow="Service Menu"
        title="Real pricing, no PDF required."
        description="Every price below is pulled straight from Barclay's current menu. Final pricing may vary by stylist & hair length — ask at booking."
        crumbs={crumbs}
      />
      <Section>
        <PriceTabs />
        <p className="mt-5.5 text-center text-[0.85rem] text-charcoal-soft">
          &quot;+&quot; pricing reflects starting rates; your stylist will
          confirm exact cost during consultation.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href={siteConfig.bookingUrl} trackAs="services_page_book">
            Book This Service
          </ButtonLink>
          <ButtonLink href={siteConfig.fullServiceMenuUrl} variant="ghost">
            View Original Menu
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

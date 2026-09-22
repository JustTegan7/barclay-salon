import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHead } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { siteConfig } from "@/lib/site-config";
import { jsonLdString, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Barclay's Salon has served Everett, WA and Snohomish County since 1977 — a family-owned, proud Redken salon.",
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export default function AboutPage() {
  const years = new Date().getFullYear() - siteConfig.founded;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      <PageHero
        eyebrow="Our Story"
        title={`${years}+ years in Everett, one guest at a time.`}
        description={`Family-owned since ${siteConfig.founded}, Barclay's Salon has grown alongside Snohomish County without losing the personal touch that started it.`}
        crumbs={crumbs}
      />

      <Section>
        <div className="mx-auto max-w-[70ch]">
          <SectionHead eyebrow="Since 1977" title="A neighborhood salon, still" align="left" />
          <p className="mb-4 text-charcoal-soft">
            Barclay&apos;s Salon has been part of the Everett community since{" "}
            {siteConfig.founded}, offering expert color, balayage, cuts, and
            styling to Snohomish County. As a proud Redken salon, every guest
            gets professional-grade products and stylists who train
            continuously on Redken&apos;s newest color and cutting techniques.
          </p>
          <p className="mb-4 text-charcoal-soft">
            What&apos;s kept clients coming back for almost five decades
            isn&apos;t just the technique &mdash; it&apos;s the same
            family-run feel the salon opened with in {siteConfig.founded}.
            Walk in on any given day and you&apos;ll find a team that treats
            every guest like a regular, whether it&apos;s their first visit
            or their fiftieth.
          </p>
        </div>
      </Section>

      <Section alt>
        <SectionHead eyebrow="Meet The Team" title="Who you'll actually see in the chair." />
        <div className="text-center">
          <ButtonLink href="/team" variant="ghost">
            Meet the stylists
          </ButtonLink>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="font-display text-[1.6rem]">Come see us</h2>
          <p className="mt-2 text-charcoal-soft">
            {siteConfig.address.street}, {siteConfig.address.city},{" "}
            {siteConfig.address.state} {siteConfig.address.zip} — walk-ins
            always welcome. See{" "}
            <Link href="/contact" className="text-terracotta-dark">
              hours &amp; directions
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <ButtonLink href={siteConfig.bookingUrl} trackAs="about_book">
              Book Online
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}

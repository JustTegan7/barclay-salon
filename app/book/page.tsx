import type { Metadata } from "next";
import { JuniperBooking } from "@/components/JuniperBooking";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site-config";
import { jsonLdString, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Book Online",
  description:
    "Book your appointment at Barclay's Salon in Everett, WA. Pick your service and stylist and see open times online.",
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Book Online", path: "/book" },
];

export default function BookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      <PageHero
        eyebrow="Book Online"
        title="Reserve your appointment."
        description="Choose your service and stylist, then pick a time that works for you."
        crumbs={crumbs}
      />

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-[14px] border border-line bg-white shadow-soft">
            <JuniperBooking slug="barclay-salon" />
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[14px] border border-line bg-white p-7 shadow-soft">
              <h3 className="mb-3 text-[1.2rem]">Booking policy</h3>
              <ul className="space-y-3 text-[0.92rem] leading-relaxed text-charcoal-soft">
                <li>A valid credit card (Visa, Mastercard, Discover, or American Express) holds every appointment.</li>
                <li>Please give at least 48 hours&apos; notice to cancel or reschedule. Cancellations inside 48 hours may be charged up to 50% of the service.</li>
                <li>No-shows are charged the full cost of the appointment.</li>
              </ul>
            </div>

            <div className="rounded-[14px] border border-line bg-white p-7 shadow-soft">
              <h3 className="mb-3 text-[1.2rem]">Rather call?</h3>
              <p className="mb-4 text-[0.92rem] leading-relaxed text-charcoal-soft">
                Our front desk can match you with the right stylist for your goals.
              </p>
              <a
                href={siteConfig.phoneHref}
                className="text-[1.05rem] font-semibold text-terracotta-dark hover:underline"
              >
                {siteConfig.phone}
              </a>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

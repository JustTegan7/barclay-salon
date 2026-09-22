import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { MapEmbed } from "@/components/MapEmbed";
import { ContactForm } from "@/components/ContactForm";
import { ButtonLink } from "@/components/Button";
import { siteConfig } from "@/lib/site-config";
import { jsonLdString, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact & Hours",
  description:
    "Visit Barclay's Salon at 320 112th St SW, Everett, WA. Hours, directions, phone, and online booking.",
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      <PageHero
        eyebrow="Get In Touch"
        title="We'd love to see you."
        description="Book online, call, or stop by — walk-ins are always welcome."
        crumbs={crumbs}
      />

      <Section>
        <div className="grid grid-cols-1 gap-11 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="rounded-[14px] border border-line bg-white p-8 shadow-soft">
              <h3 className="text-[1.4rem]">{siteConfig.name}</h3>

              <InfoRow icon="📍">
                <strong className="block">{siteConfig.address.street}</strong>
                {siteConfig.address.city}, {siteConfig.address.state}{" "}
                {siteConfig.address.zip}
                <br />
                <ButtonLink
                  href={siteConfig.directionsUrl}
                  variant="ghost"
                  size="sm"
                  className="mt-2.5"
                >
                  Get Directions →
                </ButtonLink>
              </InfoRow>

              <InfoRow icon="📞">
                <strong className="block">{siteConfig.phone}</strong>
                <a href={siteConfig.phoneHref} className="text-terracotta-dark">
                  Tap to call
                </a>
              </InfoRow>

              <InfoRow icon="🕐">
                <strong className="block">Hours</strong>
                <table className="mt-1.5 w-full">
                  <tbody>
                    {siteConfig.hoursGrouped.map((row) => (
                      <tr key={row.days}>
                        <td className="py-1 text-[0.92rem]">{row.days}</td>
                        <td className="py-1 text-right text-[0.92rem] font-semibold">
                          {row.label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </InfoRow>

              <InfoRow icon="🎁" last>
                <strong className="block">Gift Certificates</strong>
                <a
                  href={siteConfig.giftCertificateUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-terracotta-dark"
                >
                  Buy a gift certificate →
                </a>
              </InfoRow>
            </div>

            <div className="flex flex-wrap gap-4">
              <ButtonLink href={siteConfig.bookingUrl} trackAs="contact_page_book">
                Book Online →
              </ButtonLink>
              <ButtonLink href={siteConfig.phoneHref} variant="ghost" target="_self">
                Call {siteConfig.phone}
              </ButtonLink>
            </div>
          </div>

          <MapEmbed className="min-h-[300px] lg:min-h-full" />
        </div>
      </Section>

      <Section alt>
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="mb-2 font-display text-[1.6rem]">Or send us a message</h2>
          <p className="mb-7 text-charcoal-soft">
            We&apos;ll get back to you as soon as we can.
          </p>
        </div>
        <div className="mx-auto max-w-[640px]">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}

function InfoRow({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="mt-4.5 flex items-start gap-3.5">
      <span className="mt-0.5 text-[1.2rem]">{icon}</span>
      <div className="w-full">{children}</div>
    </div>
  );
}

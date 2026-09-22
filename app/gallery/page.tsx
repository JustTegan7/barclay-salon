import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Gallery } from "@/components/Gallery";
import { ButtonLink } from "@/components/Button";
import { siteConfig } from "@/lib/site-config";
import { jsonLdString, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Real before & after client results from Barclay's Salon in Everett, WA — balayage, foils, color correction, fashion color, and more.",
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery" },
];

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      <PageHero
        eyebrow="Real Client Results"
        title="Before & after, filter by result."
        description="Every photo below is a real client result from Barclay's, not a stock photo."
        crumbs={crumbs}
      />
      <Section>
        <Gallery />
        <div className="mt-9 text-center">
          <ButtonLink href={siteConfig.social.instagram} variant="ghost">
            See more on Instagram
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

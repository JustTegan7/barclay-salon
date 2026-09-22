import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { StatRow } from "@/components/StatRow";
import { ReviewCard } from "@/components/ReviewCard";
import { ButtonLink } from "@/components/Button";
import { reviews } from "@/lib/reviews-data";
import { siteConfig } from "@/lib/site-config";
import { jsonLdString, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Reviews",
  description: `${siteConfig.rating.value}-star rated, ${siteConfig.rating.countLabel} reviews across ${siteConfig.rating.platforms.join(", ")}. See what clients say about Barclay's Salon.`,
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Reviews", path: "/reviews" },
];

export default function ReviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema(crumbs)) }}
      />
      <PageHero
        eyebrow="Client Love"
        title="Don't just take our word for it."
        crumbs={crumbs}
      />
      <Section>
        <StatRow />
        <div className="grid grid-cols-1 gap-6.5 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.who} review={review} />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[60ch] text-center text-[0.85rem] text-charcoal-soft">
          The quotes above are sample placeholders. Before launch, swap them
          for real reviews (checked against the original posts) from{" "}
          {siteConfig.rating.platforms.join(", ")}.
        </p>
        <div className="mt-8 text-center">
          <ButtonLink href={siteConfig.reviewsUrl} variant="ghost">
            Read all reviews
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

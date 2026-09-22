import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { faqItems } from "@/lib/faq-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.name}.`,
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
];

const cancellationPolicy =
  faqItems.find((f) => f.question.includes("cancellation"))?.answer ??
  "We ask for at least 48 hours' notice to cancel or reschedule.";

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" crumbs={crumbs} />
      <Section>
        <div className="mx-auto max-w-[70ch] space-y-5 text-charcoal-soft">
          {/*
            Dev note (not rendered): this is starter boilerplate, not a
            document an attorney has reviewed. Have one review and finalize
            this page before treating it as final.
          */}
          <h2 className="font-display text-[1.3rem] text-charcoal">
            Appointments &amp; cancellations
          </h2>
          <p>{cancellationPolicy}</p>
          <h2 className="font-display text-[1.3rem] text-charcoal">
            Pricing
          </h2>
          <p>
            Prices listed on this site are starting rates and may vary by
            stylist and hair length. Your stylist will confirm exact pricing
            during your consultation.
          </p>
          <h2 className="font-display text-[1.3rem] text-charcoal">
            Use of this site
          </h2>
          <p>
            This website is provided for informational purposes. By using
            it, you agree not to misuse the site or attempt to disrupt its
            normal operation.
          </p>
          <h2 className="font-display text-[1.3rem] text-charcoal">
            Contact
          </h2>
          <p>
            Questions about these terms can be directed to us at{" "}
            <a href={siteConfig.phoneHref} className="text-terracotta-dark">
              {siteConfig.phone}
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}

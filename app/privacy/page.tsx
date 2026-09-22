import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" crumbs={crumbs} />
      <Section>
        <div className="mx-auto max-w-[70ch] space-y-5 text-charcoal-soft">
          {/*
            Dev note (not rendered): this is starter boilerplate, not a
            document an attorney has reviewed. Have one review and finalize
            this page — and confirm whether a cookie/analytics disclosure is
            needed — once GA4 is wired up, before treating this as final.
          */}
          <p>
            {siteConfig.name} (&quot;we&quot;, &quot;us&quot;) respects your
            privacy. This page describes what information we collect through{" "}
            {siteConfig.url.replace("https://", "")} and how we use it.
          </p>
          <h2 className="font-display text-[1.3rem] text-charcoal">
            Information we collect
          </h2>
          <p>
            When you use our contact form or book an appointment, we collect
            the information you provide, such as your name, email, phone
            number, and any details you share about the service you&apos;re
            interested in. Booking is handled by our third-party booking
            provider, which has its own privacy practices.
          </p>
          <h2 className="font-display text-[1.3rem] text-charcoal">
            How we use it
          </h2>
          <p>
            We use the information you provide to respond to inquiries,
            schedule appointments, and communicate with you about your visit.
            We do not sell your personal information.
          </p>
          <h2 className="font-display text-[1.3rem] text-charcoal">
            Contact us
          </h2>
          <p>
            Questions about this policy can be directed to us at{" "}
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

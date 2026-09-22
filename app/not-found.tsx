import { Section } from "@/components/Section";
import { ButtonLink } from "@/components/Button";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  return (
    <Section className="text-center">
      <span className="mb-2.5 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-terracotta-dark">
        404
      </span>
      <h1 className="font-display text-[clamp(2rem,4vw,3rem)]">
        This page grew out.
      </h1>
      <p className="mx-auto mt-3.5 max-w-[50ch] text-charcoal-soft">
        We couldn&apos;t find the page you were looking for. Let&apos;s get
        you back to a fresh start.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/">Back to Home</ButtonLink>
        <ButtonLink href={siteConfig.bookingUrl} variant="ghost">
          Book an Appointment
        </ButtonLink>
      </div>
    </Section>
  );
}

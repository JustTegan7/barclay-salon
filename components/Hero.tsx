import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-14 pb-22"
      style={{
        backgroundImage:
          "radial-gradient(circle at 85% 20%, rgba(199,154,92,.18), transparent 45%), radial-gradient(circle at 10% 90%, rgba(185,112,74,.14), transparent 40%)",
        backgroundColor: "var(--color-ivory)",
      }}
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <span className="mb-2.5 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-terracotta-dark">
            {siteConfig.tagline}
          </span>
          <h1 className="font-display text-[clamp(2.3rem,4.2vw,3.5rem)] leading-[1.08] font-medium tracking-[-0.01em]">
            Hair that looks <em className="text-terracotta">this good</em>{" "}
            doesn&apos;t happen by accident.
          </h1>
          <p className="mt-3.5 max-w-[46ch] text-[1.08rem] text-charcoal-soft">
            Expert color, balayage &amp; precision cuts from a family-owned
            Everett salon serving Snohomish County for over{" "}
            {new Date().getFullYear() - siteConfig.founded} years. As a proud
            Redken salon, we use professional-grade products on every guest.
          </p>
          <div className="mt-6.5 flex flex-wrap gap-4">
            <ButtonLink href={siteConfig.bookingUrl} trackAs="hero_book_now">
              Book Your Appointment →
            </ButtonLink>
            <ButtonLink href={siteConfig.phoneHref} variant="ghost" target="_self">
              Call {siteConfig.phone}
            </ButtonLink>
          </div>
          <div className="mt-9 flex flex-wrap gap-7">
            <TrustItem>
              {siteConfig.rating.value}★ &middot; {siteConfig.rating.countLabel}{" "}
              reviews
            </TrustItem>
            <TrustItem>Proud Redken Salon</TrustItem>
            <TrustItem>Walk-ins always welcome</TrustItem>
          </div>
        </Reveal>

        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[22px] shadow-soft">
          <Image
            src="https://6039-barclays.wpnet.stylenet.com/wp-content/uploads/sites/266/2026/05/balayage-barclays-819x1024.png"
            alt="Balayage color transformation by Barclay's Salon, Everett WA"
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4.5 left-4.5 flex items-center gap-3 rounded-2xl bg-ivory/94 px-4.5 py-3.5 shadow-soft backdrop-blur-sm">
            <span className="text-[0.9rem] tracking-[2px] text-gold">★★★★★</span>
            <div>
              <strong className="block font-display text-[1.15rem]">
                {siteConfig.rating.value} / 5
              </strong>
              <small className="block text-charcoal-soft">
                {siteConfig.rating.countLabel} verified reviews
              </small>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[0.85rem] font-semibold text-charcoal-soft">
      <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
      {children}
    </span>
  );
}

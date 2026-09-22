import { Hero } from "@/components/Hero";
import { QuickInfoStrip } from "@/components/QuickInfoStrip";
import { Section, SectionHead } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { PriceTabs } from "@/components/PriceTabs";
import { GalleryMarquee } from "@/components/GalleryMarquee";
import { TeamCard } from "@/components/TeamCard";
import { StatRow } from "@/components/StatRow";
import { ReviewCard } from "@/components/ReviewCard";
import { FaqAccordion } from "@/components/FaqAccordion";
import { MapEmbed } from "@/components/MapEmbed";
import { ButtonLink } from "@/components/Button";
import { siteConfig } from "@/lib/site-config";
import { teamMembers } from "@/lib/team-data";
import { reviews } from "@/lib/reviews-data";
import { faqItems } from "@/lib/faq-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickInfoStrip />

      <Section id="services">
        <Reveal>
          <SectionHead
            eyebrow="Service Menu"
            title="Real pricing, no PDF required."
            description="Every price below is pulled straight from Barclay's current menu. Final pricing may vary by stylist & hair length — ask at booking."
          />
        </Reveal>
        <Reveal>
          <PriceTabs />
        </Reveal>
        <p className="mt-5.5 text-center text-[0.85rem] text-charcoal-soft">
          &quot;+&quot; pricing reflects starting rates; your stylist will
          confirm exact cost during consultation.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href={siteConfig.bookingUrl} trackAs="home_services_book">
            Book This Service
          </ButtonLink>
          <ButtonLink href={siteConfig.fullServiceMenuUrl} variant="ghost">
            View Full Menu
          </ButtonLink>
        </div>
      </Section>

      <Section id="gallery" alt>
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <SectionHead
            eyebrow="Real Client Results"
            title="Before & after, hover to pause."
            align="left"
            className="mb-0"
          />
          <ButtonLink href={siteConfig.social.instagram} variant="ghost" size="sm">
            See more on Instagram
          </ButtonLink>
        </Reveal>
        <Reveal>
          <GalleryMarquee />
        </Reveal>
        <div className="mt-6 text-center">
          <ButtonLink href="/gallery" variant="ghost" size="sm">
            View full gallery
          </ButtonLink>
        </div>
      </Section>

      <Section id="team">
        <Reveal>
          <SectionHead
            eyebrow="Who's Touching Your Hair"
            title="Meet the team behind the transformations."
            description="Every stylist at Barclay's trains continuously on Redken's newest color & cutting techniques."
          />
        </Reveal>
        <Reveal stagger className="grid grid-cols-1 gap-6.5 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <TeamCard key={member.slug} member={member} />
          ))}
        </Reveal>
      </Section>

      <Section id="reviews" alt>
        <Reveal>
          <SectionHead eyebrow="Client Love" title="Don't just take our word for it." />
        </Reveal>
        <Reveal>
          <StatRow />
        </Reveal>
        <Reveal stagger className="grid grid-cols-1 gap-6.5 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.who} review={review} />
          ))}
        </Reveal>
      </Section>

      <Section id="faq">
        <Reveal>
          <SectionHead eyebrow="Good To Know" title="Frequently asked questions." />
        </Reveal>
        <Reveal>
          <FaqAccordion items={faqItems} />
        </Reveal>
      </Section>

      <Section id="visit" alt>
        <Reveal>
          <SectionHead
            eyebrow="Find Us"
            title={`Everett, WA — easy to find, easy to visit.`}
          />
        </Reveal>
        <Reveal className="grid grid-cols-1 items-stretch gap-11 lg:grid-cols-2">
          <div className="flex flex-col justify-center rounded-[14px] border border-line bg-white p-9.5 shadow-soft">
            <h3 className="text-[1.5rem]">{siteConfig.name}</h3>
            <div className="mb-4.5 flex items-start gap-3.5">
              <span className="mt-0.5 text-[1.2rem]">📍</span>
              <div>
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
              </div>
            </div>
            <div className="mb-4.5 flex items-start gap-3.5">
              <span className="mt-0.5 text-[1.2rem]">📞</span>
              <div>
                <strong className="block">{siteConfig.phone}</strong>
                <a href={siteConfig.phoneHref} className="text-terracotta-dark">
                  Tap to call
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 text-[1.2rem]">🕐</span>
              <div className="w-full">
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
              </div>
            </div>
          </div>
          <MapEmbed />
        </Reveal>
      </Section>

      <Section>
        <Reveal
          className="mx-6 rounded-[28px] bg-gradient-to-br from-charcoal to-[#3a3129] px-10 py-17.5 text-center text-white"
        >
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] text-white">
            Ready for your next great hair day?
          </h2>
          <p className="mx-auto mb-6.5 max-w-[52ch] text-[#e6dcd0]">
            Booking takes less than two minutes and you&apos;ll get a
            confirmation instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href={siteConfig.bookingUrl} trackAs="home_final_cta">
              Book Online Now →
            </ButtonLink>
            <ButtonLink href={siteConfig.phoneHref} variant="light" target="_self">
              Call {siteConfig.phone}
            </ButtonLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

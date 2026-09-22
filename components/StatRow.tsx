import { siteConfig } from "@/lib/site-config";
import { ButtonLink } from "./Button";

export function StatRow() {
  return (
    <div className="mx-auto mb-11 flex max-w-[640px] flex-wrap items-center justify-center gap-4.5 rounded-full border border-line bg-white px-7 py-5.5 shadow-soft">
      <span className="font-display text-[2.1rem] text-terracotta-dark">
        {siteConfig.rating.value}
      </span>
      <div>
        <span className="text-[1.2rem] tracking-[2px] text-gold">★★★★☆</span>
        <small className="block text-[0.78rem] text-charcoal-soft">
          {siteConfig.rating.countLabel} reviews across{" "}
          {siteConfig.rating.platforms.join(", ")}
        </small>
      </div>
      <ButtonLink href={siteConfig.reviewsUrl} variant="ghost" size="sm">
        Read reviews
      </ButtonLink>
    </div>
  );
}

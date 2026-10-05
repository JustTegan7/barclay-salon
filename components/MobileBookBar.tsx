import { siteConfig } from "@/lib/site-config";
import { ButtonLink } from "./Button";

export function MobileBookBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t border-line bg-white px-4 py-3 shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.25)] md:hidden">
      <ButtonLink
        href={siteConfig.bookingUrl}
        trackAs="mobile_bar_book_now"
        className="flex-1"
      >
        Book Now
      </ButtonLink>
      <ButtonLink href={siteConfig.phoneHref} variant="ghost" target="_self" className="flex-1">
        Call
      </ButtonLink>
    </div>
  );
}

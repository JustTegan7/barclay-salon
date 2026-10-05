import Image from "next/image";
import Link from "next/link";
import { footerLinks, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-auto bg-charcoal pt-16 pb-7 text-[0.9rem] text-[#cfc4b8]">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3.5 flex items-center gap-2.5 font-display text-[1.2rem] text-white">
              <Image
                src={siteConfig.logo}
                alt={`${siteConfig.name} logo`}
                width={38}
                height={38}
                className="h-[38px] w-[38px] rounded-full ring-1 ring-white/25"
              />
              {siteConfig.name}
            </div>
            <p className="mb-3.5 max-w-[32ch] text-[0.88rem] text-[#a89b8c]">
              Family-owned Everett hair salon serving Snohomish County since{" "}
              {siteConfig.founded}.
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition-colors hover:border-terracotta hover:bg-terracotta"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                  <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 transition-colors hover:border-terracotta hover:bg-terracotta"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.7" r="0.6" className="fill-current" />
                </svg>
              </a>
            </div>
          </div>

          <FooterColumn title="Explore" links={footerLinks.explore} />
          <FooterColumn title="Book" links={footerLinks.book} />
          <div>
            <FooterColumn title="Visit" links={footerLinks.visit} />
            <address className="mt-4 not-italic text-[0.85rem] text-[#a89b8c]">
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city}, {siteConfig.address.state}{" "}
              {siteConfig.address.zip}
            </address>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/12 pt-6 text-[0.8rem] text-[#a89b8c]">
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-white">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener"
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

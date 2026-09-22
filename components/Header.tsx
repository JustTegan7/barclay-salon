"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/site-config";
import { trackLead } from "@/lib/analytics";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/92 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-[1.35rem]"
          onClick={() => setOpen(false)}
        >
          <Image
            src={siteConfig.logo}
            alt={`${siteConfig.name} logo`}
            width={46}
            height={46}
            className="h-[46px] w-[46px] rounded-full object-cover"
            unoptimized
          />
          <span>
            {siteConfig.name}
            <small className="block font-sans text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-charcoal-soft">
              Est. {siteConfig.founded} &middot; Everett, WA
            </small>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 text-[0.92rem] font-medium md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-terracotta after:transition-[width] after:duration-[250ms] hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3.5">
          <a
            href={siteConfig.phoneHref}
            className="hidden items-center gap-1.5 text-[0.92rem] font-semibold sm:flex"
          >
            <span aria-hidden>📞</span>
            <span>{siteConfig.phone}</span>
          </a>
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener"
            onClick={() => trackLead("header_book_now")}
            className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-transparent bg-terracotta px-4 py-2.5 text-[0.8rem] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(185,112,74,0.55)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-terracotta-dark"
          >
            Book Now
          </a>
          <button
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-1.5 md:hidden"
          >
            <span
              className={`block h-0.5 w-6 bg-charcoal transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-charcoal transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-charcoal transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {open ? (
        <ul className="flex flex-col gap-1 border-t border-line bg-ivory px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-[0.95rem] font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={siteConfig.phoneHref} className="block py-2.5 text-[0.95rem] font-medium">
              📞 {siteConfig.phone}
            </a>
          </li>
        </ul>
      ) : null}
    </header>
  );
}

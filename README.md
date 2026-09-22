# Barclay's Salon — website

Full rebuild of Barclay's Salon's site on Evergreen Digital's shared stack:
**Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4**, built
from the homepage redesign you provided (charcoal / ivory / terracotta /
gold, Fraunces + Inter).

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` does a production build,
`npm run lint` runs ESLint, and `npx tsc --noEmit` type-checks.

## What's here

- **9 real pages**: Home, Services & Pricing, Gallery, Our Stylists, About,
  Reviews, FAQ, Contact, plus Privacy and Terms and a custom 404.
- **Real content throughout** — pulled directly from the homepage design you
  gave me: all 27 service/price line items, all four team bios, the FAQ,
  hours, address, phone, and social links. Nothing here is placeholder
  copy except what's explicitly flagged below.
- **One source of truth for business info**: `lib/site-config.ts`. Change
  the phone number, hours, booking URL, etc. there and it updates
  everywhere (header, footer, every page, and the JSON-LD schema).
- **Shared component library** in `components/`: `Header`, `Footer`,
  `Hero`, `PageHero`, `Section`, `Button`/`ButtonLink`, `PriceTabs`,
  `FaqAccordion`, `Gallery`/`GalleryMarquee`, `TeamCard`, `ReviewCard`,
  `MapEmbed`, `ContactForm`, `Breadcrumbs`, `Reveal` (scroll animation).
- **SEO**: per-page metadata, `sitemap.ts`, `robots.ts`, and JSON-LD
  structured data (`HairSalon`, `BreadcrumbList`, `FAQPage`, `Person` per
  stylist) generated from the same data files the visible pages render, so
  the schema can't drift out of sync with the page text.
- **Design tokens** live in `app/globals.css` as CSS variables wired into
  Tailwind's `@theme`, matching your palette exactly (`bg-terracotta`,
  `text-charcoal-soft`, `font-display`, etc. are all available as Tailwind
  utility classes).

## Changes in this update (post-launch audit fixes)

After the site went live, we did a full page-by-page audit and fixed everything
that a real visitor could actually see or that broke a link preview:

- **Added a real OG/social-share image** (`public/og-image.png`) and a
  **branded favicon/app icon set** (`app/favicon.ico`, `app/icon.png`,
  `app/apple-icon.png`) — generated from your actual brand colors and a serif
  wordmark, replacing the default Next.js triangle. **These are interim**,
  built from color + typography, not your real circular scissors logo (this
  build environment couldn't fetch that file — network-blocked). Send over
  the real logo file whenever you have it and we'll swap it in for a
  pixel-perfect version.
- **Real reviews**: swapped the 3 sample "SAMPLE QUOTE" testimonials for 3
  real, sourced client quotes (`lib/reviews-data.ts`), pulled from Barclay's
  public Facebook reviews as aggregated on Birdeye. One quote was lightly
  trimmed (a name of someone not on the current team page was replaced with
  "the team") — flag if you'd rather we find a different quote instead.
- **About page**: replaced the visible "Placeholder:" callout with real,
  presentable (but still generic) copy. It doesn't fabricate any specific
  founding story, ownership history, or community involvement — that still
  needs to come from you/Ryan whenever you want to add it.
- **Privacy & Terms pages**: removed the on-page "Placeholder — not reviewed
  by an attorney" banner. The underlying boilerplate text is unchanged and
  still hasn't been reviewed by an attorney — that note is now a code
  comment for us, not a warning shown to visitors.
- **FAQ parking answer**: removed the visible "(Placeholder — please
  confirm...)" note from the displayed answer. Still worth confirming the
  exact lot details with the salon — flagged as a code comment now instead.

## Open items still remaining

1. **Real logo file** — see above; interim favicon/OG image are in place
   until you send the real one.
2. **Photos are still hotlinked** from the salon's old WordPress host
   (`6039-barclays.wpnet.stylenet.com`). They work today, but for a real
   launch you'll want to download them and add them to `public/`, then
   swap the URLs in `lib/gallery-data.ts` and `lib/team-data.ts`. The
   `next.config.ts` `remotePatterns` entry can come out once that's done.
   This is also why photos can show a blank/black box for a second or two
   on first load.
3. **Contact form has no backend.** Right now it opens the visitor's email
   client with a pre-filled message (works with zero setup), but for a
   smoother experience wire it to a real form backend — see the TODO
   comment at the top of `components/ContactForm.tsx`.
4. **Booking still points at the old Envision/SalonVision system**
   (`siteConfig.bookingUrl`). If the salon moves to a different booking
   platform, that's the one line to change.
5. **GA4 isn't wired up** — `siteConfig.gaMeasurementId` is empty, so the
   `trackLead()` calls sprinkled on every "Book Now" button are currently
   no-ops. Set a measurement ID and add the GA script to activate them.
6. **Rating stats may be stale** — the site shows 4.2★/273+ reviews
   (`siteConfig.rating`) sitewide, but the live Google Maps card on the
   Contact page currently shows 4.1★/205. Worth checking which is current.
7. ~~**Confirm the real domain**~~ **Confirmed**: `https://www.barclaysalon.com`
   is wired into `siteConfig.url`, which flows into canonical tags, the
   sitemap, and JSON-LD.

## Fonts note

`next/font/google` (Fraunces + Inter) needs to reach `fonts.googleapis.com`
at build time. That's blocked in the sandboxed environment I built this in,
so I verified everything (typecheck, lint, build, and a full route smoke
test) with the font imports temporarily stubbed out, then restored the real
`next/font/google` imports before delivery — the file you have now uses the
real fonts. They'll fetch normally on your machine and on Vercel.

## Pushing this update to GitHub

This is different from the first push: `JustTegan7/barclay-salon` is already
live on this codebase, so this time it's a normal update, not a history
wipe. In your existing local clone (the one you already pushed from), copy
these changed/new files over the top (or just unzip this whole folder over
it — either works):

- `app/layout.tsx` (comment-only change around the font imports; no
  behavior change)
- `app/about/page.tsx`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `lib/faq-data.ts`
- `lib/reviews-data.ts`
- `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` (new/replaced)
- `public/og-image.png` (new)
- `README.md`

Then, from inside your local clone:

```bash
git add .
git commit -m "Post-launch fixes: OG image, favicon, real reviews, remove visible placeholders"
git push
```

No `--force` needed this time — this is a normal commit on top of what's
already live. Vercel picks it up automatically, same as last time.

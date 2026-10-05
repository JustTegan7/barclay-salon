# Barclay's Salon website

Production site for [Barclay's Salon](https://www.barclaysalon.com), Everett, WA.
Built and maintained by Evergreen Digital Co.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4. Hosted on Vercel.

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` makes a production build, `npm run lint` runs ESLint, and `npx tsc --noEmit` type-checks.

## Project layout

- `lib/site-config.ts` is the single source of truth for business info: name, phone, address, hours, booking link, gift certificate link, social links, rating, and the GA4 ID. Change it there and it updates everywhere, including the JSON-LD schema.
- `lib/services-data.ts`, `lib/team-data.ts`, `lib/gallery-data.ts`, `lib/reviews-data.ts`, `lib/faq-data.ts` hold the page content.
- `components/` holds the shared UI (Header, Footer, Hero, PriceTabs, Gallery, TeamCard, ContactForm, and so on).
- `public/images/` holds the self-hosted logo, gallery photos, and team headshots.
- `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, and `public/og-image.png` are generated from the real logo by `scripts/gen-brand-images.py`.

## Environment and settings

| Setting | Where | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Vercel > Project > Settings > Environment Variables | Turns on the Contact page message form. Get a free key at web3forms.com using the inbox that should receive messages. The form stays hidden until this is set. |
| `gaMeasurementId` | `lib/site-config.ts` | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`). Analytics only loads when this is set. |
| `bookingUrl` | `lib/site-config.ts` | Where every "Book" button goes. |

## SEO

Per-page metadata, `app/sitemap.ts`, `app/robots.ts`, and JSON-LD structured data (`HairSalon`, `BreadcrumbList`, `FAQPage`, `Person` per stylist), generated from the same data files the pages render.

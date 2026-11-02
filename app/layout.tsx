import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { hairSalonSchema, jsonLdString } from "@/lib/structured-data";
import { Header } from "@/components/Header";
import { DemoBanner } from "@/components/DemoBanner";
import { Footer } from "@/components/Footer";
import { MobileBookBar } from "@/components/MobileBookBar";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Everett, WA Hair Salon | Book Online`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | Everett, WA Hair Salon`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Everett, WA Hair Salon`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col pb-16 font-sans antialiased md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(hairSalonSchema()) }}
        />
        <DemoBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBookBar />
        {siteConfig.gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.gaMeasurementId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}

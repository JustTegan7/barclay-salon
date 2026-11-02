import { siteConfig } from "@/lib/site-config";

// Shown while the site is a preview built by Evergreen Digital and not yet
// approved by the salon. Turn off with siteConfig.demoMode = false.
export function DemoBanner() {
  if (!siteConfig.demoMode) return null;
  return (
    <div
      role="note"
      className="bg-charcoal px-4 py-2.5 text-center text-[0.8rem] leading-snug text-white"
    >
      <strong className="font-semibold">Demo website.</strong> This is a preview built by{" "}
      <a
        href="https://evergreendigitalco.com"
        target="_blank"
        rel="noopener"
        className="underline underline-offset-2"
      >
        Evergreen Digital Co.
      </a>{" "}
      for {siteConfig.name} and is not yet the salon&apos;s official site.
    </div>
  );
}

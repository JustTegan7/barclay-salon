"use client";

import { siteConfig } from "./site-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 `generate_lead` event. Safe no-op when GA hasn't been wired up
 * yet (siteConfig.gaMeasurementId is empty) or gtag isn't loaded for any
 * other reason, so it's safe to call from every CTA regardless of launch state.
 */
export function trackLead(source: string) {
  if (!siteConfig.gaMeasurementId) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "generate_lead", {
    lead_source: source,
  });
}

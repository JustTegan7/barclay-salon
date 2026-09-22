import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const routes = [
  "",
  "/services",
  "/gallery",
  "/team",
  "/about",
  "/reviews",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

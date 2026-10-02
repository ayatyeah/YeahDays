import type { MetadataRoute } from "next";

const SITE = "https://yeahgrind.site";

/** Публичные страницы — те же, что открыты без входа в src/proxy.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/register`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/login`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE}/terms`, changeFrequency: "monthly", priority: 0.3 },
  ];
}

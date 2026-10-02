import type { MetadataRoute } from "next";

/**
 * robots.txt. Индексировать имеет смысл только витрину и юридические
 * страницы: всё остальное закрыто входом, и поисковик увидел бы там лишь
 * редирект на /login. /api и служебное закрываем явно.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/$", "/login", "/register", "/terms", "/privacy"], disallow: ["/api/", "/admin", "/oauth/"] }],
    sitemap: "https://yeahgrind.site/sitemap.xml",
    host: "https://yeahgrind.site",
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://astro-coach.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/chat", "/settings", "/daily", "/weekly", "/monthly"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

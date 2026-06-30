import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/", "/_next/"],
    },
    sitemap: "https://novonixsoft.com/sitemap.xml",
  };
}

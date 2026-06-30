import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://novonixsoft.com/", // Update this to the actual domain when deployed to production
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}

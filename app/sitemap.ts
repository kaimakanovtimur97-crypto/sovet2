import type { MetadataRoute } from "next";
import { blogPosts, cases, services, site } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...services.map((item) => ({ url: `${site.url}/services/${item.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...cases.map((item) => ({ url: `${site.url}/cases/${item.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...blogPosts.map((item) => ({ url: `${site.url}/blog/${item.slug}`, lastModified: item.dateIso, changeFrequency: "monthly" as const, priority: 0.65 })),
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}

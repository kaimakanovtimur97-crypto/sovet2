import type { MetadataRoute } from "next";
import { blogPosts, cases, regions, services, site } from "@/lib/site-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: site.updatedAt, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/services`, lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((item) => ({
      url: `${site.url}/services/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    { url: `${site.url}/cases`, lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.75 },
    ...cases.map((item) => ({
      url: `${site.url}/cases/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/regions`, lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.75 },
    ...regions.map((item) => ({
      url: `${site.url}/regions/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/prices`, lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.75 },
    { url: `${site.url}/about`, lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contacts`, lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.65 },
    { url: `${site.url}/requisites`, lastModified: site.updatedAt, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/blog`, lastModified: site.updatedAt, changeFrequency: "weekly", priority: 0.7 },
    ...blogPosts.map((item) => ({
      url: `${site.url}/blog/${item.slug}`,
      lastModified: item.updatedIso,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { blogPosts, cases, regions, services, site, contentUpdatedAt } from "@/lib/site-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: site.updatedAt, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/marketing-agency"), lastModified: contentUpdatedAt, changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteUrl("/services"), lastModified: contentUpdatedAt, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((item) => ({
      url: absoluteUrl(`/services/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    { url: absoluteUrl("/cases"), lastModified: contentUpdatedAt, changeFrequency: "monthly", priority: 0.75 },
    ...cases.map((item) => ({
      url: absoluteUrl(`/cases/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/regions"), lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.75 },
    ...regions.map((item) => ({
      url: absoluteUrl(`/regions/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/prices"), lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/about"), lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contacts"), lastModified: site.updatedAt, changeFrequency: "monthly", priority: 0.65 },
    { url: absoluteUrl("/requisites"), lastModified: site.updatedAt, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/blog"), lastModified: contentUpdatedAt, changeFrequency: "weekly", priority: 0.7 },
    ...blogPosts.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.updatedIso,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}

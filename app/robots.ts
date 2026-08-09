import type { MetadataRoute } from "next";
import { site } from "@/lib/site-data";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: new URL(site.url).hostname,
  };
}

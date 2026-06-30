import type { MetadataRoute } from "next";
import { CONTACT } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  const base = CONTACT.siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}

import type { Metadata } from "next";
import { site } from "@/lib/site-data";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  index?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  index = true,
}: PageMetadata): Metadata {
  const url = new URL(path, site.url).toString();
  const openGraph: Metadata["openGraph"] = {
    title,
    description,
    url,
    siteName: site.name,
    locale: "ru_RU",
    type,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — маркетинг для бизнеса` }],
    ...(type === "article" ? { publishedTime, modifiedTime } : {}),
  };

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}

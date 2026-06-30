import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { LeadProvider } from "@/components/Lead";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT.siteUrl),
  title: {
    default: "Маркетинговое агентство «Совет» в Новороссийске — performance, бренд, аналитика",
    template: "%s",
  },
  description:
    "Маркетинговое агентство полного цикла в Новороссийске: performance, бренд, SMM и аналитика. Работаем на прозрачные KPI и выручку. Бесплатная стратегия за 3 дня.",
  keywords: [
    "маркетинговое агентство Новороссийск",
    "реклама Новороссийск",
    "контекстная реклама Новороссийск",
    "таргет Новороссийск",
    "SMM Новороссийск",
    "performance маркетинг",
    "продвижение сайтов Новороссийск",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Совет",
    title: "Маркетинговое агентство «Совет» в Новороссийске",
    description:
      "Performance, бренд и аналитика в одной команде. Работаем на выручку и прозрачные KPI. Бесплатная стратегия за 3 дня.",
    url: CONTACT.siteUrl,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Совет — маркетинговое агентство",
    legalName: CONTACT.legalName,
    description:
      "Маркетинговое агентство полного цикла в Новороссийске: performance, бренд, SMM, аналитика.",
    url: CONTACT.siteUrl,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    priceRange: "от ₽ 120 000",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.region,
      postalCode: CONTACT.postalCode,
      addressCountry: "RU",
    },
    geo: { "@type": "GeoCoordinates", latitude: CONTACT.lat, longitude: CONTACT.lng },
    areaServed: ["Новороссийск", "Краснодарский край", "Россия"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };

  return (
    <html lang="ru">
      <head>
        <meta name="geo.region" content="RU-KDA" />
        <meta name="geo.placename" content="Новороссийск" />
        <meta name="geo.position" content={`${CONTACT.lat};${CONTACT.lng}`} />
        <meta name="ICBM" content={`${CONTACT.lat}, ${CONTACT.lng}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <LeadProvider>{children}</LeadProvider>
      </body>
    </html>
  );
}

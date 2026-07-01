import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { LeadProvider } from "@/components/Lead";
import { CONTACT, COMPLEX_PLAN, SINGLE_SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT.siteUrl),
  title: {
    default: "Маркетинговое агентство «Совет» в Новороссийске — комплексный маркетинг 50 000 ₽/мес",
    template: "%s",
  },
  description:
    "Маркетинговое агентство «Совет» в Новороссийске: комплексный маркетинг за 50 000 ₽/мес — Яндекс Директ, таргет VK, SMM, SEO, лендинги и аналитика. Прозрачные KPI и ежемесячная отчётность.",
  keywords: [
    "маркетинговое агентство Новороссийск",
    "реклама Новороссийск",
    "контекстная реклама Новороссийск",
    "таргет Новороссийск",
    "SMM Новороссийск",
    "performance маркетинг",
    "продвижение сайтов Новороссийск",
    "ведение Яндекс Директ Новороссийск",
    "таргетированная реклама ВКонтакте",
    "создание лендинга Новороссийск",
    "создание сайтов Новороссийск",
    "SEO продвижение Новороссийск",
    "SMM ведение соцсетей",
    "маркетинговая стратегия для бизнеса",
    "настройка Яндекс Карты 2ГИС",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Совет",
    title: "Маркетинговое агентство «Совет» в Новороссийске",
    description:
      "Комплексный маркетинг за 50 000 ₽/мес: Директ, таргет VK, SMM, SEO, лендинги и аналитика в одной команде. Бесплатная стратегия за 3 дня.",
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
      "Маркетинговое агентство полного цикла в Новороссийске: комплексный маркетинг, Яндекс Директ, таргет VK, SMM, SEO, лендинги и аналитика.",
    url: CONTACT.siteUrl,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    priceRange: "15 000 ₽ – 50 000 ₽",
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги агентства «Совет»",
      itemListElement: [
        {
          "@type": "Offer",
          name: COMPLEX_PLAN.name,
          price: String(COMPLEX_PLAN.price),
          priceCurrency: "RUB",
          itemOffered: { "@type": "Service", name: "Комплексный маркетинг под ключ", description: COMPLEX_PLAN.tagline },
        },
        ...SINGLE_SERVICES.filter((s) => s.priceNum).map((s) => ({
          "@type": "Offer",
          name: s.name,
          price: String(s.priceNum),
          priceCurrency: "RUB",
          itemOffered: { "@type": "Service", name: s.name },
        })),
      ],
    },
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

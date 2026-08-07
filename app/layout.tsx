import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import { SiteBackdrop } from "@/components/site-backdrop";
import { site } from "@/lib/site-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Маркетинговое агентство в Новороссийске — Совет",
    template: "%s | Совет Маркетинг",
  },
  description:
    "Маркетинговое агентство в Новороссийске: стратегия, сайты, SEO, Яндекс Директ, Карты, SMM и аналитика для бизнеса.",
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  openGraph: {
    title: "Совет Маркетинг — агентство в Новороссийске",
    description:
      "Стратегия, сайты, реклама и аналитика с прозрачными ограничениями и кабинетами клиента.",
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Совет Маркетинг — агентство в Новороссийске" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Совет Маркетинг — агентство в Новороссийске",
    description: "Стратегия, сайты, реклама и аналитика для бизнеса.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${mono.variable}`}>
        <SiteBackdrop />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${site.url}/#organization`,
                  name: site.name,
                  alternateName: site.shortName,
                  legalName: site.legalName,
                  url: site.url,
                  logo: `${site.url}/favicon.svg`,
                  email: site.email,
                  telephone: "+79180531553",
                  areaServed: ["Новороссийск", "Анапа", "Геленджик", "Краснодарский край"],
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+79180531553",
                    email: site.email,
                    contactType: "customer service",
                    availableLanguage: ["Russian"],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${site.url}/#website`,
                  url: site.url,
                  name: site.name,
                  inLanguage: "ru-RU",
                  publisher: { "@id": `${site.url}/#organization` },
                },
              ],
            }),
          }}
        />
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}

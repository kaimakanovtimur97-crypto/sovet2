import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteBackdrop } from "@/components/site-backdrop";
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
  metadataBase: new URL("https://www.sovet-nvrsk.ru"),
  title: {
    default: "Совет — маркетинговое агентство в Новороссийске",
    template: "%s | Совет",
  },
  description:
    "Маркетинговое агентство полного цикла в Новороссийске: стратегия, performance, бренд, SMM и сквозная аналитика.",
  openGraph: {
    title: "Совет — маркетинг, который считает деньги",
    description:
      "Стратегия, performance и аналитика в одной команде. Работаем на unit-экономику и прозрачные KPI.",
    type: "website",
    locale: "ru_RU",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Совет — маркетинг, который считает деньги",
    description: "Маркетинговое агентство полного цикла в Новороссийске.",
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
  alternates: { canonical: "/" },
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
              "@type": "Organization",
              "@id": "https://www.sovet-nvrsk.ru/#organization",
              name: "Совет",
              url: "https://www.sovet-nvrsk.ru",
              email: "hello@sovet.ru",
              telephone: "+79180531553",
              areaServed: ["Новороссийск", "Краснодарский край", "Россия"],
              address: { "@type": "PostalAddress", addressLocality: "Новороссийск", addressCountry: "RU" },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}

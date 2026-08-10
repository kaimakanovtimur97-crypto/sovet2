import type { Metadata } from "next";
import { Geist, Silkscreen } from "next/font/google";
import "./nexum.css";

const geist = Geist({
  variable: "--font-nexum-geist",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-nexum-silkscreen",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexum — интерактивный AI-лендинг",
  description:
    "Авторский спецпроект агентства «Совет»: полноэкранное видео, glass-интерфейс, адаптивная композиция и интерактивное меню.",
  alternates: { canonical: "/nexum" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Nexum — интерактивный AI-лендинг",
    description: "Авторский спецпроект агентства «Совет».",
    type: "website",
    locale: "ru_RU",
    url: "/nexum",
    images: [{ url: "/nexum/og.png", width: 1200, height: 630, alt: "Nexum — авторский AI-лендинг агентства Совет" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexum — интерактивный AI-лендинг",
    description: "Авторский спецпроект агентства «Совет».",
    images: ["/nexum/og.png"],
  },
};

export default function NexumLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${geist.variable} ${silkscreen.variable}`}>{children}</div>;
}

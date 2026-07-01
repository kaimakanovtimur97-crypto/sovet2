import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { CtaSection } from "@/components/CtaSection";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Блог о маркетинге для бизнеса — агентство «Совет», Новороссийск",
  description: "Практичные статьи о продвижении бизнеса в Новороссийске: Яндекс Директ, карты 2ГИС, сайты и лендинги, SEO. Без воды, с ценами и цифрами.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Блог агентства «Совет»", description: "Практика продвижения бизнеса в Новороссийске: Директ, карты, сайты, SEO.", url: "/blog", type: "website", locale: "ru_RU" },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <section className="wrap section">
        <div className="secthead">
          <span className="eyebrow"><Icon name="sparkles" size={15} /> Блог</span>
          <h1 style={{ fontSize: "clamp(34px,4.4vw,54px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.06, color: "var(--fg-0)", margin: 0 }}>Практика маркетинга — без воды</h1>
          <p>Пишем о том, что делаем руками: реклама, карты, сайты и аналитика для бизнеса в Новороссийске.</p>
        </div>
        <div className="grid-3" style={{ marginTop: 48 }}>
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card card--int card--pad" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span className="badge">{p.tag}</span>
                <span style={{ fontSize: 12.5, color: "var(--fg-4)" }}>{p.dateLabel} · {p.readTime}</span>
              </div>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 10px", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{p.title}</h2>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: "0 0 18px" }}>{p.excerpt}</p>
              <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--accent-hover)" }}>
                Читать <Icon name="arrowRight" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <CtaSection title="Получите стратегию роста за 3 дня" text="Бесплатный разбор воронки и план первых гипотез. Без воды и презентаций ради презентаций." />
      <Footer />
    </>
  );
}

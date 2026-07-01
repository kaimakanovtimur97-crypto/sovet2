import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { CtaSection } from "@/components/CtaSection";
import { CASES, CONTACT, getCase, initials } from "@/lib/data";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cs = getCase(params.slug);
  if (!cs) return {};
  const title = `${cs.title} — кейс агентства «Совет»`;
  return {
    title,
    description: cs.desc,
    alternates: { canonical: `/cases/${cs.slug}` },
    openGraph: { title, description: cs.desc, url: `/cases/${cs.slug}`, type: "article", locale: "ru_RU" },
  };
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const cs = getCase(params.slug);
  if (!cs) notFound();

  const related = CASES.filter((c) => c.slug !== cs.slug).slice(0, 3);

  const base = CONTACT.siteUrl.replace(/\/$/, "");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Кейсы", item: `${base}/#cases` },
      { "@type": "ListItem", position: 3, name: cs.title, item: `${base}/cases/${cs.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(900px 380px at 80% -12%, ${cs.glow}, transparent 60%)`, pointerEvents: "none" }} />
        <div className="grain" />
        <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(48px,7vw,80px)", paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg-3)", marginBottom: 28 }}>
            <Link href="/" style={{ color: "var(--fg-3)" }}>Главная</Link>
            <span>/</span>
            <Link href="/#cases" style={{ color: "var(--fg-3)" }}>Кейсы</Link>
            <span>/</span>
            <span style={{ color: "var(--fg-1)" }}>{cs.client}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span className="badge">{cs.tag}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg-3)" }}>{cs.client}</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px,4.4vw,56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, color: "var(--fg-0)", maxWidth: 760 }}>{cs.title}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--fg-2)", maxWidth: 600, marginTop: 22 }}>{cs.desc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 36, maxWidth: 600 }}>
            {cs.results.map((r) => (
              <div key={r.label} style={{ background: "var(--ink-700)", border: "1px solid var(--line)", borderRadius: 14, padding: 18, boxShadow: "var(--edge-top)" }}>
                <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: "var(--accent-hover)" }}>{r.value}</div>
                <div style={{ fontSize: 12.5, color: "var(--fg-3)", marginTop: 5, lineHeight: 1.4 }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ЗАДАЧА / РЕШЕНИЕ */}
      <section style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }} className="section">
        <div style={{ gap: 48 }} className="grid-2">
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-hover)", marginBottom: 12 }}>Задача</div>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--fg-1)", margin: 0 }}>{cs.challenge}</p>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-hover)", marginBottom: 12 }}>Что сделали</div>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--fg-1)", margin: 0 }}>{cs.solution}</p>
          </div>
        </div>
      </section>

      {/* ЭТАПЫ */}
      <section style={{ background: "var(--ink-800)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }} className="section">
          <div className="secthead">
            <span className="eyebrow">Ход работы</span>
            <h2>Как мы пришли к результату</h2>
          </div>
          <div className="grid-2" style={{ marginTop: 44 }}>
            {cs.stages.map((st) => (
              <div key={st.n} className="card card--pad">
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--accent-hover)", width: 28 }}>{st.n}</div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{st.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0 }}>{st.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВ */}
      <section style={{ maxWidth: 1000, margin: "0 auto", paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }} className="section">
        <div className="card card--accent card--pad">
          <span style={{ color: "var(--accent-line)", display: "block", marginBottom: 18 }}><Icon name="quote" size={32} /></span>
          <p style={{ fontSize: 20, lineHeight: 1.55, color: "var(--fg-0)", margin: "0 0 22px", fontWeight: 500, letterSpacing: "-0.01em" }}>{cs.quote}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="avatar avatar--accent">{initials(cs.quoteName)}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-0)" }}>{cs.quoteName}</div>
              <div style={{ fontSize: 13, color: "var(--fg-3)" }}>{cs.quoteRole}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ДРУГИЕ КЕЙСЫ */}
      <section className="wrap" style={{ paddingBottom: "var(--section-y)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 20 }}>Другие кейсы</div>
        <div className="grid-3">
          {related.map((rc) => (
            <Link key={rc.slug} href={`/cases/${rc.slug}`} className="card card--int" style={{ display: "block" }}>
              <div style={{ height: 150, borderRadius: "16px 16px 0 0", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${rc.tint}, var(--ink-600))`, borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                <span style={{ position: "relative", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 22, color: rc.color, letterSpacing: "-0.01em" }}>{rc.metric}</span>
                <span className="badge" style={{ position: "absolute", top: 14, left: 14 }}>{rc.tag}</span>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{rc.title}</h3>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--accent-hover)" }}>Разобрать кейс <Icon name="arrowRight" size={15} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaSection title="Хотите такой же результат?" text="Бесплатный разбор воронки и план первых гипотез для вашего проекта в Новороссийске. Без воды." />

      <Footer />
    </>
  );
}

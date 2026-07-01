import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { ConsultButton } from "@/components/Lead";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { SERVICES, STEPS, getService } from "@/lib/data";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const svc = getService(params.slug);
  if (!svc) return {};
  return {
    title: svc.metaTitle,
    description: svc.intro,
    alternates: { canonical: `/services/${svc.slug}` },
    openGraph: { title: svc.metaTitle, description: svc.intro, url: `/services/${svc.slug}`, type: "article", locale: "ru_RU" },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const svc = getService(params.slug);
  if (!svc) notFound();

  const related = SERVICES.filter((s) => s.slug !== svc.slug);

  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 380px at 80% -12%, var(--accent-glow), transparent 60%)", pointerEvents: "none" }} />
        <div className="grain" />
        <div className="wrap" style={{ position: "relative", paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(48px,7vw,88px)" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg-3)", marginBottom: 28 }}>
            <Link href="/" style={{ color: "var(--fg-3)" }}>Главная</Link>
            <span>/</span>
            <Link href="/#services" style={{ color: "var(--fg-3)" }}>Услуги</Link>
            <span>/</span>
            <span style={{ color: "var(--fg-1)" }}>{svc.name}</span>
          </nav>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" }} className="svc-hero">
            <div>
              <span className="eyebrow" style={{ marginBottom: 22 }}>
                <Icon name={svc.icon} size={15} /> {svc.eyebrow}
              </span>
              <h1 style={{ fontSize: "clamp(36px,4.6vw,60px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.06, color: "var(--fg-0)" }}>{svc.h1}</h1>
              <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--fg-2)", maxWidth: 520, marginTop: 22 }}>{svc.intro}</p>
              <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
                <ConsultButton size="lg">Получить стратегию за 3 дня</ConsultButton>
                <Link href="/#cases" className="btn btn--outline btn--lg">Смотреть кейсы</Link>
              </div>
            </div>
            <div className="svc-includes" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              {svc.stats.map((s) => (
                <div key={s.label} style={{ background: "var(--ink-700)", border: "1px solid var(--line)", borderRadius: 14, padding: 20, boxShadow: "var(--edge-top)" }}>
                  <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "-0.02em", color: s.accent ? "var(--accent-hover)" : "var(--fg-0)" }}>{s.value}</div>
                  <div style={{ fontSize: 12.5, color: "var(--fg-3)", marginTop: 6, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ЧТО ВХОДИТ */}
      <section className="wrap section">
        <div className="secthead">
          <span className="eyebrow">Что входит</span>
          <h2>{svc.includesTitle}</h2>
          <p>{svc.includesSub}</p>
        </div>
        <div className="grid-2" style={{ marginTop: 48 }}>
          {svc.includes.map((it) => (
            <div key={it.title} className="card card--int card--pad">
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 12, background: "var(--accent-soft)", border: "1px solid var(--accent-line)", color: "var(--accent-hover)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={it.icon} size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 7px", letterSpacing: "-0.01em" }}>{it.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0 }}>{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ПОДХОД */}
      <section style={{ background: "var(--ink-800)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap section">
          <div className="secthead center">
            <span className="eyebrow">Как мы работаем</span>
            <h2>Четыре шага до управляемого роста</h2>
          </div>
          <div className="grid-4" style={{ marginTop: 48 }}>
            {STEPS.map((st) => (
              <div key={st.n} style={{ padding: "4px 4px 0" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--accent-hover)", marginBottom: 14 }}>{st.n}</div>
                <div style={{ height: 1, background: "var(--line)", marginBottom: 18 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 8px" }}>{st.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: 0 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ maxWidth: 840, margin: "0 auto", paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}>
        <div className="secthead center">
          <span className="eyebrow">Вопросы</span>
          <h2>Частые вопросы об услуге</h2>
        </div>
        <Faq items={svc.faqs} />
      </section>

      {/* ДРУГИЕ УСЛУГИ */}
      <section className="wrap" style={{ paddingBottom: "var(--section-y)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 20 }}>Другие услуги</div>
        <div className="grid-3">
          {related.map((r) => (
            <Link key={r.slug} href={`/services/${r.slug}`} className="card card--int card--pad">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: "var(--accent-soft)", border: "1px solid var(--accent-line)", color: "var(--accent-hover)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={r.icon} size={20} /></div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--fg-0)", letterSpacing: "-0.01em" }}>{r.name}</span>
                </div>
                <span style={{ color: "var(--accent-hover)" }}><Icon name="arrowUpRight" size={18} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CtaSection title={svc.ctaTitle} text="Бесплатный разбор и план первых гипотез по вашему проекту в Новороссийске. Без воды." />

      <Footer />
    </>
  );
}

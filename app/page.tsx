import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { ConsultButton } from "@/components/Lead";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { SERVICES, CASES, STEPS, CONTACT, COMPLEX_PLAN, SINGLE_SERVICES, initials } from "@/lib/data";

const PROOF = [
  { value: "₽ 2.4 млрд", label: "выручки клиентам за 2024", accent: false },
  { value: "−34%", label: "средний CPA после оптимизации", accent: true },
  { value: "96%", label: "клиентов продлевают контракт", accent: false },
  { value: "12 дней", label: "до первых результатов", accent: false },
];

const TEAM = [
  { name: "Имя Фамилия", role: "Основатель, стратег", bio: "Отвечает за стратегию и unit-экономику клиентских проектов." },
  { name: "Имя Фамилия", role: "Руководитель перформанса", bio: "Контекст, таргет и управление ставками по ROMI." },
  { name: "Имя Фамилия", role: "Арт-директор", bio: "Бренд, креатив и кампании, которые запоминают." },
  { name: "Имя Фамилия", role: "Лид аналитики", bio: "Сквозная аналитика, дашборды и атрибуция до выручки." },
];

const TESTIMONIALS = [
  { quote: "За квартал заявки выросли в 3 раза, а CPL упал на 40%. Впервые вижу, куда уходит каждый рубль.", name: "Мария Левина", role: "CMO, «Дом+»", accent: false },
  { quote: "Команда, которая говорит на языке выручки, а не охватов. Отчёты понятны совету директоров.", name: "Артём Гросс", role: "CEO, финтех-стартап", accent: true },
  { quote: "Запустили нас с нуля и довели до лидера ниши за полгода. Прозрачно на каждом шаге.", name: "Ольга Дин", role: "Фаундер, EdTech", accent: false },
];


const HOME_FAQ = [
  { q: "Сколько стоит и за что я плачу?", a: "Комплекс «Совет» — 50 000 ₽ в месяц: фиксированный ретейнер за работу команды, рекламные бюджеты отдельно, без скрытого процента от расходов. Отдельные услуги — от 15 000 ₽. Вы всегда видите, сколько уходит на работу, а сколько в рекламу." },
  { q: "Когда будут первые результаты?", a: "Первые гипотезы запускаем за две недели. Значимые сдвиги по ключевым метрикам обычно видны к 4–6 неделе работы." },
  { q: "Вы работаете по KPI?", a: "Да. На старте фиксируем метрики (CPL, CPA, ROMI, LTV) и отчитываемся по ним еженедельно в прозрачном дашборде." },
  { q: "Заберёте ли вы наши кабинеты и данные?", a: "Все рекламные аккаунты, кабинеты и данные остаются вашими. Мы работаем с полным доступом и прозрачностью — ничего не уносим с собой." },
  { q: "Есть ли минимальный срок контракта?", a: "Рекомендуем горизонт от трёх месяцев — это минимальный период, чтобы накопить данные и сделать обоснованные выводы." },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Header />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 380px at 80% -12%, var(--accent-glow), transparent 60%)", pointerEvents: "none" }} />
        <div className="grain" />
        <div className="wrap hero-grid" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 64, alignItems: "center", paddingTop: "clamp(56px,8vw,104px)", paddingBottom: "clamp(56px,8vw,104px)" }}>
          <div>
            <span className="eyebrow" style={{ marginBottom: 24 }}>
              <Icon name="sparkles" size={15} /> Маркетинговое агентство · Новороссийск
            </span>
            <h1 style={{ fontSize: "clamp(40px,5.2vw,68px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.04, color: "var(--fg-0)" }}>
              Маркетинг, который<br />считает деньги
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--fg-2)", maxWidth: 480, marginTop: 22 }}>
              Стратегия, перформанс и аналитика в одной команде. Работаем на unit-экономику и прозрачные KPI — а не на охваты ради охватов. Новороссийск и вся Россия.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <ConsultButton size="lg">Получить стратегию</ConsultButton>
              <Link href="/#cases" className="btn btn--outline btn--lg">
                <Icon name="play" size={16} /> Смотреть кейсы
              </Link>
            </div>
            <div style={{ display: "flex", gap: 40, marginTop: 48, flexWrap: "wrap" }}>
              <div><div style={{ fontWeight: 800, fontSize: 30, color: "var(--fg-0)", letterSpacing: "-0.02em" }}>8 лет</div><div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>на рынке</div></div>
              <div><div style={{ fontWeight: 800, fontSize: 30, color: "var(--fg-0)", letterSpacing: "-0.02em" }}>140+</div><div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>проектов</div></div>
              <div><div style={{ fontWeight: 800, fontSize: 30, color: "var(--accent-hover)", letterSpacing: "-0.02em" }}>×3.4</div><div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>средний рост заявок</div></div>
            </div>
          </div>
          <div>
            <div style={{ background: "var(--ink-700)", border: "1px solid var(--line)", borderRadius: 20, padding: 22, boxShadow: "var(--shadow-4), var(--edge-top)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)" }}>Сводка · Q2</span>
                <span className="badge badge--success"><span className="dot" />Live</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { l: "ROMI", v: "412%", d: "+18%" },
                  { l: "Заявок", v: "1 284", d: "+9%" },
                  { l: "CPL", v: "₽ 740", d: "−12%" },
                  { l: "CTR", v: "3.8%", d: "+0.6" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "var(--ink-600)", border: "1px solid var(--line)", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-3)" }}>{s.l}</div>
                    <div style={{ fontWeight: 800, fontSize: 22, color: "var(--fg-0)", marginTop: 6, letterSpacing: "-0.01em" }}>{s.v}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 3, color: "var(--success)" }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* КЛИЕНТЫ */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: 34, paddingBottom: 34, display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)", whiteSpace: "nowrap" }}>Нам доверяют</span>
          <div className="logos-grid" style={{ flex: 1, minWidth: 260, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 14 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 50, border: "1px dashed var(--line-strong)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-4)", fontFamily: "var(--font-mono)", fontSize: 11 }}>логотип</div>
            ))}
          </div>
        </div>
      </section>

      {/* УСЛУГИ */}
      <section id="services" className="wrap section">
        <div className="secthead">
          <span className="eyebrow">Что мы делаем</span>
          <h2>Полный цикл — от стратегии до выручки</h2>
          <p>Одна команда закрывает performance, бренд и аналитику. Без подрядчиков-посредников.</p>
        </div>
        <div className="grid-4" style={{ marginTop: 48 }}>
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="card card--int card--pad" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--accent-soft)", border: "1px solid var(--accent-line)", color: "var(--accent-hover)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon name={s.icon} size={22} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{s.name}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: "0 0 16px" }}>{s.intro}</p>
              <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--accent-hover)" }}>
                Подробнее <Icon name="arrowRight" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ЦИФРЫ */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--ink-800)" }}>
        <div className="wrap stats-grid" style={{ paddingTop: 56, paddingBottom: 56, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }}>
          {PROOF.map((p) => (
            <div key={p.label}>
              <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: "-0.03em", color: p.accent ? "var(--accent-hover)" : "var(--fg-0)" }}>{p.value}</div>
              <div style={{ fontSize: 14, color: "var(--fg-2)", marginTop: 6 }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* КЕЙСЫ */}
      <section id="cases" className="wrap section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div className="secthead">
            <span className="eyebrow">Кейсы</span>
            <h2>Результаты, а не отчёты о работе</h2>
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: 44 }}>
          {CASES.map((c) => (
            <Link key={c.slug} href={`/cases/${c.slug}`} className="card card--int" style={{ display: "block" }}>
              <div style={{ height: 168, borderRadius: "16px 16px 0 0", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${c.tint}, var(--ink-600))`, borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "20px 20px" }} />
                <span style={{ position: "relative", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 24, color: c.color, letterSpacing: "-0.01em" }}>{c.metric}</span>
                <span className="badge" style={{ position: "absolute", top: 14, left: 14 }}>{c.tag}</span>
              </div>
              <div style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{c.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: "0 0 14px" }}>{c.desc}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--accent-hover)" }}>
                  Разобрать кейс <Icon name="arrowRight" size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ПОДХОД */}
      <section id="approach" style={{ background: "var(--ink-800)", borderTop: "1px solid var(--line)" }}>
        <div className="wrap section">
          <div className="secthead center">
            <span className="eyebrow">Подход</span>
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

      {/* КОМАНДА */}
      <section id="team" className="wrap section">
        <div className="secthead">
          <span className="eyebrow">Команда</span>
          <h2>Кто отвечает за ваш результат</h2>
          <p>Команда в Новороссийске, которая отвечает за ваши деньги, а не за охваты.</p>
        </div>
        <div className="grid-4" style={{ marginTop: 48 }}>
          {TEAM.map((m, i) => (
            <div key={i} className="card card--pad">
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-soft)", border: "1px solid var(--accent-line)", color: "var(--accent-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, marginBottom: 18 }}>{initials(m.name)}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg-0)", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{m.name}</h3>
              <div style={{ fontSize: 13, color: "var(--accent-hover)", fontWeight: 600, marginBottom: 10 }}>{m.role}</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--fg-2)", margin: 0 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ТАРИФЫ */}
      <section id="pricing" className="wrap section">
        <div className="secthead center">
          <span className="eyebrow">Тарифы</span>
          <h2>Комплексный маркетинг — 50 000 ₽ в месяц</h2>
          <p style={{ marginLeft: "auto", marginRight: "auto" }}>Фиксированный ретейнер за работу команды. Рекламные бюджеты — отдельно и прозрачно, без скрытых процентов.</p>
        </div>

        <div className="card card--accent" style={{ marginTop: 48, padding: "clamp(24px,4vw,40px)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>{COMPLEX_PLAN.name}</span>
                <span className="badge badge--accent">Выгоднее отдельных услуг</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, fontSize: "clamp(34px,4vw,46px)", letterSpacing: "-0.02em", color: "var(--fg-0)", whiteSpace: "nowrap" }}>{COMPLEX_PLAN.priceLabel}</span>
                <span style={{ fontSize: 15, color: "var(--fg-3)" }}>{COMPLEX_PLAN.per}</span>
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--fg-2)", margin: "12px 0 0", maxWidth: 560 }}>{COMPLEX_PLAN.tagline}</p>
            </div>
            <ConsultButton size="lg">{COMPLEX_PLAN.cta}</ConsultButton>
          </div>
          <div className="plan-features" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px 28px", marginTop: 32, paddingTop: 28, borderTop: "1px solid var(--line)" }}>
            {COMPLEX_PLAN.features.map((ft) => (
              <div key={ft} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--fg-1)", lineHeight: 1.45 }}>
                <span style={{ color: "var(--accent-hover)", marginTop: 1, flexShrink: 0 }}><Icon name="check" size={16} /></span>
                <span>{ft}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 64 }}>
          <div className="secthead">
            <span className="eyebrow">Отдельные услуги</span>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)" }}>Нужно что-то одно — берите отдельно</h2>
          </div>
          <div className="grid-4" style={{ marginTop: 36 }}>
            {SINGLE_SERVICES.map((s) => (
              <div key={s.name} className="card card--pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg-0)", margin: 0, letterSpacing: "-0.01em" }}>{s.name}</h3>
                <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 5, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: s.priceNum ? 22 : 17, letterSpacing: "-0.01em", color: "var(--accent-hover)" }}>{s.price}</span>
                  {s.monthly && <span style={{ fontSize: 13, color: "var(--fg-3)" }}>/ мес</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section style={{ background: "var(--ink-800)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap section">
          <div className="secthead">
            <span className="eyebrow">Отзывы</span>
            <h2>Нам доверяют рост выручки</h2>
          </div>
          <div className="grid-3" style={{ marginTop: 44 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card card--pad" style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "var(--accent-line)", display: "block", marginBottom: 16 }}><Icon name="quote" size={28} /></span>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--fg-1)", margin: "0 0 24px" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
                  <span className={`avatar${t.accent ? " avatar--accent" : ""}`}>{initials(t.name)}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-0)" }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: "var(--fg-3)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ maxWidth: 840, margin: "0 auto", paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}>
        <div className="secthead center">
          <span className="eyebrow">Вопросы</span>
          <h2>Частые вопросы</h2>
        </div>
        <Faq items={HOME_FAQ} />
      </section>

      {/* КОНТАКТЫ + КАРТА */}
      <section id="contacts" style={{ borderTop: "1px solid var(--line)", background: "var(--ink-800)" }}>
        <div className="wrap section">
          <div className="secthead">
            <span className="eyebrow">Контакты</span>
            <h2>Найти нас в Новороссийске</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 28, marginTop: 44 }} className="contacts-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "phone", label: "Телефон", value: CONTACT.phone },
                { icon: "mail", label: "Почта", value: CONTACT.email },
                { icon: "clock", label: "Режим работы", value: CONTACT.hours },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "var(--ink-700)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 20px" }}>
                  <span style={{ color: "var(--accent-hover)", marginTop: 2 }}><Icon name={row.icon} size={18} /></span>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 4 }}>{row.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg-0)" }}>{row.value}</div>
                  </div>
                </div>
              ))}
              <ConsultButton size="lg" block>Написать нам</ConsultButton>
              <span style={{ fontSize: 12, color: "var(--fg-4)", textAlign: "center" }}>Полный адрес и реквизиты — в подвале сайта</span>
            </div>
            {/* МЕСТО ПОД ЯНДЕКС-КАРТУ: замените блок на iframe виджета Яндекс.Карт с отметкой офиса */}
            <div style={{ position: "relative", minHeight: 380, borderRadius: 16, border: "1px dashed var(--line-strong)", background: "var(--ink-700)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: 32, overflow: "hidden" }}>
              <div className="grain" style={{ backgroundSize: "24px 24px" }} />
              <div style={{ position: "relative", width: 54, height: 54, borderRadius: 14, background: "var(--accent-soft)", border: "1px solid var(--accent-line)", color: "var(--accent-hover)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="mapPin" size={26} />
              </div>
              <div style={{ position: "relative", fontSize: 17, fontWeight: 700, color: "var(--fg-1)" }}>Здесь будет карта</div>
              <div style={{ position: "relative", fontSize: 13.5, lineHeight: 1.55, color: "var(--fg-3)", maxWidth: 340 }}>
                Вставьте код виджета Яндекс.Карт с отметкой офиса в Новороссийске. Этот блок полностью заменяется на iframe карты.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ paddingTop: "var(--section-y)" }} />
      <CtaSection title="Получите стратегию роста за 3 дня" text="Бесплатный разбор воронки и план первых гипотез. Без воды и презентаций ради презентаций." />

      <Footer />
    </>
  );
}

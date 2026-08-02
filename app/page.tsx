"use client";

import { useState } from "react";
import type { FormEvent, PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  CirclePlay,
  LineChart,
  Menu,
  Phone,
  Send,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { AnimatedFaq } from "@/components/animated-faq";
import {
  AnimatedMetricText,
  PageScrollProgress,
} from "@/components/premium-motion";

const services = [
  {
    slug: "performance",
    icon: Target,
    number: "01",
    title: "Перформанс-маркетинг",
    text: "Контекст, таргет и programmatic, которые приводят заявки и продажи. Управляем ставками по ROMI и LTV.",
    tags: ["Яндекс Директ", "VK Ads", "Оптимизация"],
  },
  {
    slug: "brand",
    icon: Sparkles,
    number: "02",
    title: "Бренд и креатив",
    text: "Позиционирование, айдентика и кампании, которые запоминают. Бренд, который продаёт, а не просто выглядит.",
    tags: ["Стратегия", "Айдентика", "Креатив"],
  },
  {
    slug: "smm",
    icon: Users,
    number: "03",
    title: "SMM и контент",
    text: "Системный контент и комьюнити, которые превращают подписчиков в клиентов, а внимание — в выручку.",
    tags: ["Контент", "Соцсети", "Комьюнити"],
  },
  {
    slug: "analytics",
    icon: LineChart,
    number: "04",
    title: "Аналитика и BI",
    text: "Сквозная аналитика, дашборды и атрибуция до выручки. Каждый рекламный рубль виден от клика до сделки.",
    tags: ["Дашборды", "Атрибуция", "ROMI"],
  },
];

const cases = [
  {
    slug: "dom-plus",
    tag: "E-commerce",
    metric: "ROMI 412%",
    title: "Рост заявок ×3.4 за квартал",
    text: "Перестроили performance-воронку и атрибуцию для бренда товаров для дома.",
    color: "blue",
  },
  {
    slug: "fintech-msb",
    tag: "Финтех",
    metric: "1 284 лида/мес",
    title: "CPA −38% при росте объёма",
    text: "Сегментная стратегия и креативный конвейер дали больше заявок без роста стоимости.",
    color: "cyan",
  },
  {
    slug: "edtech-school",
    tag: "EdTech",
    metric: "×6 трафик",
    title: "Запуск с нуля до лидера ниши",
    text: "Бренд, контент и платный трафик для нового образовательного проекта.",
    color: "violet",
  },
  {
    slug: "saas-mrr",
    tag: "SaaS",
    metric: "MRR ×2",
    title: "Снизили отток и удвоили MRR",
    text: "Перестроили онбординг и реактивацию через performance и контент.",
    color: "green",
  },
  {
    slug: "retail-omni",
    tag: "Ритейл",
    metric: "+31% выручка",
    title: "Омниканальный рост продаж",
    text: "Связали онлайн-рекламу с офлайн-чеками и геотаргетингом.",
    color: "gold",
  },
  {
    slug: "medtech-clinics",
    tag: "Медтех",
    metric: "−29% CPL",
    title: "Поток пациентов в дорогой нише",
    text: "Снизили стоимость заявки и автоматизировали путь до записи.",
    color: "orange",
  },
];

const steps = [
  ["01", "Аудит и стратегия", "Разбираем экономику, каналы и точки роста. Фиксируем KPI."],
  ["02", "Запуск", "Собираем команду и запускаем первые гипотезы за две недели."],
  ["03", "Оптимизация", "Еженедельные итерации по данным. Масштабируем то, что работает."],
  ["04", "Прозрачный отчёт", "Дашборд в реальном времени и понятная сводка по выручке."],
];

const standalone = [
  ["Ведение Яндекс Директ", "от 20 000 ₽ / мес"],
  ["Таргетированная реклама VK", "от 15 000 ₽ / мес"],
  ["SMM-ведение", "от 30 000 ₽ / мес"],
  ["SEO-оптимизация", "от 20 000 ₽"],
  ["Создание лендинга", "от 20 000 ₽"],
  ["Многостраничный сайт по ТЗ", "от 50 000 ₽"],
  ["Стратегия на 90 дней", "от 50 000 ₽"],
  ["Упаковка стартапа", "индивидуально"],
];

const faqs = [
  [
    "Сколько стоит и за что я плачу?",
    "Комплекс «Совет» — от 50 000 ₽ в месяц: стоимость зависит от состава команды и объёма задач. Рекламные бюджеты оплачиваются отдельно, без скрытого процента от расходов.",
  ],
  [
    "Когда будут первые результаты?",
    "Первые гипотезы запускаем за две недели. Значимые сдвиги по ключевым метрикам обычно видны к 4–6 неделе работы.",
  ],
  [
    "Вы работаете по KPI?",
    "Да. На старте фиксируем CPL, CPA, ROMI и LTV и отчитываемся по ним в прозрачном дашборде.",
  ],
  [
    "Кому принадлежат кабинеты и данные?",
    "Все рекламные аккаунты, кабинеты и данные остаются вашими. Работаем с полным доступом и прозрачностью.",
  ],
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
};

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Совет — на главную">
      <span className="logo-mark" aria-hidden="true"><i /><i /></span>
      <span>совет.</span>
    </a>
  );
}

function trackSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  event.currentTarget.style.setProperty("--spotlight-opacity", "1");
}

function hideSpotlight(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--spotlight-opacity", "0");
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <motion.div className="section-heading" {...reveal}>
      <div className="eyebrow"><span />{eyebrow}</div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function formatPhone(value: string) {
    const raw = value.replace(/\D/g, "");
    const digits = (raw.length > 10 && /^[78]/.test(raw) ? raw.slice(1) : raw).slice(0, 10);
    if (!digits) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 8) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phone.replace(/\D/g, "").length !== 10) {
      setFormState("error");
      return;
    }
    setFormState("sending");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+7 ${phone}`, source: "Главная страница" }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok || result?.delivered === false) throw new Error("Lead delivery failed");
      setFormState("sent");
      setPhone("");
    } catch {
      setFormState("error");
    }
  }

  return (
    <main id="top">
      <div className="guide guide-left" aria-hidden="true" />
      <div className="guide guide-right" aria-hidden="true" />

      <header className="site-header">
        <motion.div
          className="nav-wrap"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <PageScrollProgress />
          <Logo />
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#services">Услуги</a>
            <a href="#cases">Кейсы</a>
            <a href="#pricing">Тарифы</a>
            <a href="#approach">Подход</a>
            <a href="/blog">Блог</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <div className="nav-actions">
            <a className="phone-link" href="tel:+79180531553"><Phone size={15} />+7 918 053 15 53</a>
            <a className="pill-button compact" href="#contacts">Обсудить проект <ArrowRight size={15} /></a>
            <button
              className="menu-button"
              type="button"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </motion.div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav liquid-glass"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              aria-label="Мобильная навигация"
            >
              {["services", "cases", "pricing", "approach", "blog", "contacts"].map((id, index) => (
                <a key={id} href={id === "blog" ? "/blog" : `#${id}`} onClick={() => setMenuOpen(false)}>
                  {["Услуги", "Кейсы", "Тарифы", "Подход", "Блог", "Контакты"][index]}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="hero section-shell">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="eyebrow hero-eyebrow"><span />Маркетинговое агентство · Новороссийск</div>
          <h1>
            Маркетинг, который{" "}
            <em className="shiny-text">считает деньги</em>
          </h1>
          <p>
            Стратегия, реклама и аналитика в одной команде. Связываем каналы
            с обращениями и продажами — настолько глубоко, насколько позволяют данные.
          </p>
          <div className="hero-actions">
            <a className="pill-button" href="#contacts">Обсудить задачу <ArrowRight size={17} /></a>
            <a className="ghost-button" href="#cases"><CirclePlay size={17} /> Смотреть кейсы</a>
          </div>
          <div className="hero-stats">
            <div><b><AnimatedMetricText text="от 15 000 ₽" /></b><span>старт отдельных услуг</span></div>
            <div><b className="accent"><AnimatedMetricText text="1–2 недели" /></b><span>типовой запуск</span></div>
            <div><b>Россия</b><span>работаем удалённо</span></div>
          </div>
          <a className="hero-scroll-cue" href="#services">
            <span />
            Листайте, чтобы увидеть подход
          </a>
        </motion.div>
      </section>

      <section className="services section-shell" id="services">
        <SectionTitle
          eyebrow="Что мы делаем"
          title="Полный цикл — от стратегии до выручки"
          text="Одна команда закрывает performance, бренд и аналитику. Без подрядчиков-посредников."
        />
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                className="service-card liquid-glass interactive-spotlight"
                key={service.title}
                onPointerMove={trackSpotlight}
                onPointerLeave={hideSpotlight}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
              >
                <div className="service-top"><span className="service-icon"><Icon size={20} /></span><span>{service.number}</span></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="tag-row">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <a href={`/services/${service.slug}`}>Подробнее <ArrowRight size={14} /></a>
              </motion.article>
            );
          })}
        </div>
      </section>

      <motion.section className="number-band" {...reveal}>
        <div className="section-shell number-grid">
          <div><strong><AnimatedMetricText text="от 15 000 ₽" /></strong><span>отдельные услуги</span></div>
          <div><strong className="accent"><AnimatedMetricText text="от 50 000 ₽" /></strong><span>комплекс в месяц</span></div>
          <div><strong><AnimatedMetricText text="еженедельно" /></strong><span>оптимизация по данным</span></div>
          <div><strong><AnimatedMetricText text="1–2 недели" /></strong><span>типовой технический запуск</span></div>
        </div>
      </motion.section>

      <section className="cases section-shell" id="cases">
        <SectionTitle
          eyebrow="Кейсы"
          title="Результаты, а не отчёты о работе"
          text="Показываем, как маркетинг меняет бизнес-метрики — в цифрах."
        />
        <div className="case-grid">
          {cases.map((item, index) => (
            <motion.article
              className={`case-card liquid-glass interactive-spotlight case-${item.color}`}
              key={item.title}
              onPointerMove={trackSpotlight}
              onPointerLeave={hideSpotlight}
              {...reveal}
              transition={{ ...reveal.transition, delay: (index % 3) * 0.08 }}
            >
              <div className="case-visual"><span>{item.tag}</span><strong><AnimatedMetricText text={item.metric} /></strong></div>
              <div className="case-copy"><h3>{item.title}</h3><p>{item.text}</p><a href={`/cases/${item.slug}`}>Разобрать кейс <ArrowRight size={14} /></a></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="approach section-shell" id="approach">
        <SectionTitle eyebrow="Подход" title="Четыре шага до управляемого роста" />
        <div className="steps">
          {steps.map(([number, title, text], index) => (
            <motion.article key={number} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }}>
              <span>{number}</span><div className="step-line" /><h3>{title}</h3><p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="pricing section-shell" id="pricing">
        <SectionTitle
          eyebrow="Тарифы"
          title="Маркетинг как система, а не набор услуг"
          text="Фиксированная стоимость команды и прозрачный рекламный бюджет."
        />
        <motion.div className="pricing-card liquid-glass" {...reveal}>
          <span className="pricing-border-trail" aria-hidden="true" />
          <div className="pricing-glow" />
          <div className="pricing-intro">
            <div className="pricing-label"><span>Комплекс «Совет»</span><em>Выгоднее отдельных услуг</em></div>
            <h3><span><AnimatedMetricText text="от 50 000 ₽" /></span><small>/ месяц</small></h3>
            <p>Вся система маркетинга и продаж под ключ: аналитика, стратегия, реклама, лендинг и ежемесячная отчётность.</p>
            <a className="pill-button dark" href="#contacts">Обсудить комплекс <ArrowRight size={16} /></a>
          </div>
          <div className="pricing-features">
            {[
              "Аналитика и оптимизация каналов",
              "2ГИС и Яндекс Карты",
              "Анализ рынка и конкурентов",
              "Маркетинговая стратегия",
              "Креатив и лендинг",
              "Ведение Яндекс Директа",
              "Прогнозирование продаж",
              "Ежемесячная отчётность",
            ].map((item) => <div key={item}><span><Check size={13} /></span>{item}</div>)}
          </div>
        </motion.div>
        <motion.div className="standalone liquid-glass" {...reveal}>
          <div><div className="eyebrow"><span />Отдельные услуги</div><h3>Нужна конкретная задача?</h3></div>
          <div className="standalone-list">
            {standalone.map(([title, price]) => <div key={title}><span>{title}</span><strong>{price}</strong></div>)}
          </div>
        </motion.div>
      </section>

      <section className="testimonials section-shell">
        <SectionTitle eyebrow="Принципы" title="Что будет прозрачно с первого дня" />
        <div className="testimonial-grid">
          {[
            ["Экономика до каналов", "Сначала фиксируем маржу, допустимую стоимость клиента и ограничения отдела продаж."],
            ["Данные принадлежат вам", "Рекламные кабинеты, аналитика и история кампаний остаются в аккаунтах компании."],
            ["Выводы с оговорками", "Не выдаём ранние колебания за устойчивый рост и отдельно обозначаем ограничения измерения."],
          ].map(([title, text], index) => (
            <motion.article className="testimonial liquid-glass principle-card" key={title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }}>
              <span>0{index + 1}</span><h3>{title}</h3><p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="faq section-shell">
        <SectionTitle eyebrow="Вопросы" title="Частые вопросы" />
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <AnimatedFaq question={question} answer={answer} index={index} key={question} />
          ))}
        </div>
      </section>

      <section className="contact section-shell" id="contacts">
        <motion.div className="contact-card liquid-glass" {...reveal}>
          <div className="contact-copy">
            <div className="eyebrow"><span />Начнём с цифр</div>
            <h2>Начнём с задачи <em className="shiny-text">и экономики</em></h2>
            <p>Обсудим продукт, текущие каналы и данные. После разговора предложим следующий шаг: расчёт, аудит или план первых гипотез.</p>
            <div className="contact-meta">
              <a href="tel:+79180531553"><Phone size={16} />+7 918 053 15 53</a>
              <span>Ответим в течение рабочего дня</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="phone">Номер телефона</label>
            <div className="phone-field"><span>+7</span><input id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="(918) 000-00-00" value={phone} onChange={(event) => { setPhone(formatPhone(event.target.value)); setFormState("idle"); }} aria-invalid={formState === "error"} required /></div>
            <button className="pill-button" type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? "Отправляем…" : formState === "sent" ? "Заявка отправлена" : "Отправить заявку"}
              {formState === "sent" ? <Check size={17} /> : <Send size={17} />}
            </button>
            <small>
              {formState === "sent"
                ? "Спасибо! Свяжемся с вами в течение рабочего дня."
                : formState === "error"
                  ? "Не удалось отправить заявку. Проверьте номер или позвоните нам."
                  : <>Нажимая кнопку, вы даёте согласие на обработку номера телефона в соответствии с <a href="/privacy">политикой конфиденциальности</a>.</>}
            </small>
          </form>
        </motion.div>
      </section>

      <footer>
        <div className="section-shell footer-grid">
          <div><Logo /><p>Маркетинговое агентство полного цикла в Новороссийске. Работаем по всей России.</p></div>
          <div><span>Навигация</span><a href="#services">Услуги</a><a href="#cases">Кейсы</a><a href="#pricing">Тарифы</a></div>
          <div><span>Контакты</span><a href="tel:+79180531553">+7 918 053 15 53</a><a href="mailto:hello@sovet.ru">hello@sovet.ru</a><small>Пн–Пт, 09:00–18:00</small></div>
        </div>
        <div className="section-shell footer-bottom"><span>© 2026 Агентство «Совет»</span><a href="/privacy">Политика конфиденциальности</a><span>ИНН 231525948472 · ОГРНИП 326237500132941</span></div>
      </footer>
    </main>
  );
}

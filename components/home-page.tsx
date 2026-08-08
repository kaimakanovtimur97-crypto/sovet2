"use client";

import { useState } from "react";
import type { PointerEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  CirclePlay,
  Code2,
  LineChart,
  MapPin,
  Menu,
  MessagesSquare,
  Phone,
  Search,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { AnimatedFaq } from "@/components/animated-faq";
import { LeadForm } from "@/components/lead-form";
import { AnimatedMetricText, PageScrollProgress } from "@/components/premium-motion";
import { SiteFooter } from "@/components/site-chrome";
import { cases, services, site, standalonePrices } from "@/lib/site-data";

const serviceIcons = {
  "marketing-support": Users,
  "website-development": Code2,
  seo: Search,
  "yandex-direct": Target,
  "local-promotion": MapPin,
  smm: MessagesSquare,
  analytics: LineChart,
  brand: Sparkles,
} as const;

const serviceTags: Record<string, string[]> = {
  "marketing-support": ["Стратегия", "Управление", "Экономика"],
  "website-development": ["Лендинг", "Многостраничный", "SEO-ready"],
  seo: ["Техника", "Структура", "Контент"],
  "yandex-direct": ["Поиск", "РСЯ", "Оптимизация"],
  "local-promotion": ["Яндекс Карты", "2ГИС", "Отзывы"],
  smm: ["VK", "Telegram", "Контент"],
  analytics: ["Метрика", "CRM", "Дашборд"],
  brand: ["Позиционирование", "Айдентика", "Креатив"],
};

const conceptProjects = [
  {
    key: "concept-ecommerce",
    industry: "Концепт · E-commerce",
    fact: "Демо-концепт",
    title: "Воронка для бренда товаров для дома",
    description:
      "Демонстрационный сценарий: разделение категорий, рекламных кампаний и аналитики от запроса до заказа.",
    href: "/services/analytics",
    linkLabel: "Разобрать сценарий",
  },
  {
    key: "concept-medicine",
    industry: "Концепт · Медицина",
    fact: "Демо-концепт",
    title: "Система привлечения и записи для сети клиник",
    description:
      "Модель связки страниц услуг, Яндекс Директа, коллтрекинга и контроля записи — без заявлений о достигнутых показателях.",
    href: "/services/yandex-direct",
    linkLabel: "Разобрать сценарий",
  },
  {
    key: "concept-retail",
    industry: "Концепт · Локальный ритейл",
    fact: "Демо-концепт",
    title: "Продвижение сети магазинов по районам",
    description:
      "Сценарий с отдельными карточками точек, георекламой, актуальными данными на Картах и сверкой обращений с продажами.",
    href: "/services/local-promotion",
    linkLabel: "Разобрать сценарий",
  },
  {
    key: "concept-edtech",
    industry: "Концепт · EdTech",
    fact: "Демо-концепт",
    title: "Запуск маркетинга для онлайн-школы",
    description:
      "Пример системы из позиционирования, лендинга, контента, рекламы и аналитики — без вымышленного клиента и результата.",
    href: "/services/marketing-support",
    linkLabel: "Разобрать сценарий",
  },
];

const homepageProjects = [
  ...cases.map((item) => ({
    key: item.slug,
    industry: item.industry,
    fact: item.facts[0][0],
    title: item.title,
    description: item.description,
    href: `/cases/${item.slug}`,
    linkLabel: "Разобрать проект",
  })),
  ...conceptProjects,
];

const steps = [
  ["01", "Аудит и определения метрик", "Разбираем спрос, продукт, текущие каналы и договариваемся о значениях метрик."],
  ["02", "Приоритетный план", "Отделяем обязательную базу от гипотез и фиксируем ответственных, срок и критерий."],
  ["03", "Запуск и проверка", "Тестируем формы, обращения и качество данных до масштабирования бюджета."],
  ["04", "Решение по данным", "Продолжаем, меняем или останавливаем гипотезу с понятным объяснением."],
];

const faqs = [
  [
    "Сколько стоит и за что я плачу?",
    "Комплексное сопровождение начинается от 50 000 ₽ в месяц. Отдельные услуги указаны на странице цен. Рекламные бюджеты оплачиваются площадкам отдельно, а итоговый объём фиксируется после аудита.",
  ],
  [
    "Когда можно оценивать результат?",
    "Технический запуск типовой рекламной задачи часто занимает 1–2 недели. Для устойчивых выводов нужны данные и проверка качества обращений; сроки SEO зависят от переобхода, конкуренции и состояния сайта.",
  ],
  [
    "Вы гарантируете позиции или продажи?",
    "Нет. Мы гарантируем согласованный объём работы, прозрачную методику и проверку внедрения. Позиции и продажи зависят от алгоритмов, спроса, продукта, сезона и работы отдела продаж.",
  ],
  [
    "Кому принадлежат кабинеты и данные?",
    "Клиенту. Рекламные аккаунты, домен, аналитика и история кампаний остаются в ваших аккаунтах. Права доступа и порядок передачи фиксируются до старта.",
  ],
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Совет Маркетинг — на главную">
      <span className="logo-mark" aria-hidden="true"><i /><i /></span>
      <span>совет.</span>
    </Link>
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

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <motion.div className="section-heading" {...reveal}>
      <div className="eyebrow"><span />{eyebrow}</div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  );
}

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    ["Услуги", "/services"],
    ["Кейсы", "/cases"],
    ["Цены", "/prices"],
    ["География", "/regions"],
    ["Блог", "/blog"],
    ["Контакты", "/contacts"],
  ];

  return (
    <main id="top">
      <div className="guide guide-left" aria-hidden="true" />
      <div className="guide guide-right" aria-hidden="true" />

      <header className="site-header">
        <div className="nav-wrap">
          <PageScrollProgress />
          <Logo />
          <nav className="desktop-nav" aria-label="Основная навигация">
            {navItems.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
          <div className="nav-actions">
            <a className="phone-link" href={site.phoneHref}><Phone size={15} />{site.phone}</a>
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
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav liquid-glass"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              aria-label="Мобильная навигация"
            >
              {navItems.map(([label, href]) => (
                <Link href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span />Совет Маркетинг · Новороссийск</div>
          <h1>
            Маркетинговое агентство <em className="shiny-text">в Новороссийске</em>
          </h1>
          <p>
            Стратегия, сайты, реклама и аналитика в одной системе. Связываем каналы с обращениями и продажами —
            настолько глубоко, насколько позволяют проверенные данные.
          </p>
          <div className="hero-actions">
            <a className="pill-button" href="#contacts">Обсудить задачу <ArrowRight size={17} /></a>
            <Link className="ghost-button" href="/cases"><CirclePlay size={17} /> Публичные проекты</Link>
          </div>
          <div className="hero-stats">
            <div><b>Новороссийск</b><span>основной регион</span></div>
            <div><b className="accent"><AnimatedMetricText text="1–2 недели" /></b><span>типовой техзапуск</span></div>
            <div><b>Ваши кабинеты</b><span>доступы у клиента</span></div>
          </div>
          <a className="hero-scroll-cue" href="#services"><span />Посмотреть направления</a>
        </div>
      </section>

      <section className="services section-shell" id="services">
        <SectionTitle
          eyebrow="Что мы делаем"
          title="Всё необходимое для привлечения клиентов"
          text="Создаём сайты, настраиваем рекламу и SEO, развиваем присутствие в Яндекс Картах и 2ГИС. Объединяем каналы и аналитику, чтобы вы понимали, откуда приходят обращения и что работает лучше."
        />
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.slug as keyof typeof serviceIcons] || Target;
            return (
              <motion.article
                className="service-card liquid-glass interactive-spotlight"
                key={service.slug}
                onPointerMove={trackSpotlight}
                onPointerLeave={hideSpotlight}
                {...reveal}
                transition={{ ...reveal.transition, delay: (index % 4) * 0.05 }}
              >
                <div className="service-top"><span className="service-icon"><Icon size={20} /></span><span>{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{service.shortTitle}</h3>
                <p>{service.description}</p>
                <div className="tag-row">{serviceTags[service.slug]?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <Link href={`/services/${service.slug}`} aria-label={`Подробнее об услуге «${service.shortTitle}»`}>Подробнее <ArrowRight size={14} /></Link>
              </motion.article>
            );
          })}
        </div>
        <div className="section-more"><Link className="ghost-button" href="/services">Все услуги <ArrowRight size={16} /></Link></div>
      </section>

      <motion.section className="number-band" {...reveal}>
        <div className="section-shell number-grid">
          <div><strong><AnimatedMetricText text="от 20 000 ₽" /></strong><span>отдельные услуги</span></div>
          <div><strong className="accent"><AnimatedMetricText text="от 50 000 ₽" /></strong><span>комплекс в месяц</span></div>
          <div><strong>без гарантий ТОП</strong><span>честные ограничения</span></div>
          <div><strong>кабинеты клиента</strong><span>история и доступы у вас</span></div>
        </div>
      </motion.section>

      <section className="cases section-shell" id="cases">
        <SectionTitle
          eyebrow="Проекты и концепты"
          title="Реальная работа и понятные сценарии"
          text="У реальных проектов показываем подтверждение. Демонстрационные концепты всегда подписываем и не выдаём за клиентов или достигнутые результаты."
        />
        <div className="case-grid">
          {homepageProjects.map((item, index) => (
            <motion.article
              className={`case-card liquid-glass interactive-spotlight case-${index % 2 ? "cyan" : "blue"}`}
              key={item.key}
              onPointerMove={trackSpotlight}
              onPointerLeave={hideSpotlight}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.08 }}
            >
              <div className="case-visual"><span>{item.industry}</span><strong>{item.fact}</strong></div>
              <div className="case-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link href={item.href} aria-label={`${item.linkLabel} «${item.title}»`}>{item.linkLabel} <ArrowRight size={14} /></Link>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="section-more"><Link className="ghost-button" href="/cases">Как подтверждаем кейсы <ArrowRight size={16} /></Link></div>
      </section>

      <section className="approach section-shell" id="approach">
        <SectionTitle eyebrow="Подход" title="Четыре шага до проверяемой системы" />
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
          eyebrow="Цены"
          title="Понятная стоимость до начала работ"
          text="Сначала определяем задачи и объём, затем согласуем состав услуг, сроки и смету. Рекламный бюджет оплачивается отдельно и остаётся под вашим контролем."
        />
        <motion.div className="pricing-card liquid-glass" {...reveal}>
          <span className="pricing-border-trail" aria-hidden="true" />
          <div className="pricing-glow" />
          <div className="pricing-intro">
            <div className="pricing-label"><span>Маркетинговое сопровождение</span><em>План на 90 дней</em></div>
            <h3><span><AnimatedMetricText text="от 50 000 ₽" /></span><small>/ месяц</small></h3>
            <p>Единый план, приоритеты, управление выбранными каналами и отчёт по доступным первичным данным.</p>
            <a className="pill-button dark" href="#contacts">Обсудить комплекс <ArrowRight size={16} /></a>
          </div>
          <div className="pricing-features">
            {[
              "Ведение канала продаж",
              "Создание лендинга",
              "SEO-аудит и оптимизация",
              "Ведение Яндекс Директа",
              "Яндекс Карты и 2ГИС",
              "Контент и креативы",
              "Аналитика и отчётность",
              "Кабинеты принадлежат вам",
            ].map((item) => <div key={item}><span><Check size={13} /></span>{item}</div>)}
          </div>
        </motion.div>
        <motion.div className="standalone liquid-glass" {...reveal}>
          <div><div className="eyebrow"><span />Отдельные услуги</div><h3>Нужна конкретная задача?</h3></div>
          <div className="standalone-list">
            {standalonePrices.slice(0, 6).map(([title, price]) => <div key={title}><span>{title}</span><strong>{price}</strong></div>)}
          </div>
        </motion.div>
        <div className="section-more"><Link className="ghost-button" href="/prices">Все цены и условия <ArrowRight size={16} /></Link></div>
      </section>

      <section className="testimonials section-shell">
        <SectionTitle eyebrow="Принципы" title="Что будет прозрачно с первого дня" />
        <div className="testimonial-grid">
          {[
            ["Экономика до каналов", "Сначала фиксируем маржу, допустимую стоимость клиента и ограничения обработки обращений."],
            ["Данные принадлежат вам", "Рекламные кабинеты, домен, аналитика и история кампаний остаются у компании."],
            ["Выводы с оговорками", "Не выдаём цели на сайте за продажи и не публикуем кейсовые цифры без первичного источника."],
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
            <div className="eyebrow"><span />Начнём с задачи</div>
            <h2>Проверим базу <em className="shiny-text">до бюджета</em></h2>
            <p>Обсудим продукт, сайт, каналы и доступные данные. После разговора предложим следующий шаг: расчёт, аудит или план первых гипотез.</p>
            <div className="contact-meta">
              <a href={site.phoneHref}><Phone size={16} />{site.phone}</a>
              <span>{site.hours} · ответим в течение рабочего дня</span>
            </div>
          </div>
          <LeadForm source="Главная страница" />
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}

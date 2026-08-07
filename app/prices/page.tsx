import Link from "next/link";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { services, standalonePrices, site } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Цены на маркетинг, сайты, SEO и рекламу в Новороссийске",
  description:
    "Стартовые цены «Совет Маркетинг» и факторы расчёта: объём страниц, рекламные каналы, интеграции, данные и формат отчётности.",
  path: "/prices",
});

const estimateFactors = [
  {
    title: "Объём задачи",
    text: "Число услуг, страниц, рекламных направлений, материалов и согласований, необходимых для запуска.",
  },
  {
    title: "Исходное состояние",
    text: "Готовность сайта, карточек, аналитики, рекламных кабинетов и материалов клиента.",
  },
  {
    title: "Интеграции",
    text: "Формы, телефония, CRM, передача источников, цели и правила сверки обращений с продажами.",
  },
  {
    title: "Формат работы",
    text: "Разовая задача, запуск с последующим ведением или комплексное сопровождение нескольких направлений.",
  },
];

export default function PricesPage() {
  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Цены" }]} />
        <div className="eyebrow"><span />Цены</div>
        <h1>Стартовые цены и понятный расчёт</h1>
        <p>
          Значение «от» показывает нижнюю границу для базового объёма. Итоговую стоимость фиксируем после
          определения состава работ, исходных материалов, интеграций и сроков.
        </p>
        <div className="hero-actions">
          <Link className="pill-button" href="/contacts#form">Запросить расчёт</Link>
          <Link className="ghost-button" href="/services">Сравнить услуги</Link>
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="standalone liquid-glass">
          <div>
            <div className="eyebrow"><span />Ориентиры</div>
            <h3>Отдельные услуги</h3>
          </div>
          <div className="standalone-list">
            {standalonePrices.map(([title, price]) => (
              <div key={title}><span>{title}</span><strong>{price}</strong></div>
            ))}
          </div>
        </div>
        <p className="case-note">
          Рекламный бюджет и платные сторонние сервисы не включаются автоматически: их состав и порядок оплаты
          указываются в расчёте и договоре.
        </p>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Смета</div>
          <h2>Что влияет на стоимость</h2>
          <p>Одинаковое название услуги может скрывать разный объём, поэтому сначала фиксируем границы задачи.</p>
        </div>
        <div className="feature-grid">
          {estimateFactors.map((item, index) => (
            <article className="liquid-glass" key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Направления</div>
          <h2>Подробности по услугам</h2>
          <p>На странице каждой услуги описаны состав, процесс, формат отчётности и ограничения.</p>
        </div>
        <div className="related-grid">
          {services.map((service) => (
            <Link className="related-card liquid-glass" href={`/services/${service.slug}`} key={service.slug}>
              <span>{service.facts[0]?.[0] ?? "после аудита"}</span>
              <h3>{service.shortTitle}</h3>
              <p>{service.description}</p>
              <b>Что входит</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Перед стартом</div>
          <h2>Что будет в расчёте</h2>
        </div>
        <div className="fit-list">
          <p>Состав работ и ожидаемый результат каждого этапа.</p>
          <p>Сроки, зависимости от материалов клиента и порядок согласований.</p>
          <p>Стоимость работы агентства отдельно от рекламных бюджетов и сервисов.</p>
          <p>Условия изменения объёма после начала проекта.</p>
        </div>
      </section>

      <div className="section-shell cta-wrap">
        <section className="inner-cta liquid-glass">
          <div>
            <div className="eyebrow"><span />Расчёт</div>
            <h2>Получите смету под конкретную задачу</h2>
            <p>До разговора достаточно знать услугу, город и текущее состояние сайта или рекламных каналов.</p>
          </div>
          <div className="inner-cta-actions">
            <Link className="pill-button" href="/contacts#form">Оставить номер</Link>
            <a className="ghost-button" href={site.phoneHref}>{site.phone}</a>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

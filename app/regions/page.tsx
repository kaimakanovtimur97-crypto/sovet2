import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs, JsonLd, LeadCta, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { nearbyServiceAreas, regions, services, site } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Новороссийск и города Краснодарского края — география работы",
  description:
    "Создаём сайты, настраиваем SEO, Яндекс Директ и аналитику для бизнеса Новороссийска, Анапы, Геленджика, других городов Краснодарского края и России.",
  path: "/regions",
});

const featuredRegions = regions.filter(({ slug }) => ["anapa", "gelendzhik"].includes(slug));

export default function RegionsPage() {
  const url = absoluteUrl("/regions");
  const areaServed = [
    { "@type": "City", name: site.city },
    ...regions.map((region) => ({ "@type": "City", name: region.city })),
    ...nearbyServiceAreas.map((name) => ({ "@type": "Place", name })),
    { "@type": "AdministrativeArea", name: site.region },
    { "@type": "Country", name: "Россия" },
  ];

  return (
    <main className="inner-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site.url}/#organization`,
              name: site.name,
              legalName: site.legalName,
              url: site.url,
              telephone: site.phoneHref.replace("tel:", ""),
              email: site.email,
              areaServed,
            },
            {
              "@type": "CollectionPage",
              "@id": `${url}#page`,
              name: "География работы «Совет Маркетинг»",
              description:
                "Работаем с бизнесом Новороссийска, Краснодарского края и других регионов России: создаём сайты, настраиваем SEO, рекламу и аналитику.",
              url,
              inLanguage: "ru-RU",
              about: { "@id": `${site.url}/#organization` },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: featuredRegions.map((region, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: region.city,
                  url: absoluteUrl(`/regions/${region.slug}`),
                })),
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Главная", item: site.url },
                { "@type": "ListItem", position: 2, name: "География", item: url },
              ],
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "География" }]} />
        <div className="eyebrow"><span />География работы</div>
        <h1>Новороссийск и города края</h1>
        <p>
          Помогаем бизнесу привлекать клиентов с помощью сайтов, SEO, рекламы и аналитики. Основной город —
          Новороссийск; с компаниями из других городов Краснодарского края и России работаем онлайн, а выезд
          при необходимости согласуем отдельно.
        </p>
        <div className="hero-actions">
          <Link className="pill-button" href="/contacts#form">Обсудить задачу <ArrowRight size={17} /></Link>
          <Link className="ghost-button" href="/services">Выбрать услугу</Link>
        </div>
      </section>

      <section className="metric-strip section-shell" aria-label="География агентства">
        <div><strong>{site.city}</strong><span>основной город агентства</span></div>
        <div><strong>Краснодарский край</strong><span>работаем очно и дистанционно</span></div>
        <div><strong>Россия</strong><span>ведём проекты онлайн</span></div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />География</div>
          <h2>Работаем там, где находится ваш бизнес</h2>
          <p>Основная точка — Новороссийск. Проекты в Анапе, Геленджике, других городах края и России ведём дистанционно; выезд и съёмку согласуем отдельно.</p>
        </div>
        <div className="related-grid region-grid">
          <Link className="related-card liquid-glass" href="/">
            <span>Основной город</span>
            <h3>{site.city}</h3>
            <p>Помогаем местному бизнесу запускать сайты, получать трафик из SEO и Яндекс Директа и видеть путь заявки в аналитике.</p>
            <b>Подробнее <ArrowRight size={15} /></b>
          </Link>
          {featuredRegions.map((region) => (
            <Link className="related-card liquid-glass" href={`/regions/${region.slug}`} key={region.slug}>
              <span>Город края</span>
              <h3>{region.city}</h3>
              <p>{region.description}</p>
              <b>Открыть страницу <ArrowRight size={15} /></b>
            </Link>
          ))}
          <Link className="related-card liquid-glass" href="/contacts#form">
            <span>Другие города</span>
            <h3>Краснодарский край</h3>
            <p>Работаем с компаниями из городов и районов края: изучаем спрос, собираем сайт и подключаем подходящие каналы продвижения.</p>
            <b>Обсудить проект <ArrowRight size={15} /></b>
          </Link>
          <Link className="related-card liquid-glass" href="/contacts#form">
            <span>Удалённая работа</span>
            <h3>Россия</h3>
            <p>Подключаемся к проектам онлайн: проводим аудит, создаём лендинги и многостраничные сайты, ведём SEO, рекламу и аналитику.</p>
            <b>Обсудить онлайн <ArrowRight size={15} /></b>
          </Link>
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Рядом</div>
          <h2>Зона обслуживания без фиктивных офисов</h2>
          <p>Населённые пункты ниже — территория возможной работы, а не заявление о филиале.</p>
        </div>
        <div className="fit-list">
          {nearbyServiceAreas.map((area) => <p key={area}><Check size={17} />{area}</p>)}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Услуги для бизнеса</div>
          <h2>Соберём продвижение под вашу задачу</h2>
          <p>Можно заказать отдельную услугу или собрать комплекс: сайт, SEO, Яндекс Директ, продвижение в Картах, контент и аналитику. После короткого разбора предложим приоритеты, сроки и бюджет.</p>
        </div>
        <div className="related-grid">
          {services.map((service) => (
            <Link className="related-card liquid-glass" href={`/services/${service.slug}`} key={service.slug}>
              <span>Услуга</span>
              <h3>{service.shortTitle}</h3>
              <p>{service.description}</p>
              <b>Что входит <ArrowRight size={15} /></b>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

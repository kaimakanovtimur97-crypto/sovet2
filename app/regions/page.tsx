import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs, JsonLd, LeadCta, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { nearbyServiceAreas, regions, services, site } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "География работы — Новороссийск, Анапа и Геленджик",
  description:
    "«Совет Маркетинг» работает с бизнесом Новороссийска, Анапы, Геленджика и близлежащих населённых пунктов без фиктивных филиалов.",
  path: "/regions",
});

export default function RegionsPage() {
  const url = absoluteUrl("/regions");
  const areaServed = [
    { "@type": "City", name: site.city },
    ...regions.map((region) => ({ "@type": "City", name: region.city })),
    ...nearbyServiceAreas.map((name) => ({ "@type": "Place", name })),
    { "@type": "AdministrativeArea", name: site.region },
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
                "Новороссийск — основная точка агентства; с бизнесом Анапы и Геленджика работаем удалённо и с заранее согласованными выездами.",
              url,
              inLanguage: "ru-RU",
              about: { "@id": `${site.url}/#organization` },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: regions.map((region, index) => ({
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
        <div className="eyebrow"><span />Зона работы</div>
        <h1>Новороссийск — основная точка. Анапа и Геленджик — отдельные направления</h1>
        <p>
          Мы не создаём видимость филиалов, которых нет. Для каждого города честно описываем формат работы,
          локальный контекст и близлежащую зону обслуживания.
        </p>
        <div className="hero-actions">
          <Link className="pill-button" href="/contacts#form">Обсудить задачу <ArrowRight size={17} /></Link>
          <Link className="ghost-button" href="/services">Выбрать услугу</Link>
        </div>
      </section>

      <section className="metric-strip section-shell" aria-label="География агентства">
        <div><strong>{site.city}</strong><span>основная точка агентства</span></div>
        <div><strong>{regions.length} города</strong><span>с отдельным локальным контекстом</span></div>
        <div><strong>{nearbyServiceAreas.length}</strong><span>близлежащих направлений без тонких геостраниц</span></div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Города</div>
          <h2>Где и как мы работаем</h2>
          <p>Общие услуги едины, но спрос, сезонность и путь к обращению для каждого города разбираем отдельно.</p>
        </div>
        <div className="related-grid">
          <Link className="related-card liquid-glass" href="/">
            <span>Основная точка</span>
            <h3>{site.city}</h3>
            <p>Локальная база агентства: сайты, SEO, Яндекс Директ, Карты, SMM и аналитика.</p>
            <b>На главную <ArrowRight size={15} /></b>
          </Link>
          {regions.map((region) => (
            <Link className="related-card liquid-glass" href={`/regions/${region.slug}`} key={region.slug}>
              <span>Региональная страница</span>
              <h3>{region.city}</h3>
              <p>{region.description}</p>
              <b>Открыть страницу <ArrowRight size={15} /></b>
            </Link>
          ))}
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
          <div className="eyebrow"><span />Общие услуги</div>
          <h2>Одна система работы для всей географии</h2>
          <p>Региональная страница объясняет контекст, а состав и ограничения каждой услуги описаны на общей странице.</p>
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

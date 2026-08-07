import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  Breadcrumbs,
  JsonLd,
  LeadCta,
  SiteFooter,
  SiteHeader,
} from "@/components/site-chrome";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { services, site } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Услуги маркетингового агентства в Новороссийске",
  description:
    "Маркетинговое сопровождение, сайты, SEO, Яндекс Директ, продвижение на картах, SMM, аналитика и брендинг для бизнеса.",
  path: "/services",
});

export default function ServicesPage() {
  const url = absoluteUrl("/services");

  return (
    <main className="inner-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${url}#webpage`,
              name: "Услуги «Совет Маркетинг»",
              description:
                "Маркетинговые услуги для бизнеса в Новороссийске: от диагностики и сайта до рекламы и аналитики.",
              url,
              isPartOf: { "@id": `${site.url}/#website` },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Главная",
                  item: site.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Услуги",
                  item: url,
                },
              ],
            },
            {
              "@type": "ItemList",
              name: "Услуги агентства",
              numberOfItems: services.length,
              itemListElement: services.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: service.shortTitle,
                url: absoluteUrl(`/services/${service.slug}`),
              })),
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Услуги" }]}
        />
        <div className="eyebrow"><span />Что мы делаем</div>
        <h1>Маркетинговые услуги для бизнеса в Новороссийске</h1>
        <p>
          Начинаем не с набора каналов, а с задачи, спроса и доступных данных.
          Можно подключить отдельное направление или собрать единый план работ.
        </p>
        <div className="hero-actions">
          <Link className="pill-button" href="/contacts#form">
            Обсудить задачу <ArrowRight size={17} />
          </Link>
          <Link className="ghost-button" href="/cases">Посмотреть кейсы</Link>
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Направления</div>
          <h2>Выберите самостоятельную задачу</h2>
          <p>
            На каждой странице указаны состав работы, процесс, отчётность,
            ограничения и связанные материалы.
          </p>
        </div>
        <div className="related-grid">
          {services.map((service) => (
            <Link
              className="related-card liquid-glass"
              href={`/services/${service.slug}`}
              key={service.slug}
            >
              <span>{service.facts[0]?.[0] ?? "Услуга"}</span>
              <h3>{service.shortTitle}</h3>
              <p>{service.description}</p>
              <b>Подробнее <ArrowRight size={15} /></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Как выбрать</div>
          <h2>Сначала определяем ограничение</h2>
        </div>
        <div className="fit-list">
          <p><Check size={17} />Если спрос уже есть, проверяем рекламу, посадочную страницу и обработку обращений.</p>
          <p><Check size={17} />Если нужен устойчивый органический спрос, строим техническую и содержательную SEO-базу.</p>
          <p><Check size={17} />Если цифры расходятся, начинаем с карты данных, целей и CRM-статусов.</p>
        </div>
      </section>

      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

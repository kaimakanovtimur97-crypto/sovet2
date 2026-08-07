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
import { cases, site } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Проверяемые кейсы и проекты",
  description:
    "Подтверждённые проекты агентства: публичные сайты, локальная SEO-структура и проектные решения без неподтверждённых метрик.",
  path: "/cases",
});

export default function CasesPage() {
  const url = absoluteUrl("/cases");

  return (
    <main className="inner-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${url}#webpage`,
              name: "Кейсы «Совет Маркетинг»",
              description:
                "Подтверждённые проекты и проектные работы агентства с явными границами доказательств.",
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
                  name: "Кейсы",
                  item: url,
                },
              ],
            },
            {
              "@type": "ItemList",
              name: "Кейсы агентства",
              numberOfItems: cases.length,
              itemListElement: cases.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.title,
                url: absoluteUrl(`/cases/${item.slug}`),
              })),
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Кейсы" }]}
        />
        <div className="eyebrow"><span />Практика</div>
        <h1>Подтверждённые проекты и проектные работы</h1>
        <p>
          Показываем только то, что можно проверить. Публичный результат,
          выполненная работа и ограничения доказательств разделены явно.
        </p>
        <div className="hero-actions">
          <Link className="pill-button" href="/services">
            Выбрать услугу <ArrowRight size={17} />
          </Link>
          <Link className="ghost-button" href="/contacts#form">Обсудить проект</Link>
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Кейсы</div>
          <h2>Что было сделано</h2>
          <p>
            Внутри каждого кейса — задача, решение, этапы, факты и ссылка на
            публичный источник, когда он доступен.
          </p>
        </div>
        <div className="related-grid">
          {cases.map((item) => (
            <Link
              className="related-card liquid-glass"
              href={`/cases/${item.slug}`}
              key={item.slug}
            >
              <span>{item.industry} · {item.facts[0]?.[0]}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <b>Разобрать кейс <ArrowRight size={15} /></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Принцип</div>
          <h2>Не подменяем результат обещанием</h2>
        </div>
        <div className="fit-list">
          <p><Check size={17} />Публичный сайт подтверждает сам результат публикации, но не продажи клиента.</p>
          <p><Check size={17} />Проектная работа отделена от решений, уже внедрённых на действующем сайте.</p>
          <p><Check size={17} />Трафик, заявки и выручку публикуем только с согласованным периодом и источником.</p>
        </div>
      </section>

      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

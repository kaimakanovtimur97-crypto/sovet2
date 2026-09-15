import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Breadcrumbs,
  JsonLd,
  ContactCta,
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
                  item: absoluteUrl("/"),
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
          Сайт федерации, структура развлекательного центра и собственный
          интерфейс Nexum: посмотрите, как разные задачи определяют решение.
        </p>
        <div className="hero-actions">
          <Link className="pill-button" href="/services">
            Выбрать услугу <ArrowRight size={17} />
          </Link>
          <a className="ghost-button" href={site.phoneHref}>Позвонить</a>
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Кейсы</div>
          <h2>Что было сделано</h2>
          <p>
            Выберите близкую задачу: многостраничный сайт, проектирование
            страниц услуг или компактная визуальная презентация.
          </p>
        </div>
        <div className="related-grid">
          {cases.map((item) => (
            <Link
              className="related-card liquid-glass"
              href={`/cases/${item.slug}`}
              key={item.slug}
            >
              {item.images?.[0] && <img className="project-preview" src={item.images[0].src} alt={item.images[0].alt} width={item.images[0].width} height={item.images[0].height} loading="lazy" />}
              <span>{item.industry} · {item.slug === "kosmodrom-seo-structure" ? "Локальная разработка" : item.slug === "nexum-ai-ops" ? "Собственный спецпроект" : "Опубликованный сайт"}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <b>Разобрать кейс <ArrowRight size={15} /></b>
            </Link>
          ))}
        </div>
      </section>

      <div className="section-shell cta-wrap"><ContactCta /></div>
      <SiteFooter />
    </main>
  );
}

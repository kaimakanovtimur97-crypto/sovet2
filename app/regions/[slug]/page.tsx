import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { AnimatedFaq } from "@/components/animated-faq";
import { Breadcrumbs, JsonLd, LeadCta, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { getRegion, regions, services, site } from "@/lib/site-data";

export function generateStaticParams() {
  return regions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const region = getRegion((await params).slug);
  if (!region) return {};

  return buildMetadata({
    title: region.title,
    description: region.description,
    path: `/regions/${region.slug}`,
  });
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const region = getRegion((await params).slug);
  if (!region) notFound();

  const url = absoluteUrl(`/regions/${region.slug}`);
  const regionsUrl = absoluteUrl("/regions");
  const organizationAreaServed = [
    { "@type": "City", name: site.city },
    { "@type": "City", name: region.city },
    ...region.nearby.map((name) => ({ "@type": "Place", name })),
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
              areaServed: organizationAreaServed,
            },
            {
              "@type": "WebPage",
              "@id": `${url}#page`,
              url,
              name: region.title,
              description: region.description,
              inLanguage: "ru-RU",
              about: { "@type": "City", name: region.city },
              publisher: { "@id": `${site.url}/#organization` },
              isPartOf: { "@id": `${site.url}/#website` },
              dateModified: region.updatedAt,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Главная", item: site.url },
                { "@type": "ListItem", position: 2, name: "География", item: regionsUrl },
                { "@type": "ListItem", position: 3, name: region.city, item: url },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: region.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "География", href: "/regions" }, { label: region.city }]} />
        <div className="eyebrow"><span />Региональное направление</div>
        <h1>{region.title}</h1>
        <p>{region.lead}</p>
        <div className="hero-actions">
          <Link className="pill-button" href="/contacts#form">Обсудить проект в {region.city} <ArrowRight size={17} /></Link>
          <Link className="ghost-button" href="/services">Смотреть услуги</Link>
        </div>
      </section>

      <section className="metric-strip section-shell" aria-label={`Формат работы в ${region.city}`}>
        <div><strong>{region.city}</strong><span>отдельный локальный контекст</span></div>
        <div><strong>{site.city}</strong><span>основная точка агентства</span></div>
        <div><strong>{region.nearby.length}</strong><span>близлежащих направления в зоне работы</span></div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Контекст</div>
          <h2>Что учитываем для бизнеса в {region.city}</h2>
        </div>
        <div className="fit-list">
          {region.context.map((item) => <p key={item}><Check size={17} />{item}</p>)}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Приоритеты</div>
          <h2>С чего начинаем</h2>
          <p>Набор каналов зависит от ниши и исходных данных. До запуска отделяем обязательную базу от гипотез.</p>
        </div>
        <div className="feature-grid">
          {region.priorities.map((priority, index) => (
            <article className="liquid-glass" key={priority.title}>
              <span>0{index + 1}</span>
              <h3>{priority.title}</h3>
              <p>{priority.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Формат</div>
          <h2>Как проходит работа</h2>
          <p>Удалённый формат не меняет владение доменом, кабинетами и данными: они остаются у клиента.</p>
        </div>
        <div className="fit-list">
          {region.format.map((item) => <p key={item}><Check size={17} />{item}</p>)}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Услуги</div>
          <h2>Общие услуги агентства</h2>
          <p>Состав работ, цены, ограничения и отчётность описаны на общих страницах услуг — без копий под каждый город.</p>
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

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Рядом</div>
          <h2>Близлежащие направления</h2>
          <p>Это зона возможной работы, а не филиалы «{site.name}». Отдельные SEO-страницы для них не создаём без самостоятельного спроса и полезного материала.</p>
        </div>
        <div className="fit-list">
          {region.nearby.map((area) => <p key={area}><Check size={17} />{area}</p>)}
        </div>
      </section>

      <section className="inner-section section-shell faq-inner">
        <div className="inner-heading">
          <div className="eyebrow"><span />Вопросы</div>
          <h2>Перед стартом в {region.city}</h2>
        </div>
        <div>
          {region.faq.map((item, index) => (
            <AnimatedFaq question={item.question} answer={item.answer} index={index} key={item.question} />
          ))}
        </div>
      </section>

      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

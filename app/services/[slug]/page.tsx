import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs, JsonLd, LeadCta, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { cases, getService, services, site } from "@/lib/site-data";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `/services/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const related = cases.filter((item) => service.relatedCases.includes(item.slug));
  const url = `${site.url}/services/${service.slug}`;

  return (
    <main className="inner-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${url}#service`,
            name: service.title,
            description: service.description,
            areaServed: [{ "@type": "City", name: "Новороссийск" }, { "@type": "AdministrativeArea", name: "Краснодарский край" }],
            provider: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name, url: site.url },
            url,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: site.url },
              { "@type": "ListItem", position: 2, name: "Услуги", item: `${site.url}/#services` },
              { "@type": "ListItem", position: 3, name: service.shortTitle, item: url },
            ],
          },
          {
            "@type": "FAQPage",
            mainEntity: service.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ],
      }} />
      <SiteHeader />
      <section className="inner-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Услуги", href: "/#services" }, { label: service.shortTitle }]} />
        <div className="eyebrow"><span />Услуга агентства</div>
        <h1>{service.title}</h1>
        <p>{service.lead}</p>
        <div className="hero-actions">
          <Link className="pill-button" href="/#contacts">Получить план запуска <ArrowRight size={17} /></Link>
          <Link className="ghost-button" href="/#cases">Посмотреть кейсы</Link>
        </div>
      </section>

      <section className="metric-strip section-shell" aria-label="Показатели">
        {service.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Когда подходит</div>
          <h2>Задача, которую можно измерить</h2>
        </div>
        <div className="fit-list">
          {service.fits.map((item) => <p key={item}><Check size={17} />{item}</p>)}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Состав работы</div>
          <h2>Что входит</h2>
          <p>Конкретный объём фиксируем после аудита, чтобы состав работ соответствовал задаче, а не универсальному пакету.</p>
        </div>
        <div className="feature-grid">
          {service.includes.map((item, index) => (
            <article className="liquid-glass" key={item.title}>
              <span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Процесс</div>
          <h2>Как строится работа</h2>
        </div>
        <div className="process-grid">
          {service.process.map((item, index) => (
            <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Практика</div>
          <h2>Связанные кейсы</h2>
        </div>
        <div className="related-grid">
          {related.map((item) => (
            <Link className="related-card liquid-glass" href={`/cases/${item.slug}`} key={item.slug}>
              <span>{item.industry}</span><h3>{item.title}</h3><p>{item.description}</p><b>Разобрать кейс <ArrowRight size={15} /></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell faq-inner">
        <div className="inner-heading">
          <div className="eyebrow"><span />Вопросы</div>
          <h2>Перед стартом</h2>
        </div>
        <div>
          {service.faq.map((item) => <details className="liquid-glass" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
        </div>
      </section>

      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

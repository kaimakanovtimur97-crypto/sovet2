import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import {
  Breadcrumbs,
  JsonLd,
  LeadCta,
  SiteFooter,
  SiteHeader,
} from "@/components/site-chrome";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import {
  blogPosts,
  cases,
  getService,
  services,
  site,
} from "@/lib/site-data";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const requestedSlug = (await params).slug;
  const service = getService(requestedSlug);
  if (!service) return {};

  return buildMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const url = absoluteUrl(`/services/${service.slug}`);
  const relatedCases = cases.filter((item) =>
    service.relatedCases.includes(item.slug),
  );
  const relatedPosts = blogPosts.filter((post) =>
    service.relatedPosts.includes(post.slug),
  );

  return (
    <main className="inner-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${url}#service`,
              name: service.title,
              serviceType: service.shortTitle,
              description: service.description,
              areaServed: [
                { "@type": "City", name: site.city },
                { "@type": "AdministrativeArea", name: site.region },
              ],
              provider: {
                "@type": "Organization",
                "@id": `${site.url}/#organization`,
                name: site.name,
                url: site.url,
              },
              url,
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
                  item: absoluteUrl("/services"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: service.shortTitle,
                  item: url,
                },
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
        }}
      />
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Услуги", href: "/services" },
            { label: service.shortTitle },
          ]}
        />
        <div className="eyebrow"><span />Услуга агентства</div>
        <h1>{service.title}</h1>
        <p>{service.lead}</p>
        <div className="hero-actions">
          <Link className="pill-button" href="/contacts#form">
            Обсудить задачу <ArrowRight size={17} />
          </Link>
          <Link className="ghost-button" href="/cases">Посмотреть кейсы</Link>
        </div>
      </section>

      <section className="metric-strip section-shell" aria-label="Факты об услуге">
        {service.facts.map(([value, label]) => (
          <div key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Когда подходит</div>
          <h2>Задача, которую можно проверить</h2>
        </div>
        <div className="fit-list">
          {service.fits.map((item) => (
            <p key={item}><Check size={17} />{item}</p>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Состав работы</div>
          <h2>Что входит</h2>
          <p>
            Конкретный объём фиксируем после диагностики, чтобы работа
            соответствовала задаче, а не универсальному пакету.
          </p>
        </div>
        <div className="feature-grid">
          {service.includes.map((item, index) => (
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
          <div className="eyebrow"><span />Процесс</div>
          <h2>Как строится работа</h2>
        </div>
        <div className="process-grid">
          {service.process.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Отчётность</div>
          <h2>Что остаётся у клиента</h2>
        </div>
        <div className="fit-list">
          {service.reporting.map((item) => (
            <p key={item}><Check size={17} />{item}</p>
          ))}
        </div>
      </section>

      {relatedCases.length > 0 && (
        <section className="inner-section section-shell">
          <div className="inner-heading">
            <div className="eyebrow"><span />Практика</div>
            <h2>Связанные кейсы</h2>
          </div>
          <div className="related-grid">
            {relatedCases.map((item) => (
              <Link
                className="related-card liquid-glass"
                href={`/cases/${item.slug}`}
                key={item.slug}
              >
                <span>{item.industry}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <b>Разобрать кейс <ArrowRight size={15} /></b>
              </Link>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="ghost-button" href="/cases">Все кейсы</Link>
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="inner-section section-shell">
          <div className="inner-heading">
            <div className="eyebrow"><span />Разобраться</div>
            <h2>Материалы по теме</h2>
          </div>
          <div className="related-grid">
            {relatedPosts.map((post) => (
              <Link
                className="related-card liquid-glass"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <span>{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <b>Читать <ArrowRight size={15} /></b>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="inner-section section-shell faq-inner">
        <div className="inner-heading">
          <div className="eyebrow"><span />Вопросы</div>
          <h2>Перед стартом</h2>
          <p>Ответы полностью доступны в исходном HTML страницы.</p>
        </div>
        <div className="feature-grid">
          {service.faq.map((item, index) => (
            <article className="liquid-glass" key={item.question}>
              <span>0{index + 1}</span>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

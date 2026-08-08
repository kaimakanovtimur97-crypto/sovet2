import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
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
  getCase,
  services,
  site,
} from "@/lib/site-data";

export function generateStaticParams() {
  return cases.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = getCase((await params).slug);
  if (!item) return {};

  return buildMetadata({
    title: `${item.client} — кейс`,
    description: item.description,
    path: `/cases/${item.slug}`,
  });
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getCase((await params).slug);
  if (!item) notFound();

  const url = absoluteUrl(`/cases/${item.slug}`);
  const relatedCases = cases.filter((entry) => entry.slug !== item.slug);
  const relatedServices = services.filter((service) =>
    service.relatedCases.includes(item.slug),
  );
  const relatedServiceSlugs = new Set(
    relatedServices.map((service) => service.slug),
  );
  const relatedPosts = blogPosts
    .filter((post) =>
      post.relatedServices.some((slug) => relatedServiceSlugs.has(slug)),
    )
    .slice(0, 3);

  return (
    <main className="inner-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CreativeWork",
              "@id": `${url}#case`,
              name: item.title,
              description: item.description,
              about: item.industry,
              dateModified: item.updatedAt,
              creator: {
                "@type": "Organization",
                "@id": `${site.url}/#organization`,
                name: site.name,
              },
              url,
              ...(item.proofUrl ? { sameAs: item.proofUrl } : {}),
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
                  item: absoluteUrl("/cases"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: item.client,
                  item: url,
                },
              ],
            },
          ],
        }}
      />
      <SiteHeader />

      <section className="inner-hero case-hero section-shell">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Кейсы", href: "/cases" },
            { label: item.client },
          ]}
        />
        <div className="eyebrow"><span />{item.industry} · {item.client}</div>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <div className="hero-actions">
          {item.proofUrl && (
            <a
              className="pill-button"
              href={item.proofUrl}
              target="_blank"
              rel="noreferrer"
            >
              {item.proofLabel ?? "Открыть публичный результат"}
              <ExternalLink size={16} />
            </a>
          )}
          <Link className="ghost-button" href="/services">Все услуги</Link>
        </div>
      </section>

      <section className="metric-strip section-shell" aria-label="Факты проекта">
        {item.facts.map(([value, label]) => (
          <div key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>

      <section className="inner-section section-shell case-story">
        <article>
          <span>01 · Задача</span>
          <h2>С чего начали</h2>
          <p>{item.challenge}</p>
        </article>
        <article>
          <span>02 · Решение</span>
          <h2>Что подготовили</h2>
          <p>{item.solution}</p>
        </article>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Ход работы</div>
          <h2>Как строился проект</h2>
        </div>
        <div className="process-grid">
          {item.steps.map((step, index) => (
            <article key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
        <p className="case-note">{item.note}</p>
      </section>

      {relatedServices.length > 0 && (
        <section className="inner-section section-shell">
          <div className="inner-heading">
            <div className="eyebrow"><span />По задаче</div>
            <h2>Связанные услуги</h2>
          </div>
          <div className="related-grid">
            {relatedServices.map((service) => (
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

      {relatedCases.length > 0 && (
        <section className="inner-section section-shell">
          <div className="inner-heading">
            <div className="eyebrow"><span />Продолжить</div>
            <h2>Другие кейсы</h2>
          </div>
          <div className="related-grid">
            {relatedCases.map((entry) => (
              <Link
                className="related-card liquid-glass"
                href={`/cases/${entry.slug}`}
                key={entry.slug}
              >
                <span>{entry.industry}</span>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <b>Разобрать кейс <ArrowRight size={15} /></b>
              </Link>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="ghost-button" href="/cases">Все кейсы</Link>
          </div>
        </section>
      )}

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Доказательства</div>
          <h2>Что подтверждает этот кейс</h2>
        </div>
        <div className="fit-list">
          {item.facts.map(([value, label]) => (
            <p key={`${value}-${label}`}><Check size={17} /><strong>{value}</strong> — {label}</p>
          ))}
        </div>
      </section>

      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

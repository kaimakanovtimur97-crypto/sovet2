import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, JsonLd, LeadCta, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { cases, getCase, site } from "@/lib/site-data";

export function generateStaticParams() {
  return cases.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = getCase((await params).slug);
  if (!item) return {};
  return {
    title: `${item.title} — кейс агентства «Совет»`,
    description: item.description,
    alternates: { canonical: `/cases/${item.slug}` },
    openGraph: { title: item.title, description: item.description, url: `/cases/${item.slug}`, type: "article" },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getCase((await params).slug);
  if (!item) notFound();
  const related = cases.filter((entry) => entry.slug !== item.slug).slice(0, 3);
  const url = `${site.url}/cases/${item.slug}`;

  return (
    <main className="inner-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CreativeWork", "@id": `${url}#case`, name: item.title, description: item.description, about: item.industry, creator: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name }, url },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: site.url },
            { "@type": "ListItem", position: 2, name: "Кейсы", item: `${site.url}/#cases` },
            { "@type": "ListItem", position: 3, name: item.client, item: url },
          ] },
        ],
      }} />
      <SiteHeader />
      <section className="inner-hero case-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Кейсы", href: "/#cases" }, { label: item.client }]} />
        <div className="eyebrow"><span />{item.industry} · {item.client}</div>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
      </section>
      <section className="metric-strip section-shell">
        {item.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>
      <section className="inner-section section-shell case-story">
        <article><span>01 · Задача</span><h2>С чего начали</h2><p>{item.challenge}</p></article>
        <article><span>02 · Решение</span><h2>Что изменили</h2><p>{item.solution}</p></article>
      </section>
      <section className="inner-section section-shell">
        <div className="inner-heading"><div className="eyebrow"><span />Ход работы</div><h2>Как пришли к результату</h2></div>
        <div className="process-grid">
          {item.steps.map((step, index) => <article key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
        </div>
        <p className="case-note">{item.note}</p>
      </section>
      <section className="inner-section section-shell">
        <div className="inner-heading"><div className="eyebrow"><span />Продолжить</div><h2>Другие кейсы</h2></div>
        <div className="related-grid">
          {related.map((entry) => <Link className="related-card liquid-glass" href={`/cases/${entry.slug}`} key={entry.slug}><span>{entry.industry}</span><h3>{entry.title}</h3><p>{entry.description}</p><b>Разобрать кейс <ArrowRight size={15} /></b></Link>)}
        </div>
      </section>
      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, JsonLd, LeadCta, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { blogPosts, getPost, site } from "@/lib/site-data";

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, url: `/blog/${post.slug}`, type: "article", publishedTime: post.dateIso },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const related = blogPosts.filter((item) => item.slug !== post.slug);
  const url = `${site.url}/blog/${post.slug}`;
  return (
    <main className="inner-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "BlogPosting", "@id": `${url}#article`, headline: post.title, description: post.description, datePublished: post.dateIso, dateModified: post.dateIso, inLanguage: "ru-RU", mainEntityOfPage: url, author: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name }, publisher: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name }, image: `${site.url}/og.png` },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: site.url },
            { "@type": "ListItem", position: 2, name: "Блог", item: `${site.url}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ] },
        ],
      }} />
      <SiteHeader />
      <article className="article-shell section-shell">
        <header className="article-header">
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Блог", href: "/blog" }, { label: post.category }]} />
          <div className="article-meta"><span>{post.category}</span><time dateTime={post.dateIso}>{post.date}</time><span>{post.readTime}</span></div>
          <h1>{post.title}</h1>
          <p>{post.intro}</p>
        </header>
        <div className="article-layout">
          <aside>
            <span>В материале</span>
            {post.sections.map((section) => <a href={`#${section.title.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-")}`} key={section.title}>{section.title}</a>)}
          </aside>
          <div className="article-content">
            {post.sections.map((section) => {
              const id = section.title.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-");
              return (
                <section id={id} key={section.title}>
                  <h2>{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                </section>
              );
            })}
            <div className="article-disclaimer">
              <strong>Важно</strong>
              <p>Цены и рыночные ориентиры в статье актуальны на дату публикации и не являются гарантией результата. Перед запуском нужен расчёт по конкретной нише, географии и воронке.</p>
            </div>
          </div>
        </div>
      </article>
      <section className="inner-section section-shell">
        <div className="inner-heading"><div className="eyebrow"><span />Читайте также</div><h2>Другие материалы</h2></div>
        <div className="related-grid">
          {related.map((item) => <Link className="related-card liquid-glass" href={`/blog/${item.slug}`} key={item.slug}><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p><b>Читать <ArrowRight size={15} /></b></Link>)}
        </div>
      </section>
      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

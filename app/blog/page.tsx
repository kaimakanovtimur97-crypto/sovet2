import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, JsonLd, LeadCta, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { buildMetadata } from "@/lib/seo";
import { blogPosts, site } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Блог о маркетинге для бизнеса в Новороссийске",
  description: "Практические материалы «Совет Маркетинг» о рекламе, SEO, локальном продвижении, сайтах и аналитике.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <main className="inner-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Блог «Совет Маркетинг»",
        url: `${site.url}/blog`,
        publisher: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name },
        blogPost: blogPosts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: `${site.url}/blog/${post.slug}`,
          datePublished: post.dateIso,
          dateModified: post.updatedIso,
        })),
      }} />
      <SiteHeader />
      <section className="inner-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Блог" }]} />
        <div className="eyebrow"><span />Практика</div>
        <h1>Блог о маркетинге для бизнеса</h1>
        <p>Разбираем рекламу, сайты, SEO и локальное продвижение через задачи, источники данных и ограничения — без универсальных обещаний.</p>
      </section>
      <section className="inner-section section-shell blog-grid">
        {blogPosts.map((post) => (
          <article className="blog-card liquid-glass" key={post.slug}>
            <div><span>{post.category}</span><time dateTime={post.updatedIso}>Обновлено {post.updatedDate}</time></div>
            <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p>{post.description}</p>
            <Link href={`/blog/${post.slug}`}>Читать · {post.readTime} <ArrowRight size={15} /></Link>
          </article>
        ))}
      </section>
      <div className="section-shell cta-wrap"><LeadCta /></div>
      <SiteFooter />
    </main>
  );
}

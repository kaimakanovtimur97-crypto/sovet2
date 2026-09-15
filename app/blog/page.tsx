import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, ContactCta, JsonLd, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { blogPosts, site } from "@/lib/site-data";

export const metadata: Metadata = buildMetadata({
  title: "Блог о маркетинге для бизнеса в Новороссийске",
  description: "Практические материалы «Совет Маркетинг» о рекламе, SEO, локальном продвижении, сайтах и аналитике.",
  path: "/blog",
});

export default function BlogPage() {
  const readerTasks: Record<string, string> = {
    "skolko-stoit-yandex-direct-novorossiysk": "Оценить бюджет: рассчитать три условных сценария стоимости обращения",
    "prodvizhenie-2gis-yandex-karty-novorossiysk": "Проверить Карты: пройти чек-лист и записать нужные исправления",
    "landing-ili-mnogostranichny-sait": "Выбрать сайт: сравнить форматы по пяти вопросам",
    "seo-ili-yandex-direct-novorossiysk": "Выбрать канал: определить первый шаг по готовности бизнеса",
    "metrika-crm-i-prodazhi": "Разобраться в цифрах: отделить контактный клик от сделки",
  };
  return (
    <main className="inner-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Блог «Совет Маркетинг»",
        url: absoluteUrl("/blog"),
        publisher: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name },
        blogPost: blogPosts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: absoluteUrl(`/blog/${post.slug}`),
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
            <p>{readerTasks[post.slug] ?? post.description}</p>
            <Link href={`/blog/${post.slug}`}>Читать · {post.readTime} <ArrowRight size={15} /></Link>
          </article>
        ))}
      </section>
      <div className="section-shell cta-wrap"><ContactCta /></div>
      <SiteFooter />
    </main>
  );
}

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { POSTS, getPost, type PostBlock } from "@/lib/posts";
import { CONTACT } from "@/lib/data";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.metaTitle, description: post.description, url: `/blog/${post.slug}`, type: "article", locale: "ru_RU", publishedTime: post.date },
  };
}

function Block({ b }: { b: PostBlock }) {
  switch (b.t) {
    case "h2": return <h2>{b.text}</h2>;
    case "h3": return <h3>{b.text}</h3>;
    case "ul": return <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    case "note": return <div className="article-note">{b.text}</div>;
    default: return <p>{b.text}</p>;
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const base = CONTACT.siteUrl.replace(/\/$/, "");
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: "ru-RU",
      mainEntityOfPage: `${base}/blog/${post.slug}`,
      author: { "@type": "Organization", name: "Совет — маркетинговое агентство", url: base },
      publisher: { "@type": "Organization", name: "Совет — маркетинговое агентство", url: base },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Блог", item: `${base}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${base}/blog/${post.slug}` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <section className="wrap" style={{ paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(48px,7vw,88px)" }}>
        <article className="article" style={{ maxWidth: 760, margin: "0 auto" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg-3)", marginBottom: 28, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--fg-3)" }}>Главная</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: "var(--fg-3)" }}>Блог</Link>
            <span>/</span>
            <span style={{ color: "var(--fg-1)" }}>{post.tag}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <span className="badge">{post.tag}</span>
            <span style={{ fontSize: 13, color: "var(--fg-4)" }}>{post.dateLabel} · {post.readTime} чтения</span>
          </div>
          <h1 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.12, color: "var(--fg-0)", margin: "0 0 28px" }}>{post.title}</h1>
          {post.blocks.map((b, i) => <Block key={i} b={b} />)}

          {related.length > 0 && (
            <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 18 }}>Читайте также</div>
              <div style={{ display: "grid", gap: 12 }}>
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="card card--int" style={{ padding: "16px 20px", display: "block" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg-0)" }}>{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
      <CtaSection title="Получите стратегию роста за 3 дня" text="Бесплатный разбор воронки и план первых гипотез — под ваш бизнес и ваш бюджет." />
      <Footer />
    </>
  );
}

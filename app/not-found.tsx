import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <section className="inner-hero section-shell not-found">
        <div className="eyebrow"><span />Ошибка 404</div>
        <h1>Такой страницы нет</h1>
        <p>Возможно, адрес изменился. Вернитесь на главную или посмотрите материалы в блоге.</p>
        <div className="hero-actions"><Link className="pill-button" href="/">На главную</Link><Link className="ghost-button" href="/blog">В блог</Link></div>
      </section>
      <SiteFooter />
    </main>
  );
}

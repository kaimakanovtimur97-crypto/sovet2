import type { Metadata } from "next";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных на сайте агентства «Совет».",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <article className="article-shell section-shell legal-copy">
        <header className="article-header">
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Политика конфиденциальности" }]} />
          <h1>Политика конфиденциальности</h1>
          <p>Краткие условия обработки данных, которые посетитель добровольно передаёт через сайт.</p>
        </header>
        <div className="article-content">
          <section><h2>Оператор</h2><p>{site.legalName}, ИНН {site.inn}, ОГРНИП {site.ogrnip}. Контакт для вопросов: <a href={`mailto:${site.email}`}>{site.email}</a>.</p></section>
          <section><h2>Какие данные обрабатываются</h2><p>Имя, номер телефона, адрес электронной почты и содержание обращения — только если посетитель передал их самостоятельно. Технические данные могут обрабатываться сервером и подключёнными системами аналитики.</p></section>
          <section><h2>Цель обработки</h2><p>Ответить на обращение, подготовить предложение, обеспечить работу сайта и оценить эффективность его страниц. Данные не используются для целей, несовместимых с указанными.</p></section>
          <section><h2>Срок и прекращение обработки</h2><p>Данные хранятся не дольше, чем требуется для цели обращения и выполнения обязательных требований закона. Согласие можно отозвать письмом на {site.email}.</p></section>
          <section><h2>Передача третьим лицам</h2><p>Передача возможна техническим подрядчикам, необходимым для работы сайта и связи, либо когда этого требует закон. Оператор принимает разумные меры для защиты данных.</p></section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}

import Link from "next/link";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { site } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Реквизиты",
  description:
    "Юридические реквизиты оператора сайта «Совет Маркетинг»: наименование, ИНН, ОГРНИП и контактные данные.",
  path: "/requisites",
});

export default function RequisitesPage() {
  return (
    <main className="inner-page">
      <SiteHeader />

      <article className="article-shell section-shell legal-copy">
        <header className="article-header">
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Реквизиты" }]} />
          <h1>Реквизиты</h1>
          <p>
            «{site.name}» — коммерческое обозначение. Юридическим оператором сайта и стороной договоров является
            {` ${site.legalName}`}.
          </p>
        </header>

        <div className="article-content">
          <section>
            <h2>Основные сведения</h2>
            <ul>
              <li>Наименование: {site.legalName}.</li>
              <li>ИНН: {site.inn}.</li>
              <li>ОГРНИП: {site.ogrnip}.</li>
              <li>Регион деятельности: {site.city}, {site.region}.</li>
              <li>Сайт: <a href={site.url}>{site.url}</a>.</li>
            </ul>
          </section>

          <section>
            <h2>Контакты</h2>
            <ul>
              <li>Телефон: <a href={site.phoneHref}>{site.phone}</a>.</li>
              <li>Электронная почта: <a href={`mailto:${site.email}`}>{site.email}</a>.</li>
              <li>Часы связи: {site.hours}.</li>
            </ul>
          </section>

          <section>
            <h2>Проверка перед оплатой</h2>
            <p>
              Банковские реквизиты здесь не публикуются. Перед оплатой сверяйте получателя, ИНН, назначение и сумму
              с подписанным договором или выставленным счётом.
            </p>
          </section>

          <section>
            <h2>Документы сайта</h2>
            <p>
              Порядок обработки номера телефона описан в <Link href="/privacy">политике конфиденциальности</Link> и
              отдельном <Link href="/consent">согласии на обработку персональных данных</Link>.
            </p>
          </section>
        </div>
      </article>

      <div className="section-shell cta-wrap">
        <section className="inner-cta liquid-glass">
          <div>
            <div className="eyebrow"><span />Связь</div>
            <h2>Нужны реквизиты для договора?</h2>
            <p>Свяжитесь с агентством и сверяйте документы только по опубликованным контактам.</p>
          </div>
          <div className="inner-cta-actions">
            <Link className="pill-button" href="/contacts#form">Оставить номер</Link>
            <a className="ghost-button" href={site.phoneHref}>{site.phone}</a>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

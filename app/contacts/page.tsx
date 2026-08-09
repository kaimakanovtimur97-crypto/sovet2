import Link from "next/link";
import { ContactLinks } from "@/components/contact-links";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { nearbyServiceAreas, site } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Контакты в Новороссийске",
  description:
    "Телефон, Telegram, WhatsApp и MAX агентства «Совет Маркетинг». Работаем из Новороссийска и удалённо по Краснодарскому краю.",
  path: "/contacts",
});

export default function ContactsPage() {
  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
        <div className="eyebrow"><span />Контакты</div>
        <h1>Связаться с {site.name}</h1>
        <p>
          Основная точка агентства — {site.city}. Первичное обсуждение проводим дистанционно; необходимость
          очной встречи или выезда согласуем отдельно.
        </p>
      </section>

      <section className="inner-section section-shell case-story" aria-label="Контактная информация">
        <article>
          <span>01 · Телефон</span>
          <h2><a href={site.phoneHref}>{site.phone}</a></h2>
          <p>{site.hours}. Если не ответили сразу, напишите в Telegram или WhatsApp — используем тот же номер.</p>
        </article>
        <article>
          <span>02 · Мессенджеры</span>
          <h2>Telegram · WhatsApp · MAX</h2>
          <p>В Telegram и WhatsApp переходите по кнопкам ниже. В MAX найдите профиль по номеру {site.phone}.</p>
        </article>
      </section>

      <section className="contact section-shell" id="channels">
        <div className="contact-card liquid-glass">
          <div className="contact-copy">
            <div className="eyebrow"><span />Связаться напрямую</div>
            <h2>Позвоните или напишите</h2>
            <p>
              На сайте больше нет формы заявки. Вы сразу переходите в выбранный канал и общаетесь напрямую с агентством.
            </p>
            <div className="contact-meta">
              <a href={site.phoneHref}>{site.phone}</a>
              <span>{site.hours}</span>
            </div>
          </div>
          <ContactLinks />
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Зона обслуживания</div>
          <h2>Новороссийск и ближайшие территории</h2>
        </div>
        <div className="fit-list">
          <p>Основной город: {site.city}, {site.region}.</p>
          <p>Анапа и Геленджик — удалённая работа, выезд по отдельному согласованию.</p>
          <p>Ближайшие населённые пункты: {nearbyServiceAreas.join(", ")}.</p>
          <p>На сайте не заявляются филиалы или адреса, которых у агентства нет.</p>
        </div>
      </section>

      <div className="section-shell cta-wrap">
        <section className="inner-cta liquid-glass">
          <div>
            <div className="eyebrow"><span />Документы</div>
            <h2>Проверьте данные до договора</h2>
            <p>Юридическое имя, ИНН и ОГРНИП опубликованы отдельно и должны совпадать с договором или счётом.</p>
          </div>
          <div className="inner-cta-actions">
            <Link className="pill-button" href="/requisites">Посмотреть реквизиты</Link>
            <Link className="ghost-button" href="/privacy">Политика обработки данных</Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

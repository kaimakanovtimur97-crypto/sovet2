import Link from "next/link";
import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { nearbyServiceAreas, services, site } from "@/lib/site-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "О компании",
  description:
    "Как устроена работа «Совет Маркетинг»: юридический оператор, формат взаимодействия, услуги и реальная зона обслуживания из Новороссийска.",
  path: "/about",
});

const principles = [
  {
    title: "Сначала задача",
    text: "До выбора каналов уточняем продукт, спрос, ограничения, доступные данные и путь обращения до продажи.",
  },
  {
    title: "Без гарантии позиций и продаж",
    text: "Поисковые позиции, спрос и решения клиентов нельзя обещать заранее. Фиксируем объём работ, критерии проверки и ограничения.",
  },
  {
    title: "Доступы у клиента",
    text: "Домен, рекламные кабинеты и аналитические аккаунты должны оставаться под контролем заказчика.",
  },
  {
    title: "Факты отделены от гипотез",
    text: "Не выдаём расчётный сценарий за результат и публикуем кейсы только вместе с проверяемым контекстом.",
  },
];

export default function AboutPage() {
  return (
    <main className="inner-page">
      <SiteHeader />

      <section className="inner-hero section-shell">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "О компании" }]} />
        <div className="eyebrow"><span />О компании</div>
        <h1>{site.name}: маркетинг с проверяемыми ограничениями</h1>
        <p>
          «{site.name}» — коммерческое обозначение. Договоры и расчёты оформляются от имени {site.legalName}.
          Основная точка работы — {site.city}; проекты из других городов ведём удалённо, а необходимость выезда
          согласуем отдельно.
        </p>
        <div className="hero-actions">
          <Link className="pill-button" href="/services">Посмотреть услуги</Link>
          <Link className="ghost-button" href="/contacts#form">Обсудить задачу</Link>
        </div>
      </section>

      <section className="metric-strip section-shell" aria-label="Формат работы">
        <div><strong>{site.city}</strong><span>основная точка агентства</span></div>
        <div><strong>онлайн</strong><span>базовый формат встреч и ведения</span></div>
        <div><strong>{site.region}</strong><span>основная зона обслуживания</span></div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />Ответственность</div>
          <h2>Кто оказывает услуги</h2>
        </div>
        <div className="fit-list">
          <p>Юридический оператор сайта и сторона договора — {site.legalName}.</p>
          <p>ИНН {site.inn}; ОГРНИП {site.ogrnip}.</p>
          <p>Состав работ, сроки, стоимость и ответственные фиксируются для конкретного проекта.</p>
          <p>На сайте не заявляется офис для посетителей по адресу, который не подтверждён.</p>
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Принципы</div>
          <h2>Как принимаются решения</h2>
          <p>Рабочая методика важнее громких обещаний: каждый канал получает понятную задачу и критерий проверки.</p>
        </div>
        <div className="feature-grid">
          {principles.map((item, index) => (
            <article className="liquid-glass" key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell">
        <div className="inner-heading">
          <div className="eyebrow"><span />Направления</div>
          <h2>Что можно поручить агентству</h2>
          <p>Конкретный состав выбирается после знакомства с задачей, а не из универсального пакета.</p>
        </div>
        <div className="related-grid">
          {services.map((service) => (
            <Link className="related-card liquid-glass" href={`/services/${service.slug}`} key={service.slug}>
              <span>Услуга</span>
              <h3>{service.shortTitle}</h3>
              <p>{service.description}</p>
              <b>Подробнее</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="inner-section section-shell split-intro">
        <div>
          <div className="eyebrow"><span />География</div>
          <h2>Работа из Новороссийска</h2>
        </div>
        <div className="fit-list">
          <p>
            Новороссийск — основной город. Анапа и Геленджик обслуживаются удалённо; выезд возможен только после
            отдельного согласования.
          </p>
          <p>Ближайшая зона обслуживания: {nearbyServiceAreas.join(", ")}.</p>
          <p>Перечень зоны обслуживания не означает наличие филиала или офиса в каждом населённом пункте.</p>
        </div>
      </section>

      <div className="section-shell cta-wrap">
        <section className="inner-cta liquid-glass">
          <div>
            <div className="eyebrow"><span />Контакт</div>
            <h2>Расскажите, что нужно изменить</h2>
            <p>Уточним исходные данные и предложим следующий проверяемый шаг: аудит, расчёт или план работ.</p>
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

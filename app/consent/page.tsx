import { Breadcrumbs, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Согласие на обработку персональных данных",
  description: "Согласие на обработку номера телефона, переданного через форму сайта.",
  path: "/consent",
  index: false,
});

export default function ConsentPage() {
  return (
    <main className="inner-page">
      <SiteHeader />
      <article className="article-shell section-shell legal-copy">
        <header className="article-header">
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Согласие на обработку данных" }]} />
          <h1>Согласие на обработку персональных данных</h1>
          <p>Редакция от 7 августа 2026 года. Согласие подтверждается отдельным флажком перед отправкой формы.</p>
        </header>
        <div className="article-content">
          <section>
            <h2>Кому даётся согласие</h2>
            <p>
              Оператор — {site.legalName}, ИНН {site.inn}, ОГРНИП {site.ogrnip}. Контакт для вопросов и отзыва
              согласия: <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </section>
          <section>
            <h2>Какие данные и зачем</h2>
            <p>
              Посетитель добровольно разрешает обработать номер телефона и технический источник формы, чтобы оператор
              мог ответить на обращение, уточнить задачу и подготовить предложение.
            </p>
          </section>
          <section>
            <h2>Действия с данными</h2>
            <p>
              Допускаются получение, запись, систематизация, хранение, уточнение, использование, передача сервисам
              доставки обращения в необходимом объёме, блокирование и удаление с применением автоматизированных средств.
            </p>
          </section>
          <section>
            <h2>Срок и отзыв</h2>
            <p>
              Согласие действует до достижения цели, его отзыва или не более одного года после последнего контакта,
              если иной срок не требуется по договору или закону. Отозвать согласие можно письмом на {site.email}.
            </p>
          </section>
          <section>
            <h2>Важно</h2>
            <p>
              Флажок согласия не установлен заранее. Без него форма не отправляется. Подробности об обработке и правах
              посетителя приведены в <a href="/privacy">политике обработки персональных данных</a>.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}

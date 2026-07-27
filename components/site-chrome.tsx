import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/lib/site-data";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Совет — на главную">
      <span className="logo-mark" aria-hidden="true"><i /><i /></span>
      <span>совет.</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header inner-header">
      <div className="nav-wrap">
        <Logo />
        <nav className="desktop-nav" aria-label="Основная навигация">
          <Link href="/#services">Услуги</Link>
          <Link href="/#cases">Кейсы</Link>
          <Link href="/#pricing">Тарифы</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/#contacts">Контакты</Link>
        </nav>
        <div className="nav-actions">
          <a className="phone-link" href={site.phoneHref}><Phone size={15} />{site.phone}</a>
          <Link className="pill-button compact" href="/#contacts">Обсудить проект <ArrowRight size={15} /></Link>
          <details className="mobile-menu">
            <summary aria-label="Открыть меню">Меню</summary>
            <nav aria-label="Мобильная навигация">
              <Link href="/#services">Услуги</Link>
              <Link href="/#cases">Кейсы</Link>
              <Link href="/#pricing">Тарифы</Link>
              <Link href="/blog">Блог</Link>
              <Link href="/#contacts">Контакты</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-grid section-shell">
        <div>
          <Logo />
          <p>Маркетинговое агентство в Новороссийске. Стратегия, привлечение, контент и аналитика в одной команде.</p>
        </div>
        <div>
          <span>Навигация</span>
          <Link href="/#services">Услуги</Link>
          <Link href="/#cases">Кейсы</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/#pricing">Тарифы</Link>
        </div>
        <div>
          <span>Контакты</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.phoneHref}>{site.phone}</a>
          <small>{site.city}</small>
          <small>ИНН {site.inn}</small>
          <small>ОГРНИП {site.ogrnip}</small>
        </div>
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 {site.legalName} · агентство «Совет»</span>
        <Link href="/privacy">Политика конфиденциальности</Link>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Хлебные крошки">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function LeadCta() {
  return (
    <section className="inner-cta liquid-glass">
      <div>
        <div className="eyebrow"><span />Следующий шаг</div>
        <h2>Разберём задачу и предложим план без лишних каналов</h2>
        <p>На первой встрече уточним экономику, текущие данные и ограничения. Если задачу нельзя честно оценить без аудита — так и скажем.</p>
      </div>
      <div className="inner-cta-actions">
        <Link className="pill-button" href="/#contacts">Обсудить проект <ArrowRight size={17} /></Link>
        <a className="ghost-button" href={site.phoneHref}>{site.phone}</a>
      </div>
    </section>
  );
}

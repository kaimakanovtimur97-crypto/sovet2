import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ContactLinks } from "@/components/contact-links";
import { site } from "@/lib/site-data";

export function Logo({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <Link className={`logo${iconOnly ? " logo-icon-only" : ""}`} href="/" aria-label="Совет Маркетинг — на главную">
      <img className="logo-icon" src="/favicon.svg" alt="" width={32} height={32} aria-hidden="true" />
      {!iconOnly && <span>совет.</span>}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header inner-header">
      <div className="nav-wrap">
        <Logo iconOnly />
        <nav className="desktop-nav" aria-label="Основная навигация">
          <Link href="/services">Услуги</Link>
          <Link href="/cases">Кейсы</Link>
          <Link href="/prices">Цены</Link>
          <Link href="/regions">География</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>
        <div className="nav-actions">
          <a className="phone-link" href={site.phoneHref}><Phone size={15} />{site.phone}</a>
          <a className="pill-button compact" href={site.phoneHref}>Позвонить <ArrowRight size={15} /></a>
          <details className="mobile-menu">
            <summary aria-label="Открыть меню">Меню</summary>
            <nav aria-label="Мобильная навигация">
              <Link href="/services">Услуги</Link>
              <Link href="/cases">Кейсы</Link>
              <Link href="/prices">Цены</Link>
              <Link href="/regions">География</Link>
              <Link href="/blog">Блог</Link>
              <Link href="/contacts">Контакты</Link>
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
          <p>Маркетинговое агентство в Новороссийске. Стратегия, сайты, реклама и аналитика с проверяемыми ограничениями.</p>
        </div>
        <div>
          <span>Навигация</span>
          <Link href="/services">Услуги</Link>
          <Link href="/cases">Кейсы</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/prices">Цены</Link>
          <Link href="/regions">География</Link>
        </div>
        <div>
          <span>Контакты</span>
          <a href={site.phoneHref}>{site.phone}</a>
          <a href={site.telegramHref} target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          {site.maxHref ? <a href={site.maxHref} target="_blank" rel="noopener noreferrer">MAX</a> : <small>MAX: {site.phone}</small>}
          <small>{site.city}</small>
          <small>ИНН {site.inn}</small>
          <small>ОГРНИП {site.ogrnip}</small>
        </div>
      </div>
      <div className="footer-bottom section-shell">
        <span>© 2026 «Совет Маркетинг»</span>
        <Link href="/about">О компании</Link>
        <Link href="/requisites">Реквизиты</Link>
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

export function ContactCta() {
  return (
    <section className="inner-cta liquid-glass">
      <div>
        <div className="eyebrow"><span />Следующий шаг</div>
        <h2>Разберём задачу и предложим план без лишних каналов</h2>
        <p>На первой встрече уточним экономику, текущие данные и ограничения. Если задачу нельзя честно оценить без аудита — так и скажем.</p>
      </div>
      <div className="inner-cta-actions">
        <ContactLinks compact />
      </div>
    </section>
  );
}

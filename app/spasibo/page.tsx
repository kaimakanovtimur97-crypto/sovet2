import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { LeadSuccessTracker } from "@/components/lead-success-tracker";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Спасибо за заявку",
  description: "Заявка доставлена агентству «Совет Маркетинг».",
  path: "/spasibo",
  index: false,
});

export default function ThankYouPage() {
  return (
    <main className="inner-page">
      <LeadSuccessTracker />
      <SiteHeader />
      <section className="inner-hero section-shell thank-you">
        <CheckCircle2 size={42} aria-hidden="true" />
        <div className="eyebrow"><span />Заявка доставлена</div>
        <h1>Спасибо — свяжемся в течение рабочего дня</h1>
        <p>
          Номер не передаётся в адрес страницы или аналитические события. Если вопрос срочный, позвоните напрямую.
        </p>
        <div className="hero-actions">
          <a className="pill-button" href={site.phoneHref}><Phone size={17} />{site.phone}</a>
          <Link className="ghost-button" href="/services">Посмотреть услуги <ArrowRight size={17} /></Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

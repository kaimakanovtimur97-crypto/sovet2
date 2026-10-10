import { HomePage } from "@/components/home-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Маркетинговое агентство",
  description:
    "Стратегия, сайты, SEO, Яндекс Директ, Карты, SMM и аналитика для бизнеса в одной системе.",
  path: "/marketing-agency",
});

export default function MarketingAgencyPage() {
  return <HomePage genericHero />;
}

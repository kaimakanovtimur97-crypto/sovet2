import { HomePage } from "@/components/home-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Маркетинговое агентство в Новороссийске",
  description:
    "Стратегия, сайты, SEO, Яндекс Директ, Карты, SMM и аналитика для бизнеса Новороссийска, Анапы и Геленджика.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}

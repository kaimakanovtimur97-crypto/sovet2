import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="wrap" style={{ paddingTop: 120, paddingBottom: 160, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-hover)", marginBottom: 16 }}>404</div>
        <h1 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg-0)" }}>Страница не найдена</h1>
        <p style={{ fontSize: 17, color: "var(--fg-2)", marginTop: 16, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
          Похоже, такой страницы нет. Вернитесь на главную или посмотрите наши услуги.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          <Link href="/" className="btn btn--primary btn--lg">На главную</Link>
          <Link href="/#services" className="btn btn--outline btn--lg">Услуги</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}

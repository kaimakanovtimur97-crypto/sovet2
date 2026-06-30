import React from "react";
import { InlineLeadForm } from "./InlineLeadForm";

export function CtaSection({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="wrap" style={{ paddingBottom: "var(--section-y)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
          background: "var(--ink-700)",
          border: "1px solid var(--line)",
          borderRadius: 24,
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
        className="cta-grid"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(600px 300px at 100% 0%, var(--accent-glow), transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontSize: "clamp(28px,3.2vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12, color: "var(--fg-0)" }}>
            {title}
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--fg-2)", margin: "18px 0 28px", maxWidth: 420 }}>{text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex" }}>
              {["АК", "ИП", "ЛС"].map((a, i) => (
                <span
                  key={i}
                  className={`avatar${i === 1 ? " avatar--accent" : ""}`}
                  style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--ink-700)" }}
                >
                  {a}
                </span>
              ))}
            </div>
            <span style={{ fontSize: 13, color: "var(--fg-3)" }}>Ответим в течение рабочего дня</span>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <InlineLeadForm />
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { Icon } from "./Icon";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ marginTop: 44, borderTop: "1px solid var(--line)" }}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`faq-item${isOpen ? " open" : ""}`}>
            <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)}>
              <span>{f.q}</span>
              <span className="faq-sign">{isOpen ? "−" : "+"}</span>
            </button>
            <div className="faq-a">
              <p>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

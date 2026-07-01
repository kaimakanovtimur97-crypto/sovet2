"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { ConsultButton } from "./Lead";
import { CONTACT } from "@/lib/data";

const LINKS = [
  { href: "/#services", label: "Услуги" },
  { href: "/#cases", label: "Кейсы" },
  { href: "/#pricing", label: "Тарифы" },
  { href: "/#team", label: "Команда" },
  { href: "/blog", label: "Блог" },
  { href: "/#contacts", label: "Контакты" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="burger"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={`burger-bar${open ? " x1" : ""}`} />
        <span className={`burger-bar${open ? " x0" : ""}`} />
        <span className={`burger-bar${open ? " x2" : ""}`} />
      </button>
      {open && (
        <div className="mobile-panel">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`} className="mobile-link mobile-phone" onClick={() => setOpen(false)}>
            <Icon name="phone" size={15} /> {CONTACT.phone}
          </a>
          <div onClick={() => setOpen(false)} style={{ marginTop: 10 }}>
            <ConsultButton block>Обсудить проект</ConsultButton>
          </div>
        </div>
      )}
    </>
  );
}

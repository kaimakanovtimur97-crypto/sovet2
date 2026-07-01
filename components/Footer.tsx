import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { CONTACT } from "@/lib/data";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div style={{ maxWidth: 300 }}>
          <Logo size={24} />
          <p className="footer-desc">
            Маркетинговое агентство полного цикла в Новороссийске. Работаем по всему Краснодарскому краю и России.
          </p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <span className="h">Агентство</span>
            <Link href="/#services">Услуги</Link>
            <Link href="/#cases">Кейсы</Link>
            <Link href="/#team">Команда</Link>
            <Link href="/#pricing">Тарифы</Link>
            <Link href="/blog">Блог</Link>
          </div>
          <div className="footer-col">
            <span className="h">Контакты</span>
            <span>{CONTACT.email}</span>
            <span>{CONTACT.phone}</span>
            <span>{CONTACT.addressLine}</span>
          </div>
          <div className="footer-col" style={{ maxWidth: 240 }}>
            <span className="h">Реквизиты</span>
            <span>{CONTACT.legalName} — юр. название</span>
            <span>ИНН {CONTACT.inn}</span>
            <span>ОГРН {CONTACT.ogrn} (опц.)</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 {CONTACT.legalName} · агентство «Совет»</span>
        <span>Политика конфиденциальности</span>
      </div>
    </footer>
  );
}

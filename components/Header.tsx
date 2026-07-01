import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { ConsultButton } from "./Lead";
import { MobileMenu } from "./MobileMenu";
import { CONTACT } from "@/lib/data";

export function Header() {
  return (
    <header className="header">
      <div className="wrap header-inner">
        <Link href="/" style={{ display: "flex" }}>
          <Logo size={26} />
        </Link>
        <nav className="nav">
          <Link href="/#services">Услуги</Link>
          <Link href="/#cases">Кейсы</Link>
          <Link href="/#pricing">Тарифы</Link>
          <Link href="/#team">Команда</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/#contacts">Контакты</Link>
        </nav>
        <div className="header-right">
          <span className="phone">
            <Icon name="phone" size={15} /> {CONTACT.phone}
          </span>
          <ConsultButton>Обсудить проект</ConsultButton>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

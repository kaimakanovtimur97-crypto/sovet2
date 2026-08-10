"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Code2, Menu, Pause, Play, X } from "lucide-react";

const navigation = [
  { label: "О проекте", href: "/cases/nexum-ai-ops" },
  { label: "Решение", href: "/cases/nexum-ai-ops#solution" },
  { label: "Что сделали", href: "/cases/nexum-ai-ops#process" },
  { label: "Стоимость", href: "/prices" },
];

function NexumLogo() {
  return (
    <span className="nx-logo" aria-hidden="true">
      <svg viewBox="0 0 256 256" role="img">
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
      <b>nexum</b>
    </span>
  );
}

export default function NexumPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const previousOverflow = useRef("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    previousOverflow.current = document.body.style.overflow;
    document.body.classList.add("nexum-active");

    return () => {
      document.body.classList.remove("nexum-active");
      document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow.current;

    if (!menuOpen) return;

    const opener = menuButtonRef.current;
    const panel = menuPanelRef.current;
    const focusable = Array.from(
      panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
    );
    focusable[0]?.focus();

    function keepFocusInMenu(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", keepFocusInMenu);
    return () => {
      window.removeEventListener("keydown", keepFocusInMenu);
      opener?.focus();
    };
  }, [menuOpen]);

  function syncVideoVisibility(video: HTMLVideoElement) {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    setVideoVisible(
      video.currentTime > 0.25 && (duration === 0 || video.currentTime < duration - 0.45),
    );
  }

  async function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setVideoPaused(true);
      }
    } else {
      video.pause();
    }
  }

  return (
    <main className="nexum-showcase">
      <video
        ref={videoRef}
        id="nexum-background-video"
        className={`nx-video${videoVisible ? " is-visible" : ""}`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/nexum/nexum-poster.jpg"
        aria-hidden="true"
        onPlaying={(event) => {
          setVideoPaused(false);
          syncVideoVisibility(event.currentTarget);
        }}
        onPause={() => setVideoPaused(true)}
        onTimeUpdate={(event) => syncVideoVisibility(event.currentTarget)}
      >
        <source
          src="/nexum/nexum-hero-mobile.mp4"
          type="video/mp4"
          media="(max-width: 767px) and (prefers-reduced-motion: no-preference)"
        />
        <source
          src="/nexum/nexum-hero.mp4"
          type="video/mp4"
          media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
        />
      </video>

      <div className="nx-shell">
        <header className="nx-header">
          <Link className="nx-brand" href="/cases/nexum-ai-ops" aria-label="Nexum — открыть описание проекта" tabIndex={menuOpen ? -1 : undefined}>
            <NexumLogo />
          </Link>

          <div className="nx-header-actions">
            <button
              className="nx-video-control"
              type="button"
              aria-label={videoPaused ? "Воспроизвести фоновое видео" : "Приостановить фоновое видео"}
              aria-pressed={videoPaused}
              aria-controls="nexum-background-video"
              title={videoPaused ? "Воспроизвести видео" : "Приостановить видео"}
              tabIndex={menuOpen ? -1 : 0}
              onClick={toggleVideo}
            >
              {videoPaused ? <Play size={17} fill="currentColor" /> : <Pause size={17} fill="currentColor" />}
            </button>

            <div className="nx-desktop-actions">
              <nav className="nx-nav-pill" aria-label="Навигация по проекту Nexum">
                {navigation.map((item) => (
                  <Link href={item.href} key={item.label}>{item.label}</Link>
                ))}
              </nav>
              <Link className="nx-primary" href="/contacts">Обсудить проект</Link>
            </div>

            <button
              ref={menuButtonRef}
              className="nx-menu-button"
              type="button"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              aria-controls="nexum-mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Menu className={menuOpen ? "is-hidden" : ""} size={20} />
              <X className={menuOpen ? "" : "is-hidden"} size={20} />
            </button>
          </div>
        </header>

        <button
          className={`nx-menu-backdrop${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label="Закрыть меню"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
        />
        <aside
          ref={menuPanelRef}
          className={`nx-menu-panel${menuOpen ? " is-open" : ""}`}
          id="nexum-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Меню Nexum"
          aria-hidden={!menuOpen}
        >
          <nav aria-label="Мобильная навигация Nexum">
            {navigation.map((item, index) => (
              <Link
                href={item.href}
                key={item.label}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${(index + 1) * 60}ms` : "0ms" }}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <Link
            className="nx-primary nx-menu-cta"
            href="/contacts"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            Обсудить проект
          </Link>
        </aside>

        <section className="nx-content" aria-labelledby="nexum-title" aria-hidden={menuOpen}>
          <div className="nx-intro">
            <p className="nx-case-label">Авторский спецпроект «Совета»</p>
            <h1 id="nexum-title">ИИ-сотрудники берут рутину на себя. Вы развиваете бизнес.</h1>
            <div className="nx-contact-cta">
              <span>Нужен сайт для технологичного продукта?</span>
              <Link className="nx-primary" href="/contacts">Обсудить такой сайт</Link>
            </div>
          </div>

          <div className="nx-cards" id="capabilities">
            <article className="nx-card nx-stat-card">
              <strong>04</strong>
              <p>Оффер, видео, интерфейс и анимация собраны в один адаптивный экран.</p>
            </article>

            <article className="nx-card nx-case-card">
              <div className="nx-card-heading"><span>С</span><b>Что сделали</b></div>
              <p>Показываем, как упаковать технологичный продукт: от идеи и текста до анимации и кода.</p>
              <div className="nx-card-footer">
                <span className="nx-code-icon"><Code2 size={16} /></span>
                <span><b>Совет Маркетинг</b><small>Дизайн и разработка</small></span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

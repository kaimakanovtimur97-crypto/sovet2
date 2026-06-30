# Лендинг агентства «Совет» — Next.js

Многостраничный сайт маркетингового агентства «Совет» (Новороссийск) на **Next.js 14 (App Router)** с серверным рендерингом SEO-метатегов, JSON-LD `ProfessionalService`, `sitemap.xml` и `robots.txt`.

## Структура

```
app/
  layout.tsx              — общий layout, мета по умолчанию, JSON-LD LocalBusiness, гео-теги
  page.tsx                — главная (hero, услуги, цифры, кейсы, подход, команда, тарифы, отзывы, FAQ, контакты, CTA)
  services/[slug]/page.tsx — страница услуги (performance | brand | smm | analytics) + generateMetadata
  cases/[slug]/page.tsx    — страница кейса (6 кейсов) + generateMetadata
  sitemap.ts / robots.ts   — карта сайта и robots
  not-found.tsx            — 404
  globals.css              — токены «электрик» + базовые классы
components/                — Header, Footer, Logo, Icon, Lead (модалка-форма), InlineLeadForm, Faq, CtaSection
lib/data.ts                — контент: услуги, кейсы, контакты (CONTACT)
```

## Перед публикацией — заполните данные

Откройте **`lib/data.ts`** → объект `CONTACT` и впишите реальные значения:
- `phone`, `email`, `addressLine`, `street`, `postalCode`
- `legalName` (юр. название), `inn`, `ogrn`
- `lat`, `lng` — координаты офиса (для JSON-LD и гео-метатегов)
- `siteUrl` — **ваш домен на Vercel** (например `https://sovet-nvrsk.ru`). Влияет на canonical, OG, sitemap.

Карта: в `app/page.tsx` найдите комментарий «МЕСТО ПОД ЯНДЕКС-КАРТУ» и замените блок-плейсхолдер на `<iframe>` виджета Яндекс.Карт с отметкой офиса.

Отправка заявок: в `components/Lead.tsx` и `components/InlineLeadForm.tsx` помечены `TODO` — подключите отправку формы на ваш эндпоинт или в CRM.

## Локальный запуск

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # продакшн-сборка
```

## Публикация: GitHub + Vercel

1. **GitHub.** Создайте пустой репозиторий, затем из папки `sovet-next/`:
   ```bash
   git init
   git add .
   git commit -m "Совет — лендинг на Next.js"
   git branch -M main
   git remote add origin https://github.com/ВАШ-АККАУНТ/ВАШ-РЕПО.git
   git push -u origin main
   ```
2. **Vercel.** Зайдите на [vercel.com](https://vercel.com) → **Add New → Project** → импортируйте репозиторий. Vercel определит Next.js автоматически — настройки менять не нужно, жмите **Deploy**.
3. После деплоя пропишите купленный домен в **Project → Settings → Domains** и обновите `siteUrl` в `lib/data.ts` под него (закоммитьте — Vercel пересоберёт сам).

## Формы → заявки на почту (Resend)

Обе формы (модалка «Получить стратегию роста» и форма в блоке контактов) отправляют заявку POST-запросом на `app/api/lead/route.ts`, который шлёт письмо через [Resend](https://resend.com) (бесплатно 3000 писем/мес).

1. Зарегистрируйтесь на resend.com → **API Keys** → создайте ключ.
2. Скопируйте `.env.example` → `.env.local` и заполните `RESEND_API_KEY` и `LEAD_TO_EMAIL` (куда слать заявки).
3. Те же переменные добавьте в Vercel: **Project → Settings → Environment Variables** → Redeploy.
4. Для теста сразу работает отправитель `onboarding@resend.dev`, но письма приходят только на почту владельца аккаунта Resend. Чтобы слать с собственного адреса и на любую почту — подтвердите свой домен в Resend и впишите его в `LEAD_FROM_EMAIL`.

> Если переменные ещё не заданы, форма всё равно покажет «Спасибо» и не потеряет заявку — данные запишутся в логи функции на Vercel (**Project → Logs**). Письма начнут уходить, как только добавите ключ.

## SEO под Новороссийск

- Серверные `title`/`description` на каждой странице (`generateMetadata`) с гео-вхождениями.
- JSON-LD `ProfessionalService` с адресом, координатами, часами работы и `areaServed` в `layout.tsx`.
- `sitemap.xml` и `robots.txt` генерируются автоматически.
- После деплоя: добавьте сайт в **Яндекс.Вебмастер** и **Яндекс.Бизнес** (карточка организации) — это ключ к локальной выдаче и картам.

> Шрифты Manrope и JetBrains Mono подключены с Google Fonts CDN (`globals.css`). Для продакшна можно перенести на `next/font` для самохостинга — по желанию.

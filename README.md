# «Совет Маркетинг» — статический Next.js-сайт

Многостраничный сайт агентства в Новороссийске. Все публичные страницы,
метаданные, JSON-LD, `robots.txt`, `sitemap.xml` и страница `/spasibo`
генерируются во время сборки и размещаются в Timeweb App Platform как
Frontend-приложение без постоянного Node.js-сервера.

## Сборка

```bash
npm ci
npm run build
```

Готовые файлы появляются в `out/`. Для Timeweb используются:

- тип приложения: Frontend → Next.js;
- SSR: выключен;
- команда сборки: `npm run build`;
- директория сборки: `out`;
- Node.js: 24.

## Форма заявки

Фронтенд отправляет JSON на `https://forms.sovet-nvrsk.ru/api/lead`.
Обработчик находится в `cloudflare/lead-worker.js`; он проверяет Origin,
размер тела, honeypot, российский номер и согласие, ограничивает частоту
попыток и возвращает `delivered: true` только после ответа Resend 2xx.

Тот же Worker служит тонким edge-слоем для сайта: HTML и файлы остаются в
Timeweb, а Worker добавляет защитные заголовки, постоянные редиректы и отдаёт
`out/404.html` с настоящим HTTP 404 вместо SPA-fallback Timeweb.

Секреты хранятся только в Cloudflare Worker:

- `RESEND_API_KEY` — secret с правом Sending access;
- `LEAD_TO_EMAIL` — secret;
- `LEAD_FROM_EMAIL` — необязательная переменная после подтверждения домена;
- `ALLOWED_ORIGINS` — необязательный список дополнительных origin через
  запятую для временного технического домена Timeweb.
- `TIMEWEB_ORIGIN` — HTTPS-адрес технического домена Frontend-приложения;
- `PREVIEW_HOSTS` — необязательный список временных доменов для QA.

В браузерный бандл секреты не попадают. После подтверждённой доставки форма
сохраняет только ID события в `sessionStorage` и открывает `/spasibo`.

## Проверка перед переключением домена

1. Главная и 28 URL из `sitemap.xml` отвечают `200`.
2. Несуществующий URL отвечает настоящим `404`, а не главной с `200`.
3. Canonical указывает на `https://www.sovet-nvrsk.ru`.
4. `/privacy`, `/consent` и `/spasibo` содержат `noindex`.
5. Форма открывает `/spasibo` только после `delivered: true`, письмо реально
   присутствует в Resend и у получателя.
6. Apex и старые домены перенаправляются на `www` с сохранением пути и query;
   `/services/performance` перенаправляется на `/services/yandex-direct`.
7. После переключения проверяются desktop/mobile, TLS, robots, sitemap и 404.

Старое Docker-приложение можно остановить только после успешной проверки
технического и основного доменов.

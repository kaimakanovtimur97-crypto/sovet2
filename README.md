# «Совет Маркетинг» — статический Next.js-сайт

Многостраничный сайт агентства в Новороссийске. Все публичные страницы,
метаданные, JSON-LD, `robots.txt` и `sitemap.xml` генерируются во время
сборки и размещаются в Cloudflare Workers Static Assets без постоянного
Node.js-сервера.

## Сборка

```bash
npm ci
npm run build
```

Готовые файлы появляются в `out/`. Для Cloudflare используются:

- deploy-команда: `npx wrangler deploy`;
- команда сборки из `wrangler.jsonc`: `npm run build`;
- static assets directory: `out`;
- обработка неизвестных URL: ближайший `404.html` со статусом 404.

Включён `trailingSlash`, поэтому внутренние страницы экспортируются как
`/path/index.html` и корректно обслуживаются Cloudflare Workers Static Assets.

## Контакты

На сайте нет формы заявки и серверного обработчика персональных данных.
Посетителю доступны только прямой звонок и переходы в Telegram и WhatsApp по
номеру `+7 995 263 15 53`. Для MAX отображается тот же номер; прямую ссылку
можно добавить только после получения ссылки «Поделиться профилем» из MAX.

## Производственный домен

Canonical-хост: `https://www.sovet-nvrsk.ru`.
`sovet-nvrsk.ru` привязан к тому же Worker; каждая его HTML-страница указывает
canonical на `www` с тем же путём.

## Проверка перед публикацией

1. Все URL из `sitemap.xml` отвечают своей страницей, содержат один H1 и
   self-canonical на `https://www.sovet-nvrsk.ru/.../`.
2. `robots.txt` указывает только на новый домен.
3. В HTML и клиентском бандле нет старого домена, формы или endpoint заявки.
4. Телефон, Telegram и WhatsApp используют номер `+7 995 263 15 53`.
5. Apex и `www` имеют валидный TLS; HTML на apex указывает canonical на `www`.
6. После публикации проверяются desktop/mobile, ссылки, sitemap, canonical и
   поведение неизвестного URL.

# Keepsake: landing (Vite + Pug + SCSS)

Адаптивний лендінг дизайн-агенції Keepsake. Макет, токени, брейкпоінти й доступність ті самі, що в лабораторній роботі №7 (завдання 4); змінився лише спосіб розробки: Pug замість ручного HTML, модульний SCSS замість одного CSS, збірка через Vite.

**Демо:** https://maykaxx.github.io/landing-keepsake-vite/

## Вимоги та команди

Node.js LTS (не нижче 20.19) і npm.

| Команда           | Що робить                                                                      |
| ----------------- | ------------------------------------------------------------------------------ |
| `npm install`     | встановлює залежності та налаштовує husky                                      |
| `npm run dev`     | dev-сервер Vite                                                                |
| `npm run build`   | продакшн-збірка в `dist/` (CSS мініфікується Vite)                             |
| `npm run preview` | локальний перегляд збірки                                                      |
| `npm run images`  | з `images-src/` генерує AVIF, WebP, JPEG у двох ширинах у `src/assets/images/` |
| `npm run format`  | Prettier форматує весь проєкт                                                  |
| `npm run lint`    | Stylelint + `prettier --check`                                                 |

## Структура

```
images-src/            вихідні JPEG (work-*, journal-*)
scripts/images.js      конвертація зображень на sharp
src/
  data/                дані секцій: масиви об'єктів (nav, works, services, ...)
  includes/            службові include (meta)
  layouts/main.pug     базовий макет: блоки meta, title, styles, content, scripts
  mixins/              btn, icon, picture, work-card, section-title, logo, socials, client-logo
  components/          header, mobile-menu, footer, subscribe-form, sections/*.pug
  pages/index.pug      extends макет, append/prepend блоків, include секцій
  styles/              abstracts, base, layout, components, main.scss
```

## Архітектура

**Pug.** `layouts/main.pug` підключає дані та міксини й описує каркас. Сторінка `index.pug` успадковує його (`extends`), додає `description`/Open Graph через `append meta` і шрифти через `prepend styles`, а секції підключає через `include`. Повторювані блоки (навігація, фільтр, роботи, послуги, статистика, журнал, футер) виводяться через `each` з масивів у `src/data/`. Міксин `+btn` використовує `case`, `block` (іконка) та `&attributes`; `+picture` генерує `<picture>` з AVIF/WebP/JPEG, `srcset`, `sizes`, `width`, `height`, `loading`.

**SCSS.** Лише `@use` / `@forward`, кожна папка має `_index.scss`, `main.scss` єдина точка входу. Токени (кольори, шрифти, адаптивні розміри) лежать у map-ах `abstracts/_tokens.scss` і через `@each` перетворюються на CSS custom properties в `:root`. Брейкпоінти в map-і, міксин `mq()` працює за підходом mobile first (лише `min-width`). Функція `rem()`, міксини `visually-hidden`, `focus-ring` (з параметрами за замовчуванням), `flex-center`, `button-reset`. Один БЕМ-блок один файл, вкладеність не глибша за 3 рівні.

**Без JavaScript.** Мобільне меню на Popover API (`popovertarget`), фільтр портфоліо на `:checked ~`, стани форми на `:user-invalid` і `:target`.

## Інструменти

| Інструмент                      | Навіщо                                   |
| ------------------------------- | ---------------------------------------- |
| Vite + Vituum                   | dev-сервер і збірка, рендер Pug-сторінок |
| Pug                             | шаблони HTML                             |
| Sass (Dart)                     | препроцесор CSS                          |
| PostCSS + Autoprefixer          | вендорні префікси під Browserslist       |
| sharp                           | генерація AVIF/WebP/JPEG                 |
| Prettier + @prettier/plugin-pug | форматування                             |
| Stylelint (standard-scss)       | перевірка SCSS і БЕМ-імен                |
| husky + lint-staged             | pre-commit перевірка змінених файлів     |
| GitHub Actions                  | lint, збірка й публікація на Pages       |

## Цільові браузери

`.browserslistrc`: останні 2 версії Chrome, Firefox, Edge, Safari та iOS Safari. Список: `npx browserslist`.

## Розмір до/після оптимізації

Заповнити після підстановки реальних зображень з Figma в `images-src/` та `npm run build`:

| Ресурс                                                   | До     | Після  |
| -------------------------------------------------------- | ------ | ------ |
| CSS (`style.scss` без мініфікації / `dist/assets/*.css`) | ... KB | ... KB |
| Зображення: JPEG-вихідники / `dist` (AVIF, WebP)         | ... KB | ... KB |

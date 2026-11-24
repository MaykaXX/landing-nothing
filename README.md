# Nothing: landing (Vite + Pug + SCSS)

Лабораторна робота №10, **варіант 2: Nothing**, методологія **BEM + ITCSS**.

- Макет: [Figma, сторінка `v2 Nothing`](https://www.figma.com/design/SKwOm0iY8234gJZwOBezoS/BOSE-New-Version--Copy-?node-id=6802-139)
- Демо: https://USER.github.io/landing-nothing/ (замінити `USER`)

## Команди

Node.js LTS (не нижче 20.19).

| Команда           | Що робить                                                                 |
| ----------------- | ------------------------------------------------------------------------- |
| `npm install`     | встановлює залежності та husky                                            |
| `npm run dev`     | dev-сервер                                                                |
| `npm run build`   | збірка в `dist/`                                                          |
| `npm run preview` | перегляд збірки                                                           |
| `npm run images`  | `images-src/` → AVIF, WebP, JPEG у кількох ширинах (`src/assets/images/`) |
| `npm run format`  | Prettier                                                                  |
| `npm run lint`    | Stylelint + `prettier --check`                                            |

## Декомпозиція на BEM-блоки

| Блок                | Призначення                            | Елементи / модифікатори                                                 |
| ------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| `c-header`          | шапка                                  | `__inner`, `__controls`                                                 |
| `c-logo`            | логотип-посилання                      |                                                                         |
| `c-icon-button`     | телефон, бургер, закрити (один вигляд) | `__icon`, `__icon--hover`, `__number`, `--swap`                         |
| `c-menu`            | оверлей-меню (`:target`)               | `__bar`, `__body`, `__list`, `__link`, `__contact`, `__phone`, `__call` |
| `c-hero`            | перший екран                           | `__media`, `__image`, `__inner`, `__title`                              |
| `c-section-title`   | заголовок секції (h2)                  |                                                                         |
| `c-recommended`     | секція «Recommended»                   | `__title`, `__list`, `__item`                                           |
| `c-product-card`    | картка товару                          | `__media`, `__image`, `__title`, `__text`, `__intro`, `__price`         |
| `c-categories`      | секція категорій                       | `__title`, `__list`, `__button`                                         |
| `c-category`        | рядок галереї «два фото + назва»       | `__media--wide`, `__media--narrow`, `__image`, `__title`                |
| `c-banner`          | повноширинний темний банер             | `__image`                                                               |
| `c-about`           | «About us»: колонки тексту             | `__inner`, `__title`, `__text`, `__paragraph--spaced`                   |
| `c-contact`         | секція «Contact us»                    | `__title`, `__body`, `__form`, `__details`                              |
| `c-form`, `c-field` | форма, поле й textarea                 | `c-form__submit`, `c-field--textarea`                                   |
| `c-button`          | кнопка (default / hover / pressed)     |                                                                         |
| `c-contacts`        | телефон, email, адреса                 | `__list`, `__label`, `__value`, `__link`                                |

Об'єкти: `o-container`, `o-grid` (`o-grid--debug`). Утиліти: `u-visually-hidden`.

Позиціонування блоків робить батьківський блок через мікс: `c-product-card` стоїть у `c-recommended__item`, `c-button c-categories__button`, `c-form c-contact__form`, `c-contacts c-contact__details`.

## Архітектура стилів (ITCSS)

```
src/styles/
├── 1-settings/    токени (map-и), брейкпоінти, :root з custom properties
├── 2-tools/       rem(), mq(), міксини: CSS не генерують
├── 3-generic/     box-sizing, reset
├── 4-elements/    стилі HTML-елементів без класів (body, h1-h3, a, img, форми)
├── 5-objects/     o-container, o-grid: структура без оформлення
├── 6-components/  c-*: BEM-блоки, один блок: один partial
├── 7-utilities/   u-*: утиліти (єдине місце, де дозволений !important)
└── main.scss
```

- Порядок підключення в `main.scss` строго від шару 1 до 7: специфічність і «вага» правил зростають («перевернутий трикутник»). Загальні правила перекриваються конкретнішими без `!important` і без хаків зі специфічністю.
- Іменування: `c-block__element--modifier`; префікс залежить від шару: `o-` об'єкти, `c-` компоненти, `u-` утиліти.
- Stylelint: `selector-class-pattern` під BEM із префіксами `o-`/`c-`/`u-`; у `3-generic` і `4-elements` заборонені класи (`selector-max-class: 0`); `declaration-no-important` вимкнено лише для `7-utilities`.
- Значення з макета лежать у map-ах `1-settings/_tokens.scss` у вигляді `(320, 744, 1260)` і через `@each` стають CSS-змінними в `:root` (з перевизначенням під `mq(md)` / `mq(lg)`).

## Модульна сітка (CSS Grid, `.o-grid`)

| Ширина | Колонки | Колонка | Gutter | Поля               |
| ------ | ------- | ------- | ------ | ------------------ |
| 320    | 2       | 130     | 20     | 20                 |
| 744    | 6       | 80      | 24     | 72                 |
| 1260   | 12      | 63      | 24     | 120 (контент 1020) |

Параметри звірені з фреймами `Grid` макета Nothing. Токени `--grid-columns`, `--grid-gutter`, `--grid-margin`; контейнер `o-container` обмежений `max-width`. Елементи стоять по колонках через міксин `grid-column($base, $md, $lg)`:

- картка товару: `span 2` / `span 6` / `span 4`;
- галерея категорій: широке фото `span 1` / `span 4` / `span 8`, вузьке `span 1` / `span 2` / `span 4`; рядки чергуються 8+4, 4+8, 8+4;
- «About us»: заголовок `1 / 7`, текст `7 / 13` (на 744: `1 / 4` і `4 / 7`);
- форма `span 5` (411px), контакти `7 / 13`.

Режим налагодження сітки: додати модифікатор `o-grid--debug`.

Кадрування (`Image logic`): hero і банер це один растр на кадр, `object-fit: cover` + `object-position: 50% 50%` повторюють `FILL WIDTH` на десктопі та `FILL HEIGHT` на 744 і 320. Hero має `fetchpriority="high"`, решта зображень `loading="lazy"`.

## Скриншоти

PerfectPixel (320 / 744 / 1260), W3C Validator, PageSpeed Insights (Mobile, Desktop): додати після перевірки опублікованої сторінки.

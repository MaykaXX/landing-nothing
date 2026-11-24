import { defineConfig } from 'vite';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

export default defineConfig(({ command, isPreview }) => ({
  // На GitHub Pages сайт лежить у підпапці репозиторію; без base стилі й зображення не завантажаться.
  // У dev-режимі Vituum віддає сторінку з кореня, тому base потрібен лише для build і preview.
  base: command === 'build' || isPreview ? '/landing-nothing/' : '/',
  build: {
    // Зображення мають лишатися окремими файлами (srcset, lazy), а не base64 в HTML.
    assetsInlineLimit: 0,
  },
  plugins: [
    // Вимикає автогенерацію +.css/+.scss з @import: у роботі @import заборонено.
    vituum({ imports: { filenamePattern: { '+.css': [], '+.scss': [] } } }),
    pug({ root: './src' }),
  ],
}));

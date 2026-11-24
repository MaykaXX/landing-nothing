// Генерує AVIF, WebP і JPEG у кількох ширинах з вихідників у images-src/.
// Запуск: npm run images
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'images-src';
const OUT_DIR = 'src/assets/images';

// Ширини залежать від префікса імені файлу. Вихідник має бути не вужчим за найбільшу ширину.
const WIDTHS = {
  work: [400, 800],
  journal: [150, 300],
};

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((file) => /\.(jpe?g|png)$/i.test(file));

for (const file of files) {
  const name = path.parse(file).name;
  const widths = WIDTHS[name.split('-')[0]] ?? [400, 800];

  for (const width of widths) {
    const image = sharp(path.join(SRC_DIR, file)).resize({ width });
    const target = `${OUT_DIR}/${name}-${width}`;

    await image.clone().avif({ quality: 50 }).toFile(`${target}.avif`);
    await image.clone().webp({ quality: 75 }).toFile(`${target}.webp`);
    await image.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${target}.jpg`);
  }

  console.log(`done: ${file} -> ${widths.join(', ')}px`);
}

// Генерує AVIF, WebP і JPEG у кількох ширинах з вихідників у images-src/.
// Запуск: npm run images
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'images-src';
const OUT_DIR = 'src/assets/images';

// Ширини за ім'ям файлу (у px). Вихідники з макета експортовано в 1x, тому більших ширин немає:
// для 2x експортуйте з Figma @2x, замініть файли в images-src/ і додайте ширини сюди.
const WIDTHS = [
  [/^(hero|banner)$/, [630, 1260]],
  [/^product-/, [216, 324]],
  [/^category-/, [249, 498]],
];

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((file) => /\.(jpe?g|png)$/i.test(file));

for (const file of files) {
  const name = path.parse(file).name;
  const widths = WIDTHS.find(([pattern]) => pattern.test(name))?.[1];

  if (!widths) {
    console.warn(`skip: ${file} (немає правила ширин)`);
    continue;
  }

  for (const width of widths) {
    const image = sharp(path.join(SRC_DIR, file)).resize({ width, withoutEnlargement: true });
    const target = `${OUT_DIR}/${name}-${width}`;

    await image.clone().avif({ quality: 50 }).toFile(`${target}.avif`);
    await image.clone().webp({ quality: 75 }).toFile(`${target}.webp`);
    await image.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${target}.jpg`);
  }

  console.log(`done: ${file} -> ${widths.join(', ')}px`);
}

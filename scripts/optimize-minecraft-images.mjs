// 保留 PNG 尺寸和 alpha；像素画不做抖动，只在体积减小时替换。
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../static/img/mc/', import.meta.url));
let before = 0;
let after = 0;
let changed = 0;

async function optimize(directory) {
  for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await optimize(file);
      continue;
    }
    if (!entry.name.endsWith('.png')) continue;
    const original = await fs.readFile(file);
    const pixels = await sharp(original).ensureAlpha().raw().toBuffer();
    let best = original;
    const candidates = [
      {compressionLevel: 9, effort: 10},
      {palette: true, colours: 128, quality: 85, dither: 0, compressionLevel: 9, effort: 10},
    ];
    for (const options of candidates) {
      const compressed = await sharp(original).png(options).toBuffer();
      if (compressed.length >= best.length) continue;
      const decoded = await sharp(compressed).ensureAlpha().raw().toBuffer();
      // 槽位边缘和附魔遮罩依赖原始透明度，不允许量化改动 alpha。
      let sameAlpha = true;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] !== decoded[index]) {
          sameAlpha = false;
          break;
        }
      }
      if (sameAlpha) best = compressed;
    }
    before += original.length;
    after += best.length;
    if (best !== original) {
      await fs.writeFile(file, best);
      changed += 1;
      console.log(`${path.relative(root, file)}: ${original.length} -> ${best.length} bytes`);
    }
  }
}

await optimize(root);
console.log(JSON.stringify({changed, before, after, saved: before - after}));

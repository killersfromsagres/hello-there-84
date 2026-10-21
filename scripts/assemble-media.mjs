// Confere se os arquivos do banner citados em src/assets/hero-url.ts existem em public/assets.
import { readFile, stat } from 'node:fs/promises';

const source = await readFile('src/assets/hero-url.ts', 'utf8');
const urls = [...source.matchAll(/'(\/assets\/[^']+)'/g)].map((m) => m[1]);
if (!urls.length) throw new Error('hero-url.ts não lista nenhum banner');
for (const url of urls) {
  const { size } = await stat(`public${url}`);
  if (size < 30_000) throw new Error(`Banner suspeito (${size} bytes): ${url}`);
  console.log(`[media] ${url}: ${size.toLocaleString()} bytes`);
}

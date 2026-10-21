import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

async function assemble(sourceDir, outputDir, outputBase, urlModulePath, pattern) {
  const files = (await readdir(sourceDir))
    .filter((name) => pattern.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) throw new Error(`No media chunks found in ${sourceDir}`);

  const encoded = (await Promise.all(files.map((name) => readFile(join(sourceDir, name), 'utf8'))))
    .join('')
    .replace(/\s+/g, '');

  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length < 30_000) throw new Error(`Hero asset looks truncated: ${bytes.length} bytes`);

  const isWebP = bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if (!isWebP) throw new Error('Hero asset is not a valid WebP file');

  const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 10);
  const outputName = `${outputBase}-${hash}.webp`;
  await mkdir(outputDir, { recursive: true });

  for (const name of await readdir(outputDir)) {
    const isHero = name === `${outputBase}.webp` || (name.startsWith(`${outputBase}-`) && name.endsWith('.webp') && name !== `${outputBase}-4k.webp`);
    if (isHero && name !== outputName) await rm(join(outputDir, name), { force: true });
  }
  await writeFile(join(outputDir, outputName), bytes);

  await writeFile(urlModulePath, `// GERADO por scripts/assemble-media.mjs — não editar à mão.\nexport const HERO_URL = '/assets/${outputName}';\n`);
  console.log(`[media] /assets/${outputName}: ${bytes.length.toLocaleString()} bytes from ${files.length} chunk(s)`);
}

await assemble('src/assets/banner-user-v2', 'public/assets', 'wicked-grin-hero', 'src/assets/hero-url.ts', /^part\d+\.b64$/);

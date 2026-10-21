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
  if (bytes.length < 20_000) {
    throw new Error(`Hero asset looks truncated: ${bytes.length} bytes from ${files.length} chunks`);
  }

  const isWebP = bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if (!isWebP) throw new Error('Hero asset is not a valid WebP file');

  // O hospedeiro serve /assets/* com cache de 1 ano (immutable). Por isso o nome do arquivo leva um
  // hash do conteúdo: trocar o banner gera uma URL nova e o navegador nunca mostra a versão antiga.
  const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 10);
  const outputName = `${outputBase}-${hash}.webp`;
  await mkdir(outputDir, { recursive: true });

  for (const name of await readdir(outputDir)) {
    const isHero = name === `${outputBase}.webp` || (name.startsWith(`${outputBase}-`) && name.endsWith('.webp') && name !== `${outputBase}-4k.webp`);
    if (isHero && name !== outputName) await rm(join(outputDir, name), { force: true });
  }
  await writeFile(join(outputDir, outputName), bytes);

  await writeFile(
    urlModulePath,
    `// GERADO por scripts/assemble-media.mjs — não editar à mão.\nexport const HERO_URL = '/assets/${outputName}';\n`,
  );
  console.log(`[media] /assets/${outputName}: ${bytes.length.toLocaleString()} bytes from ${files.length} chunk(s)`);
}

async function assembleWeaponFromDataUri(sourceModulePath, outputPath) {
  const source = await readFile(sourceModulePath, 'utf8');
  const match = source.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/);
  if (!match) throw new Error(`Weapon data URI not found in ${sourceModulePath}`);

  const bytes = Buffer.from(match[1], 'base64');
  const isWebP = bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if (!isWebP || bytes.length < 10_000) {
    throw new Error(`Weapon asset is invalid or truncated: ${bytes.length} bytes`);
  }

  await mkdir('public/assets', { recursive: true });
  await writeFile(outputPath, bytes);
  console.log(`[media] /assets/zangadao-favorite-weapon-v2.webp: ${bytes.length.toLocaleString()} bytes`);
}

// Rebuild the hero from the latest banner supplied for the site. Keeping the binary
// generated at build time avoids shipping a multi-megabyte source image in Git.
await assemble('src/assets/banner-user-v2', 'public/assets', 'wicked-grin-hero', 'src/assets/hero-url.ts', /^part\d+\.b64$/);

// A imagem da arma fica em base64 no repositório apenas como fonte textual. No build/dev,
// ela é decodificada para um arquivo WebP real no mesmo domínio do site. Isso evita bloqueio
// de data: URI por CSP e garante que o navegador consiga renderizar a imagem normalmente.
await assembleWeaponFromDataUri(
  'src/assets/zangadao-weapon-inline.ts',
  'public/assets/zangadao-favorite-weapon-v2.webp',
);

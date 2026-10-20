import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

async function assemble(sourceDir, outputPath) {
  const files = (await readdir(sourceDir))
    .filter((name) => /^part\d+\.b64$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) throw new Error(`No media chunks found in ${sourceDir}`);

  const encoded = (await Promise.all(files.map((name) => readFile(join(sourceDir, name), 'utf8')))).join('');
  const bytes = Buffer.from(encoded.replace(/\s+/g, ''), 'base64');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bytes);
  console.log(`[media] ${outputPath}: ${bytes.length.toLocaleString()} bytes from ${files.length} chunk(s)`);
}

await assemble('media-src/hero', 'public/assets/wicked-grin-hero-4k.avif');

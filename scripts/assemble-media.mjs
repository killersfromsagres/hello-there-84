import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

async function assemble(sourceDir, outputPath, pattern) {
  const files = (await readdir(sourceDir))
    .filter((name) => pattern.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) throw new Error(`No media chunks found in ${sourceDir}`);

  const encoded = (await Promise.all(files.map((name) => readFile(join(sourceDir, name), 'utf8'))))
    .join('')
    .replace(/\s+/g, '');

  const bytes = Buffer.from(encoded, 'base64');
  if (bytes.length < 100_000) {
    throw new Error(`Hero asset looks truncated: ${bytes.length} bytes from ${files.length} chunks`);
  }

  const isWebP = bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if (!isWebP) throw new Error('Hero asset is not a valid WebP file');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bytes);
  console.log(`[media] ${outputPath}: ${bytes.length.toLocaleString()} bytes from ${files.length} chunk(s)`);
}

// Rebuild the hero from the exact banner supplied for the site. Keeping the binary
// generated at build time avoids shipping a multi-megabyte source image in Git.
await assemble('src/assets/banner-user', 'public/assets/wicked-grin-hero.webp', /^part\d+\.b64$/);

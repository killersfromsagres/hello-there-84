import p0 from './banner/part0.txt?raw';
import p1 from './banner/part1.txt?raw';
import p2 from './banner/part2.txt?raw';
import p3 from './banner/part3.txt?raw';

// Banner oficial limpo: personagem + wordmark WICKED GRIN, sem botões ou patentes incorporados.
// Arquivo WebP em 2560×1440, dividido em chunks de texto para permanecer versionável no repositório.
export const wickedBanner = `data:image/webp;base64,${p0}${p1}${p2}${p3}`;

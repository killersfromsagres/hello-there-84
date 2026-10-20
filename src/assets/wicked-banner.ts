import '../banner-clean.css';
import '../glass-professional.css';
import p0 from './banner-hd/part0.txt?raw';
import p1 from './banner-hd/part1.txt?raw';
import p2 from './banner-hd/part2.txt?raw';
import p3 from './banner-hd/part3.txt?raw';
import p4 from './banner-hd/part4.txt?raw';
import p5 from './banner-hd/part5.txt?raw';
import p6 from './banner-hd/part6.txt?raw';
import p7 from './banner-hd/part7.txt?raw';
import p8 from './banner-hd/part8.txt?raw';
import p9 from './banner-hd/part9.txt?raw';
import p10 from './banner-hd/part10.txt?raw';

// Banner HD recomposto em ordem numérica e servido como WebP inline.
// Isso evita a dependência do arquivo AVIF quebrado no diretório public.
export const wickedBanner = `data:image/webp;base64,${p0}${p1}${p2}${p3}${p4}${p5}${p6}${p7}${p8}${p9}${p10}`;

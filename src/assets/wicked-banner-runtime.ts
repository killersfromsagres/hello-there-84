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

const bannerBase64 = `${p0}${p1}${p2}${p3}${p4}${p5}${p6}${p7}${p8}${p9}${p10}`.replace(/\s+/g, '');

export function createWickedBannerObjectUrl() {
  if (typeof window === 'undefined') return '';

  const binary = window.atob(bannerBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

  return URL.createObjectURL(new Blob([bytes], { type: 'image/webp' }));
}

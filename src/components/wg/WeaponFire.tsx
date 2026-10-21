import { useEffect, useRef, useState } from 'react';

/**
 * Arma com fogo realista em volta.
 *
 * 1) A silhueta (canal alfa) da própria imagem vira um "mapa de calor" contínuo, calculado uma vez no
 *    processador: o calor sobe a partir do contorno e decai com a altura, com um pouco de calor lateral.
 * 2) Um shader WebGL recorta esse calor em línguas de fogo: ruído fractal que sobe com o tempo, deformação
 *    de domínio (chamas que se curvam), altura que varia ao longo da arma, cores por temperatura
 *    (vermelho > laranja > amarelo > branco quente), brasas subindo e um halo difuso.
 * A imagem fica por cima, com luz alaranjada nas bordas (CSS). Sem WebGL cai para um brilho estático;
 * com "reduzir movimento" desenha um único quadro parado.
 */

// Margem extra do canvas ao redor da imagem, em frações da largura/altura da imagem.
// Precisa ser igual ao CSS (.wg3-weapon-fire-canvas).
const PAD_X = 0.1;
const PAD_TOP = 0.75;
const PAD_BOTTOM = 0.22;

const FIELD_WIDTH = 1000; // resolução (largura) do mapa de calor
const REACH = 0.36; // alcance vertical do calor, em frações da altura do canvas
const SIDE_REACH = 0.07; // alcance lateral, em frações da largura

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uHeat;   // R = calor das chamas, G = halo, B = calor amplo (brasas)
uniform vec2 uRes;
uniform float uTime;
uniform float uPower;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}
vec3 ramp(float v){
  vec3 c = mix(vec3(0.20, 0.0, 0.0), vec3(0.80, 0.07, 0.0), smoothstep(0.0, 0.32, v));
  c = mix(c, vec3(1.0, 0.40, 0.02), smoothstep(0.26, 0.58, v));
  c = mix(c, vec3(1.0, 0.76, 0.26), smoothstep(0.54, 0.86, v));
  return mix(c, vec3(1.0, 0.95, 0.78), smoothstep(0.88, 1.0, v));
}

void main(){
  float asp = uRes.x / uRes.y;
  vec2 uv = vUv;
  vec2 q = vec2(uv.x * asp, uv.y);   // unidade = altura do canvas
  float t = uTime;

  // deformação de domínio: as chamas se curvam e ondulam
  vec2 w = vec2(
    fbm(q * vec2(3.2, 2.2) + vec2(0.0, -t * 0.55)),
    fbm(q * vec2(3.2, 2.2) + vec2(5.2, 1.3) + vec2(0.0, -t * 0.5))
  ) - 0.5;

  vec4 H = texture2D(uHeat, uv + vec2(w.x * 0.045, w.y * 0.06));
  float heat = H.r;

  float turb  = fbm(vec2(q.x * 5.2, q.y * 3.4 - t * 1.65) + w * 1.5);
  float turb2 = fbm(vec2(q.x * 12.5, q.y * 7.6 - t * 2.9) + w * 0.9);
  float flick = smoothstep(0.22, 0.82, turb * 0.62 + turb2 * 0.38);

  // altura das chamas varia ao longo da arma (línguas altas e baixas)
  float tongue = fbm(vec2(q.x * 3.4, t * 0.5 + 4.0));
  float gain = 0.72 + (tongue - 0.35) * 1.5;

  float v = heat * gain * 1.22 - flick * 0.78 + 0.1;
  v = smoothstep(0.08, 1.05, clamp(v, 0.0, 1.0));

  float alpha = clamp(pow(v, 1.3) * 1.6, 0.0, 1.0);
  vec3 col = ramp(v) * alpha;

  // halo quente, bem discreto
  float halo = H.g * (0.075 + 0.03 * sin(t * 1.8 + w.x * 7.0));
  col += vec3(1.0, 0.25, 0.03) * halo * (1.0 - alpha * 0.7);
  alpha = max(alpha, halo * 0.5);

  // brasas
  vec2 g = vec2(q.x * 20.0, q.y * 11.0 - t * 0.8);
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float r1 = hash(id * 1.31 + 7.7);
  float r2 = hash(id * 2.17 + 3.3);
  vec2 c = (vec2(r1, r2) - 0.5) * 0.55 + vec2(sin(t * 2.0 + r1 * 31.0) * 0.16, 0.0);
  float ember = smoothstep(0.08, 0.0, length(f - c)) * step(0.9, r1);
  ember *= smoothstep(0.04, 0.55, H.b) * (0.55 + 0.45 * sin(t * 6.0 + r2 * 50.0));
  col += vec3(1.0, 0.58, 0.16) * ember;
  alpha = max(alpha, ember);

  gl_FragColor = vec4(col, alpha) * uPower;
}`;

type FireState = 'loading' | 'live' | 'static' | 'fallback';

type WeaponFireProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[WeaponFire] shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Desenha a silhueta da arma no layout do canvas, com blur opcional (via sombra, que funciona em todo navegador). */
function drawSilhouette(img: HTMLImageElement, cw: number, ch: number, x: number, y: number, w: number, h: number, blur: number) {
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const shift = cw * 2;
  ctx.shadowColor = '#fff';
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = shift;
  ctx.drawImage(img, x - shift, y, w, h);
  return ctx.getImageData(0, 0, cw, ch).data;
}

/** Desfoque de caixa horizontal (soma deslizante), várias passadas ~ gaussiana. */
function blurRows(src: Float32Array, w: number, h: number, r: number, passes = 2) {
  let a = src;
  for (let p = 0; p < passes; p += 1) {
    const out = new Float32Array(w * h);
    const inv = 1 / (2 * r + 1);
    for (let y = 0; y < h; y += 1) {
      const row = y * w;
      let sum = 0;
      for (let x = -r; x <= r; x += 1) sum += x >= 0 && x < w ? (a[row + x] ?? 0) : 0;
      for (let x = 0; x < w; x += 1) {
        out[row + x] = sum * inv;
        const add = x + r + 1;
        const del = x - r;
        sum += (add < w ? (a[row + add] ?? 0) : 0) - (del >= 0 ? (a[row + del] ?? 0) : 0);
      }
    }
    a = out;
  }
  return a;
}

/** Mapa de calor contínuo a partir da silhueta. Retorna RGBA já com as linhas invertidas (y para cima). */
function buildHeatField(sharp: Uint8ClampedArray, glow: Uint8ClampedArray, cw: number, ch: number) {
  const n = cw * ch;
  const mask = new Float32Array(n);
  for (let i = 0; i < n; i += 1) mask[i] = (sharp[i * 4 + 3] ?? 0) / 255;

  // calor vertical: sobe a partir do contorno e decai linearmente
  const up = new Float32Array(mask);
  const decayY = 1 / (REACH * ch);
  for (let y = ch - 2; y >= 0; y -= 1) {
    const row = y * cw;
    const below = row + cw;
    for (let x = 0; x < cw; x += 1) {
      const v = (up[below + x] ?? 0) - decayY;
      if (v > (up[row + x] ?? 0)) up[row + x] = v;
    }
  }
  // calor lateral: chamas curtas nas pontas e ao redor
  const side = new Float32Array(mask);
  const decayX = 1 / (SIDE_REACH * cw);
  for (let y = 0; y < ch; y += 1) {
    const row = y * cw;
    for (let x = 1; x < cw; x += 1) {
      const v = (side[row + x - 1] ?? 0) - decayX;
      if (v > (side[row + x] ?? 0)) side[row + x] = v;
    }
    for (let x = cw - 2; x >= 0; x -= 1) {
      const v = (side[row + x + 1] ?? 0) - decayX;
      if (v > (side[row + x] ?? 0)) side[row + x] = v;
    }
  }
  const heat = new Float32Array(n);
  for (let i = 0; i < n; i += 1) heat[i] = Math.max(up[i] ?? 0, (side[i] ?? 0) * 0.6);

  const smooth = blurRows(heat, cw, ch, 30, 3);
  const wide = blurRows(up, cw, ch, 44, 2);

  const out = new Uint8Array(n * 4);
  for (let y = 0; y < ch; y += 1) {
    const dstRow = (ch - 1 - y) * cw;
    for (let x = 0; x < cw; x += 1) {
      const i = y * cw + x;
      const o = (dstRow + x) * 4;
      out[o] = Math.min(255, (smooth[i] ?? 0) * 255);
      out[o + 1] = glow[i * 4 + 3] ?? 0;
      out[o + 2] = Math.min(255, (wide[i] ?? 0) * 255);
      out[o + 3] = 255;
    }
  }
  return out;
}

export function WeaponFire({ src, alt, width, height }: WeaponFireProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<FireState>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let frame = 0;
    let cleanup: (() => void) | null = null;
    const reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const source = new Image();
    source.decoding = 'async';
    source.onerror = () => !cancelled && setState('fallback');
    source.onload = () => {
      if (cancelled) return;

      const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
      if (!gl) {
        setState('fallback');
        return;
      }

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const program = gl.createProgram();
      if (!vs || !fs || !program) {
        setState('fallback');
        return;
      }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        setState('fallback');
        return;
      }
      gl.useProgram(program);

      // Layout do campo de calor = imagem + margens (PAD_*).
      const imgRatio = width / height;
      const totalW = 1 + PAD_X * 2;
      const totalH = 1 + PAD_TOP + PAD_BOTTOM;
      const cw = FIELD_WIDTH;
      const ch = Math.round((cw * totalH) / (totalW * imgRatio));
      const iw = cw / totalW;
      const ih = iw / imgRatio;
      const sharp = drawSilhouette(source, cw, ch, PAD_X * iw, PAD_TOP * ih, iw, ih, 3);
      const glow = drawSilhouette(source, cw, ch, PAD_X * iw, PAD_TOP * ih, iw, ih, 46);
      if (!sharp || !glow) {
        setState('fallback');
        return;
      }
      const field = buildHeatField(sharp, glow, cw, ch);

      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cw, ch, 0, gl.RGBA, gl.UNSIGNED_BYTE, field);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, 'uHeat'), 0);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(program, 'uRes');
      const uTime = gl.getUniformLocation(program, 'uTime');
      const uPower = gl.getUniformLocation(program, 'uPower');

      // Resolução interna: acompanha o tamanho na tela, com teto, e cai se a máquina não aguentar.
      let scale = Math.min(window.devicePixelRatio || 1, 1.5);
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(2, Math.round(Math.min(rect.width * scale, 1400)));
        const h = Math.max(2, Math.round(w * (ch / cw)));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      };
      resize();
      const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
      observer?.observe(canvas);

      const start = performance.now();
      let last = start;
      let slow = 0;
      let fast = 0;
      let drops = 0;
      const draw = (now: number) => {
        gl.uniform1f(uTime, reduced ? 3.2 : (now - start) / 1000 + 1.5);
        // entrada suave: o fogo "acende" nos primeiros 0,9 s
        const ignite = reduced ? 1 : Math.min(1, (now - start) / 900);
        gl.uniform1f(uPower, ignite * ignite * (3 - 2 * ignite));
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      const loop = (now: number) => {
        draw(now);
        const dt = now - last;
        last = now;
        if (dt > 34) slow += 1;
        else fast += 1;
        if (fast + slow >= 45) {
          if (slow > 26 && drops < 2) {
            drops += 1;
            scale *= 0.7;
            resize();
          }
          slow = 0;
          fast = 0;
        }
        frame = window.requestAnimationFrame(loop);
      };

      const onLost = (event: Event) => {
        event.preventDefault();
        window.cancelAnimationFrame(frame);
        setState('fallback');
      };
      canvas.addEventListener('webglcontextlost', onLost);

      if (reduced) {
        draw(performance.now());
        setState('static');
      } else {
        frame = window.requestAnimationFrame(loop);
        setState('live');
      }

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        observer?.disconnect();
        canvas.removeEventListener('webglcontextlost', onLost);
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    };
    source.src = src;

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [src, width, height]);

  return (
    <div className="wg3-weapon-fire" data-fire={state} style={{ aspectRatio: `${width} / ${height}`, ['--weapon-mask' as string]: `url(${src})` }}>
      <canvas ref={canvasRef} className="wg3-weapon-fire-canvas" aria-hidden="true" />
      <img className="wg3-weapon-fire-img" src={src} alt={alt} width={width} height={height} draggable={false} decoding="async" />
      <div className="wg3-weapon-fire-heat" aria-hidden="true" />
    </div>
  );
}

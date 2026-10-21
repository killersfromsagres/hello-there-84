import { Link, useRouterState } from '@tanstack/react-router';
import { Search, Volume2, VolumeX, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { HERO_URL, HERO_FALLBACK_URL } from '@/assets/hero-url';
import { getStoredMuted, installSiteAudioUnlock, setSiteAudioMuted, startSiteAudio } from '@/lib/site-audio';

// Fundo do bloco "A TAG NÃO É DADA" usa o mesmo banner, com a URL (com hash) vinda do build.
const siteVars = { '--wg3-hero-bg': `image-set(url(${HERO_URL}) type('image/avif'), url(${HERO_FALLBACK_URL}) type('image/webp'))` } as CSSProperties;

const nav = [
  ['/', 'INÍCIO'],
  ['/sobre', 'SOBRE NÓS'],
  ['/elenco', 'ELENCO'],
  ['/patentes', 'PATENTES'],
  ['/midia', 'MÍDIA'],
  ['/comunidade', 'COMUNIDADE'],
  ['/contato', 'CONTATO'],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Keep SSR and the first client render deterministic. The persisted preference is
  // read after hydration so blocked localStorage can never take down the app shell.
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(8);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Ponteiro personalizado (mira). O cursor do sistema só é escondido depois do primeiro movimento do
  // mouse, então nunca fica sem ponteiro. Só transform em rAF: nada de layout ou re-render do React.
  useEffect(() => {
    const site = siteRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!site || !ring || !dot) return;
    if (!window.matchMedia?.('(pointer: fine)').matches) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;
    let active = false;
    let lastTarget: Element | null = null;

    const place = (el: HTMLElement, px: number, py: number) => {
      el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
    };
    const tick = () => {
      frame = 0;
      const ease = reduced ? 1 : 0.24;
      rx += (x - rx) * ease;
      ry += (y - ry) * ease;
      place(ring, rx, ry);
      if (Math.abs(x - rx) > 0.15 || Math.abs(y - ry) > 0.15) frame = window.requestAnimationFrame(tick);
    };
    const classify = (target: EventTarget | null) => {
      if (!(target instanceof Element) || target === lastTarget) return;
      lastTarget = target;
      site.classList.toggle('is-pointer-field', !!target.closest('input, textarea, select, [contenteditable="true"]'));
      site.classList.toggle('is-pointer-link', !!target.closest('a[href], button, [role="button"], summary, label, .neon-btn, .ghost-btn'));
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      x = event.clientX;
      y = event.clientY;
      place(dot, x, y);
      if (!active) {
        active = true;
        rx = x;
        ry = y;
        place(ring, x, y);
        site.classList.add('wg3-pointer-on');
      }
      site.classList.remove('is-pointer-away');
      classify(event.target);
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const onDown = () => site.classList.add('is-pointer-down');
    const onUp = () => site.classList.remove('is-pointer-down');
    const onLeave = () => site.classList.add('is-pointer-away');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      site.classList.remove('wg3-pointer-on', 'is-pointer-away', 'is-pointer-down', 'is-pointer-link', 'is-pointer-field');
    };
  }, []);

  useEffect(() => {
    // Two updates instead of a 65 ms interval: the old loader forced repeated full
    // React renders while the browser was already decoding the hero and fonts.
    const advance = window.setTimeout(() => setProgress(78), 80);
    const done = window.setTimeout(() => {
      setProgress(100);
      setLoaded(true);
    }, 620);
    return () => {
      window.clearTimeout(advance);
      window.clearTimeout(done);
    };
  }, []);

  useEffect(() => {
    setMuted(getStoredMuted());
    startSiteAudio();
    return installSiteAudioUnlock();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight || !window.matchMedia?.('(pointer: fine)').matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const paint = () => {
      frame = 0;
      spotlight.style.transform = `translate3d(${Math.round(x - 210)}px, ${Math.round(y - 210)}px, 0)`;
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const activeLabel = useMemo(() => nav.find(([to]) => to === pathname)?.[1] ?? 'OPERAÇÃO', [pathname]);

  const toggleAudio = () => {
    setMuted((value) => {
      const next = !value;
      setSiteAudioMuted(next);
      return next;
    });
  };

  return (
    <div ref={siteRef} className="wg3-site" style={siteVars}>
      <div className={`wg3-preloader ${loaded ? 'is-loaded' : ''}`} aria-hidden={loaded}>
        <div className="wg3-preloader-mark">WG</div>
        <span>CARREGANDO OPERAÇÃO…</span>
        <div className="wg3-loadbar"><i style={{ width: `${progress}%` }} /></div>
        <b>{String(progress).padStart(3, '0')}%</b>
      </div>

      <div ref={ringRef} className="wg3-pointer" aria-hidden="true"><i /></div>
      <div ref={dotRef} className="wg3-pointer-dot" aria-hidden="true" />
      <div ref={spotlightRef} className="wg3-spotlight" aria-hidden="true" />
      <div className="wg3-noise" aria-hidden="true" />

      <header className={`wg3-header glass ${scrolled ? 'is-scrolled' : ''}`}>
        <Link to="/" className="wg3-brand" aria-label="Wicked Grin — início">
          <span className="wg3-brand-mark">WG</span>
          <span><strong>WICKED GRIN</strong><small>CLÃ DE COMBAT ARMS</small></span>
        </Link>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Navegação principal">
          <div className="wg3-mobile-head"><span>BASE // MENU</span><button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button></div>
          {nav.map(([to, label]) => (
            <Link key={to} to={to} className={pathname === to ? 'active' : ''}>{label}</Link>
          ))}
        </nav>
        <div className="wg3-header-actions">
          <button className="wg3-icon-btn" type="button" aria-label="Busca em breve"><Search /></button>
          <button
            className={`wg3-icon-btn wg3-audio-btn ${muted ? 'is-muted' : 'is-playing'}`}
            type="button"
            aria-pressed={muted}
            aria-label={muted ? 'Ativar música' : 'Mutar música'}
            title={muted ? 'Ativar música' : 'Mutar música'}
            onClick={toggleAudio}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
          <Link to="/contato" className="neon-btn small">ENTRAR NO CLÃ</Link>
          <button className="wg3-menu-btn" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><Menu /></button>
        </div>
      </header>

      <div className="wg3-route-label" aria-hidden="true">// {activeLabel}</div>
      {children}

      <footer className="wg3-footer">
        <div className="wg3-shell wg3-footer-grid">
          <div><span className="wg3-brand-mark">WG</span><h3>WICKED GRIN</h3><p>UNIDOS PELA HABILIDADE,<br />MOVIDOS PELA PAIXÃO.</p></div>
          <div><span className="wg3-kicker">NAVEGAÇÃO</span>{nav.slice(0, 6).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}</div>
          <div><span className="wg3-kicker">BASE</span><p>Discord: A DEFINIR</p><p>YouTube: A DEFINIR</p><p>Instagram: A DEFINIR</p></div>
          <div><span className="wg3-kicker">STATUS</span><p><i className="wg3-live-dot" /> SISTEMA ONLINE</p><p>BR // UTC-03</p></div>
        </div>
        <div className="wg3-shell wg3-legal">Combat Arms é marca registrada de seus respectivos proprietários. Este site é uma fan page não oficial do clã Wicked Grin.</div>
      </footer>
    </div>
  );
}

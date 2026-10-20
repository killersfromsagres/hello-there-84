import { Link, useRouterState } from '@tanstack/react-router';
import { Crosshair, Search, Volume2, VolumeX, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

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
  const [audio, setAudio] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setProgress((value) => Math.min(100, value + Math.ceil(Math.random() * 12))), 65);
    const done = window.setTimeout(() => { setProgress(100); setLoaded(true); }, 900);
    return () => { window.clearInterval(timer); window.clearTimeout(done); };
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
    const root = document.documentElement;
    const onMove = (event: PointerEvent) => {
      root.style.setProperty('--cursor-x', `${event.clientX}px`);
      root.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const activeLabel = useMemo(() => nav.find(([to]) => to === pathname)?.[1] ?? 'OPERAÇÃO', [pathname]);

  return (
    <div className="wg3-site">
      <div className={`wg3-preloader ${loaded ? 'is-loaded' : ''}`} aria-hidden={loaded}>
        <div className="wg3-preloader-mark">WG</div>
        <span>CARREGANDO OPERAÇÃO…</span>
        <div className="wg3-loadbar"><i style={{ width: `${progress}%` }} /></div>
        <b>{String(progress).padStart(3, '0')}%</b>
      </div>

      <div className="wg3-cursor" aria-hidden="true"><Crosshair /></div>
      <div className="wg3-spotlight" aria-hidden="true" />
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
          <button className="wg3-icon-btn" type="button" aria-label={audio ? 'Desativar sons' : 'Ativar sons'} onClick={() => setAudio((value) => !value)}>{audio ? <Volume2 /> : <VolumeX />}</button>
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

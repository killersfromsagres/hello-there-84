import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react';
import { ArrowRight, Crosshair, X } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { OperatorSpotlight } from '@/components/wg/OperatorSpotlight';
import { HERO_URL } from '@/assets/hero-url';
import { CTA, Counter, GlassCard, Marquee, MemberCard, PillarCard, SectionTitle } from '@/components/wg/UI';
import { clanStats, members, news } from '@/data/wicked-v3';
import weaponInspectorCss from '../weapon-inspector.css?url';

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Wicked Grin — Clã de Combat Arms' },
      { name: 'description', content: 'Wicked Grin: clã de Combat Arms. Unidos pela habilidade, movidos pela paixão.' },
      { property: 'og:title', content: 'Wicked Grin — Mais que um clã.' },
      { property: 'og:description', content: 'Trabalho em equipe, disciplina e a busca incansável pela grandeza.' },
      { property: 'og:image', content: HERO_URL },
    ],
    links: [{ rel: 'stylesheet', href: weaponInspectorCss }],
  }),
});

const ZANGADAO_WEAPON_URL = '/assets/zangadao-favorite-weapon-v2.webp';
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function HomePage() {
  const [video, setVideo] = useState(false);
  const [weaponInspectOpen, setWeaponInspectOpen] = useState(false);

  return <SiteShell>
    <main>
      <section className="wg3-hero wg3-hero-banner">
        <div className="wg3-hero-media" aria-hidden="true">
          <img
            src={HERO_URL}
            alt=""
            width={1672}
            height={941}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="wg3-hero-vignette" aria-hidden="true" />

        <div className="wg3-shell wg3-hero-content wg3-hero-content-banner">
          <div className="wg3-hero-banner-panel">
            <span className="wg3-kicker">// CLÃ DE COMBAT ARMS</span>
            <h1 className="wg3-sr-only">Wicked Grin</h1>
            <p><strong>UNIDOS PELA HABILIDADE.</strong><br />MOVIDOS PELA PAIXÃO.</p>
            <div className="wg3-hero-actions">
              <Link to="/contato" className="neon-btn">ALISTAR-SE <ArrowRight /></Link>
              <Link to="/elenco" className="ghost-btn">VER ELENCO</Link>
              <button type="button" className="ghost-btn" onClick={() => setVideo(true)}>TRAILER</button>
            </div>
          </div>
        </div>
        <div className="wg3-hero-hud"><span>WG // 27493</span><span>OPERAÇÃO: GREEN MOON</span><span>STATUS: ONLINE</span></div>
      </section>

      <section className="wg3-section wg3-shell">
        <SectionTitle code="01" eyebrow="NOSSO CÓDIGO" title="MAIS QUE UM CLÃ." text="Nós jogamos. Nós competimos. Nós deixamos nossa marca." />
        <div className="wg3-pillar-grid"><PillarCard index="01" icon="team" title="TRABALHO EM EQUIPE" text="Juntos somos mais fortes" /><PillarCard index="02" icon="comp" title="COMPETIÇÃO" text="Sempre mais alto" /><PillarCard index="03" icon="legacy" title="LEGADO" text="Feito para durar" /></div>
      </section>

      <section className="wg3-stats-band"><div className="wg3-shell wg3-stats-grid">{clanStats.map((item) => <Counter key={item.label} {...item} />)}</div></section>

      <section className="wg3-section wg3-shell">
        <SectionTitle code="02" eyebrow="ELENCO" title="OPERADORES EM DESTAQUE" text="Conheça quem carrega a tag Wicked Grin no campo de batalha." />
        <div className="wg3-featured-layout">
          <div className="wg3-spotlight-stack">
            <OperatorSpotlight nick="Zangadao SBC" image="/assets/operators/zangadao-sbc.webp" imageWidth={840} imageHeight={1120} />
            <button type="button" className="ghost-btn wg3-weapon-trigger" onClick={() => setWeaponInspectOpen(true)}>
              ARMA FAVORITA DO PLAYER <ArrowRight />
            </button>
          </div>
          <div className="wg3-member-grid">{members.filter((m) => m.featured).map((member) => <MemberCard key={member.id} member={member} />)}</div>
        </div>
        <div className="wg3-section-action"><Link to="/elenco" className="ghost-btn">ABRIR ELENCO COMPLETO <ArrowRight /></Link></div>
      </section>

      <section className="wg3-section wg3-deep-section"><div className="wg3-shell"><SectionTitle code="03" eyebrow="INTEL" title="ÚLTIMAS TRANSMISSÕES" />
        <div className="wg3-news-grid">{news.map((item) => <GlassCard key={item.title} className="wg3-news-card"><span className="wg3-kicker">{item.tag} // {item.date}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#" onClick={(e) => e.preventDefault()}>LER ARQUIVO <ArrowRight /></a></GlassCard>)}</div>
      </div></section>

      <CTA title="A TAG NÃO É DADA. É CONQUISTADA." text="Se você joga pelo time, aceita evolução e quer competir com disciplina, abra seu dossiê de alistamento." />
      <Marquee />
    </main>

    {video && <div className="wg3-modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setVideo(false)}><div className="wg3-video-modal glass" role="dialog" aria-modal="true" aria-label="Trailer Wicked Grin"><button onClick={() => setVideo(false)} aria-label="Fechar"><X /></button><Crosshair /><span className="wg3-kicker">TRANSMISSÃO NÃO CONFIGURADA</span><h2>TRAILER DO CLÃ</h2><p>Envie o link do YouTube ou arquivo de vídeo para ativar esta transmissão.</p></div></div>}
    {weaponInspectOpen && <WeaponInspectModal onClose={() => setWeaponInspectOpen(false)} />}
  </SiteShell>;
}

function WeaponInspectModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState({ x: -7, y: -12, zoom: 1 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current = { x: event.clientX, y: event.clientY };
    setView((current) => ({
      ...current,
      y: clamp(current.y + dx * .28, -62, 62),
      x: clamp(current.x - dy * .2, -28, 28),
    }));
  };

  const stopDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setView((current) => ({
      ...current,
      zoom: clamp(current.zoom + (event.deltaY < 0 ? .08 : -.08), .72, 1.5),
    }));
  };

  const reset = () => setView({ x: -7, y: -12, zoom: 1 });

  return (
    <div className="wg3-weapon-backdrop" role="presentation" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="wg3-weapon-modal" role="dialog" aria-modal="true" aria-label="Arma favorita do player Zangadao SBC">
        <aside className="wg3-weapon-panel">
          <span className="wg3-kicker">LOADOUT // ZANGADAO SBC</span>
          <h2>ARMA FAVORITA <em>DO PLAYER</em></h2>
          <p>Modo de inspeção inspirado em jogos FPS. Segure e arraste para examinar a arma; use a roda do mouse para aproximar ou afastar.</p>
          <div className="wg3-weapon-specs">
            <div className="wg3-weapon-spec"><b>OPERADOR</b><span>Zangadao SBC</span></div>
            <div className="wg3-weapon-spec"><b>INSPEÇÃO</b><span>Arrastar + zoom interativo</span></div>
            <div className="wg3-weapon-spec"><b>STATUS</b><span>Loadout favorito // ativo</span></div>
          </div>
        </aside>

        <div className="wg3-weapon-main">
          <header className="wg3-weapon-toolbar">
            <span className="wg3-kicker">WEAPON INSPECT // ONLINE</span>
            <button type="button" className="wg3-weapon-close" onClick={onClose} aria-label="Fechar inspeção"><X /></button>
          </header>

          <div
            className={`wg3-weapon-stage${dragging ? ' is-dragging' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            onLostPointerCapture={stopDrag}
            onWheel={onWheel}
            aria-label="Área interativa para inspecionar a arma"
          >
            <div className="wg3-weapon-scan" aria-hidden="true" />
            <div
              className="wg3-weapon-object"
              style={{ transform: `rotateX(${view.x}deg) rotateY(${view.y}deg) scale(${view.zoom})` }}
            >
              <img src={ZANGADAO_WEAPON_URL} alt="Arma favorita de Zangadao SBC" draggable={false} />
            </div>
          </div>

          <footer className="wg3-weapon-footer">
            <div className="wg3-weapon-hint"><span>SEGURE + ARRASTE</span><span>SCROLL = ZOOM</span><span>ESC = FECHAR</span></div>
            <div className="wg3-weapon-actions">
              <button type="button" onClick={() => setView((current) => ({ ...current, y: clamp(current.y - 12, -62, 62) }))}>GIRAR ESQ.</button>
              <button type="button" onClick={reset}>RESETAR</button>
              <button type="button" onClick={() => setView((current) => ({ ...current, y: clamp(current.y + 12, -62, 62) }))}>GIRAR DIR.</button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

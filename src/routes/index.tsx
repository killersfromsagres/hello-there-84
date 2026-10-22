import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowRight, Crosshair, X } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { OperatorSpotlight } from '@/components/wg/OperatorSpotlight';
import { HERO_URL, HERO_FALLBACK_URL } from '@/assets/hero-url';
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
      { property: 'og:image', content: HERO_FALLBACK_URL },
    ],
    links: [{ rel: 'stylesheet', href: weaponInspectorCss }],
  }),
});

// Arquivo real em public/assets (nome com hash do conteúdo: o host guarda /assets por 1 ano).
const ZANGADAO_WEAPON_URL = '/assets/zangadao-favorite-weapon-83a8cdb3fc.webp';
const ZANGADAO_WEAPON_SIZE = { width: 2172, height: 724 };

function HomePage() {
  const [video, setVideo] = useState(false);
  const [weaponInspectOpen, setWeaponInspectOpen] = useState(false);

  return <SiteShell>
    <main>
      <section className="wg3-hero wg3-hero-banner">
        <div className="wg3-hero-media" aria-hidden="true">
          <picture>
            <source srcSet={HERO_URL} type="image/avif" />
            <img
              src={HERO_FALLBACK_URL}
              alt=""
              width={3072}
              height={2048}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
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

  return (
    <div className="wg3-weapon-backdrop" role="presentation" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="wg3-weapon-modal" role="dialog" aria-modal="true" aria-label="Arma favorita do player Zangadao SBC">
        <aside className="wg3-weapon-panel">
          <span className="wg3-kicker">LOADOUT // ZANGADAO SBC</span>
          <h2>ARMA FAVORITA <em>DO PLAYER</em></h2>
          <p>O loadout favorito de Zangadao SBC no campo de batalha.</p>
          <div className="wg3-weapon-specs">
            <div className="wg3-weapon-spec"><b>OPERADOR</b><span>Zangadao SBC</span></div>
            <div className="wg3-weapon-spec"><b>STATUS</b><span>Loadout favorito // ativo</span></div>
          </div>
        </aside>

        <div className="wg3-weapon-main">
          <header className="wg3-weapon-toolbar">
            <span className="wg3-kicker">ARMA FAVORITA // ATIVA</span>
            <button type="button" className="wg3-weapon-close" onClick={onClose} aria-label="Fechar"><X /></button>
          </header>

          <div className="wg3-weapon-stage">
            <img className="wg3-weapon-img" src={ZANGADAO_WEAPON_URL} alt="Arma favorita de Zangadao SBC" width={ZANGADAO_WEAPON_SIZE.width} height={ZANGADAO_WEAPON_SIZE.height} decoding="async" />
          </div>

          <footer className="wg3-weapon-footer">
            <span className="wg3-weapon-hint">ESC = FECHAR</span>
          </footer>
        </div>
      </section>
    </div>
  );
}

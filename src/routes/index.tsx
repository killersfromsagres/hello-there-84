import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { CTA, Counter, GlassCard, Marquee, MemberCard, PillarCard, SectionTitle } from '@/components/wg/UI';
import { clanStats, members, news } from '@/data/wicked-v3';
import { wickedBanner } from '@/assets/wicked-banner';

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({ meta: [
    { title: 'Wicked Grin — Clã de Combat Arms' },
    { name: 'description', content: 'Wicked Grin: clã de Combat Arms. Unidos pela habilidade, movidos pela paixão.' },
    { property: 'og:title', content: 'Wicked Grin — Mais que um clã.' },
    { property: 'og:description', content: 'Trabalho em equipe, disciplina e a busca incansável pela grandeza.' },
  ] }),
});

function HomePage() {
  return <SiteShell>
    <main>
      <section className="wg3-hero wg3-hero-banner-only">
        <div className="wg3-hero-media" aria-hidden="true">
          <img src={wickedBanner} alt="" fetchPriority="high" decoding="async" />
        </div>
        <div className="wg3-hero-vignette" />
        <div className="wg3-moon-glow" />
        <div className="wg3-god-rays" />
        <div className="wg3-fog fog-a" /><div className="wg3-fog fog-b" />
        <div className="wg3-particles" aria-hidden="true">{Array.from({ length: 20 }, (_, i) => <i key={i} style={{ '--i': i } as React.CSSProperties} />)}</div>
        <div className="wg3-hero-hud"><span>WG // 27493</span><span>OPERAÇÃO: GREEN MOON</span><span>STATUS: ONLINE</span></div>
      </section>

      <section className="wg3-section wg3-shell">
        <SectionTitle code="01" eyebrow="NOSSO CÓDIGO" title="MAIS QUE UM CLÃ." text="Nós jogamos. Nós competimos. Nós deixamos nossa marca." />
        <div className="wg3-pillar-grid"><PillarCard index="01" icon="team" title="TRABALHO EM EQUIPE" text="Juntos somos mais fortes" /><PillarCard index="02" icon="comp" title="COMPETIÇÃO" text="Sempre mais alto" /><PillarCard index="03" icon="legacy" title="LEGADO" text="Feito para durar" /></div>
      </section>

      <section className="wg3-stats-band"><div className="wg3-shell wg3-stats-grid">{clanStats.map((item) => <Counter key={item.label} {...item} />)}</div></section>

      <section className="wg3-section wg3-shell">
        <SectionTitle code="02" eyebrow="ELENCO" title="OPERADORES EM DESTAQUE" text="Conheça quem carrega a tag Wicked Grin no campo de batalha." />
        <div className="wg3-member-grid">{members.filter((m) => m.featured).map((member) => <MemberCard key={member.id} member={member} />)}</div>
        <div className="wg3-section-action"><Link to="/elenco" className="ghost-btn">ABRIR ELENCO COMPLETO <ArrowRight /></Link></div>
      </section>

      <section className="wg3-section wg3-deep-section"><div className="wg3-shell"><SectionTitle code="03" eyebrow="INTEL" title="ÚLTIMAS TRANSMISSÕES" />
        <div className="wg3-news-grid">{news.map((item) => <GlassCard key={item.title} className="wg3-news-card"><span className="wg3-kicker">{item.tag} // {item.date}</span><h3>{item.title}</h3><p>{item.text}</p><a href="#" onClick={(e) => e.preventDefault()}>LER ARQUIVO <ArrowRight /></a></GlassCard>)}</div>
      </div></section>

      <CTA title="A TAG NÃO É DADA. É CONQUISTADA." text="Se você joga pelo time, aceita evolução e quer competir com disciplina, abra seu dossiê de alistamento." />
      <Marquee />
    </main>
  </SiteShell>;
}

import { createFileRoute } from '@tanstack/react-router';
import { SiteShell } from '@/components/wg/SiteShell';
import { GlassCard, RankCard, SectionTitle } from '@/components/wg/UI';
import { hierarchy, ranks } from '@/data/wicked-v3';

export const Route = createFileRoute('/patentes')({ component: RanksPage, head: () => ({ meta: [{ title: 'Patentes — Wicked Grin' }, { name: 'description', content: 'Progressão de patentes e hierarquia interna do clã Wicked Grin.' }] }) });

function RanksPage() {
  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ARQUIVO // PROGRESSÃO</span><h1>PATENTES <em>& HIERARQUIA</em></h1><p>As imagens oficiais serão usadas apenas a partir dos arquivos fornecidos pelo clã.</p></div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="01" eyebrow="PATENTES DE COMBAT ARMS" title="PROGRESSÃO DE CAMPO" text="Os nomes, níveis e imagens abaixo estão marcados como A DEFINIR até você enviar os arquivos oficiais e a lista correta." />
      <div className="wg3-rank-grid">{ranks.map((rank) => <RankCard key={rank.id} rank={rank} />)}</div>
    </section>
    <section className="wg3-section wg3-deep-section"><div className="wg3-shell"><SectionTitle code="02" eyebrow="HIERARQUIA INTERNA" title="CADEIA DE COMANDO" />
      <div className="wg3-hierarchy">{hierarchy.map(([name, text], index) => <GlassCard key={name}><span>{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3><p>{text}</p></GlassCard>)}</div>
    </div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="03" eyebrow="PROGRESSÃO" title="DO RECRUTA AO COMANDO" /><div className="wg3-progression">{hierarchy.slice().reverse().map(([name], index) => <div key={name}><i /><span>FASE {String(index + 1).padStart(2, '0')}</span><strong>{name}</strong></div>)}</div></section>
  </main></SiteShell>;
}

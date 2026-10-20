import { createFileRoute } from '@tanstack/react-router';
import { SiteShell } from '@/components/wg/SiteShell';
import { GlassCard, SectionTitle } from '@/components/wg/UI';
import { rules, timeline } from '@/data/wicked-v3';

export const Route = createFileRoute('/sobre')({ component: AboutPage, head: () => ({ meta: [{ title: 'Sobre Nós — Wicked Grin' }, { name: 'description', content: 'História, valores e código de conduta do clã Wicked Grin.' }] }) });

function AboutPage() {
  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ARQUIVO // HISTÓRIA</span><h1>SOBRE <em>NÓS</em></h1><p>Mais que um jogo, é uma irmandade construída em trabalho em equipe, disciplina e ambição competitiva.</p></div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="01" eyebrow="LINHA DO TEMPO" title="NOSSA MISSÃO NÃO COMEÇOU ONTEM." />
      <div className="wg3-timeline">{timeline.map(([title, text], index) => <div key={title} className="wg3-timeline-item"><span>{String(index + 1).padStart(2, '0')}</span><GlassCard><small>{title}</small><h3>{text}</h3></GlassCard></div>)}</div>
    </section>
    <section className="wg3-section wg3-deep-section"><div className="wg3-shell"><SectionTitle code="02" eyebrow="CÓDIGO DE CONDUTA" title="REGRAS DO ESQUADRÃO" />
      <div className="wg3-rules-grid">{rules.map(([code, title, text]) => <GlassCard key={code} className="wg3-rule-card"><span className="wg3-code">{code}</span><h3>{title}</h3><p>{text}</p></GlassCard>)}</div>
    </div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="03" eyebrow="LIDERANÇA" title="COMANDO WICKED GRIN" text="Os nomes reais da liderança podem ser atualizados no arquivo de dados ou pelo painel admin após conectar o Supabase." /><div className="wg3-leadership"><GlassCard><span className="wg3-kicker">LÍDER</span><h3>REAPER</h3><p>Direção estratégica, padrão competitivo e cultura do clã.</p></GlassCard><GlassCard><span className="wg3-kicker">SUB-LÍDER</span><h3>GHOST</h3><p>Coordenação operacional, treinos e suporte ao comando.</p></GlassCard></div></section>
  </main></SiteShell>;
}

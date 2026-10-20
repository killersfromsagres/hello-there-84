import { createFileRoute } from '@tanstack/react-router';
import { CalendarDays, MessageCircle, Youtube, Instagram, Trophy } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { GlassCard, SectionTitle } from '@/components/wg/UI';

export const Route = createFileRoute('/comunidade')({ component: CommunityPage, head: () => ({ meta: [{ title: 'Comunidade — Wicked Grin' }, { name: 'description', content: 'Discord, eventos e comunidade Wicked Grin.' }] }) });

function CommunityPage() {
  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">BASE // COMUNIDADE</span><h1>NOSSA <em>BASE</em></h1><p>Treinos, avisos, eventos e tudo que mantém o esquadrão conectado fora da partida.</p></div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="01" eyebrow="CANAIS" title="CENTRAL DE COMUNICAÇÃO" />
      <div className="wg3-social-grid"><GlassCard><MessageCircle /><span className="wg3-kicker">DISCORD</span><h3>SERVIDOR PRINCIPAL</h3><p>Link e ID do servidor: A DEFINIR.</p><span className="wg3-pending">PENDENTE</span></GlassCard><GlassCard><Youtube /><span className="wg3-kicker">YOUTUBE</span><h3>TRANSMISSÕES</h3><p>Canal oficial: A DEFINIR.</p><span className="wg3-pending">PENDENTE</span></GlassCard><GlassCard><Instagram /><span className="wg3-kicker">INSTAGRAM / TIKTOK</span><h3>CLIPES & BASTIDORES</h3><p>Perfis sociais: A DEFINIR.</p><span className="wg3-pending">PENDENTE</span></GlassCard></div>
    </section>
    <section className="wg3-section wg3-deep-section"><div className="wg3-shell"><SectionTitle code="02" eyebrow="AGENDA" title="CALENDÁRIO OPERACIONAL" />
      <div className="wg3-event-grid">{['TREINO TÁTICO','PARTIDA INTERNA','SCRIM / DESAFIO'].map((title, index) => <GlassCard key={title}><CalendarDays /><span className="wg3-kicker">EVENTO {String(index + 1).padStart(2, '0')} // A DEFINIR</span><h3>{title}</h3><p>Data, horário e adversário serão gerenciados pelo painel admin após configuração do backend.</p></GlassCard>)}</div>
    </div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="03" eyebrow="HALL DA FAMA" title="NOMES QUE DEIXARAM MARCA" /><GlassCard className="wg3-hall"><Trophy /><h3>ARQUIVO EM CONSTRUÇÃO</h3><p>Prêmios, temporadas, MVPs e conquistas reais entram aqui quando os dados forem enviados.</p></GlassCard></section>
  </main></SiteShell>;
}

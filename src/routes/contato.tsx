import { createFileRoute } from '@tanstack/react-router';
import { Crosshair, ShieldCheck, Users } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { RecruitForm, } from '@/components/wg/RecruitForm';
import { GlassCard, SectionTitle } from '@/components/wg/UI';

export const Route = createFileRoute('/contato')({ component: ContactPage, head: () => ({ meta: [{ title: 'Alistamento — Wicked Grin' }, { name: 'description', content: 'Formulário de recrutamento do clã Wicked Grin.' }] }) });

function ContactPage() {
  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">RECRUTAMENTO // ABERTO</span><h1>ALISTE-<em>SE</em></h1><p>Boa mira abre a porta. Disciplina, comunicação e compromisso decidem quem fica.</p></div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="01" eyebrow="MISSÃO" title="ANTES DE ENVIAR O DOSSIÊ" /><div className="wg3-recruit-layout"><aside className="wg3-recruit-requirements"><GlassCard><Crosshair /><h3>HABILIDADE</h3><p>Consistência, leitura de jogo e domínio da sua função.</p></GlassCard><GlassCard><Users /><h3>EQUIPE</h3><p>Call limpa, presença e capacidade de executar em conjunto.</p></GlassCard><GlassCard><ShieldCheck /><h3>CONDUTA</h3><p>Jogo limpo, respeito e maturidade para receber feedback.</p></GlassCard></aside><RecruitForm /></div></section>
  </main></SiteShell>;
}

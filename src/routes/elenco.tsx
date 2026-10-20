import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { MemberCard, SectionTitle } from '@/components/wg/UI';
import { members, type Member } from '@/data/wicked-v3';

export const Route = createFileRoute('/elenco')({ component: RosterPage, head: () => ({ meta: [{ title: 'Elenco — Wicked Grin' }, { name: 'description', content: 'Elenco e operadores do clã Wicked Grin.' }] }) });

function RosterPage() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('Todos');
  const [selected, setSelected] = useState<Member | null>(null);
  const filtered = useMemo(() => members.filter((m) => m.nick.toLowerCase().includes(query.toLowerCase()) && (specialty === 'Todos' || m.specialty === specialty)), [query, specialty]);
  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ROSTER // OPERADORES</span><h1>ELENCO <em>WICKED</em></h1><p>Um esquadrão não é uma lista de nicks. É função, confiança e execução.</p></div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="01" eyebrow="ROSTER" title="FICHA DE OPERADORES" />
      <div className="wg3-roster-tools glass"><label><span>BUSCAR NICK</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Digite um operador..." /></label><div><span>FUNÇÃO</span>{['Todos','Rifleman','Sniper','Suporte','Entry'].map((item) => <button key={item} className={specialty === item ? 'active' : ''} onClick={() => setSpecialty(item)}>{item}</button>)}</div></div>
      <div className="wg3-member-grid full">{filtered.map((member) => <MemberCard key={member.id} member={member} onOpen={() => setSelected(member)} />)}</div>
    </section>
    {selected && <div className="wg3-modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><article className="wg3-member-modal glass" role="dialog" aria-modal="true"><button className="wg3-modal-close" onClick={() => setSelected(null)} aria-label="Fechar"><X /></button><span className="wg3-kicker">{selected.id} // {selected.role}</span><h2>{selected.nick}</h2><dl><div><dt>FUNÇÃO</dt><dd>{selected.specialty}</dd></div><div><dt>PATENTE</dt><dd>{selected.rank}</dd></div><div><dt>K/D</dt><dd>{selected.kd ?? '—'}</dd></div><div><dt>STATUS</dt><dd>{selected.status.toUpperCase()}</dd></div></dl><p>Ficha preparada para receber avatar, redes sociais e dados reais via painel admin.</p></article></div>}
  </main></SiteShell>;
}

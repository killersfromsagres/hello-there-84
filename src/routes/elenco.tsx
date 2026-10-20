import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Crosshair, X } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { MemberCard, RankBadge, SectionTitle } from '@/components/wg/UI';
import { members, type Member } from '@/data/wicked-v3';

export const Route = createFileRoute('/elenco')({ component: RosterPage, head: () => ({ meta: [{ title: 'Elenco — Wicked Grin' }, { name: 'description', content: 'Elenco, fotos, funções e patentes dos operadores do clã Wicked Grin.' }] }) });

function RosterPage() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('Todos');
  const [rank, setRank] = useState('Todos');
  const [selected, setSelected] = useState<Member | null>(null);
  const rankOptions = useMemo(() => ['Todos', ...Array.from(new Set(members.map((member) => member.rankCode)))], []);
  const filtered = useMemo(() => members.filter((m) => m.nick.toLowerCase().includes(query.toLowerCase()) && (specialty === 'Todos' || m.specialty === specialty) && (rank === 'Todos' || m.rankCode === rank)), [query, specialty, rank]);

  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ROSTER // OPERADORES</span><h1>ELENCO <em>WICKED</em></h1><p>Cada operador recebe foto, função e insígnia de patente em uma ficha visual única.</p></div></section>
    <section className="wg3-section wg3-shell"><SectionTitle code="01" eyebrow="ROSTER" title="FICHA DE OPERADORES" text="Use o painel de comando para cadastrar a foto do integrante e atribuir uma das patentes fornecidas pelo clã." />
      <div className="wg3-roster-tools glass"><label><span>BUSCAR NICK</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Digite um operador..." /></label><div><span>FUNÇÃO</span>{['Todos','Rifleman','Sniper','Suporte','Entry'].map((item) => <button type="button" key={item} className={specialty === item ? 'active' : ''} onClick={() => setSpecialty(item)}>{item}</button>)}</div><div><span>PATENTE</span>{rankOptions.map((item) => <button type="button" key={item} className={rank === item ? 'active' : ''} onClick={() => setRank(item)}>{item === 'Todos' ? item : item.replace('RANK-', '#')}</button>)}</div></div>
      <div className="wg3-member-grid full">{filtered.map((member) => <MemberCard key={member.id} member={member} onOpen={() => setSelected(member)} />)}</div>
    </section>
    {selected && <div className="wg3-modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><article className="wg3-member-modal wg3-member-profile glass" role="dialog" aria-modal="true" aria-labelledby="wg3-member-name"><button className="wg3-modal-close" onClick={() => setSelected(null)} aria-label="Fechar"><X /></button><div className="wg3-profile-visual">{selected.photoUrl ? <img src={selected.photoUrl} alt={`Foto de ${selected.nick}`} /> : <div className="wg3-profile-fallback"><Crosshair /><span>{selected.nick.slice(0, 2)}</span></div>}<RankBadge code={selected.rankCode} /></div><div className="wg3-profile-copy"><span className="wg3-kicker">{selected.id} // {selected.role}</span><h2 id="wg3-member-name">{selected.nick}</h2><dl><div><dt>FUNÇÃO</dt><dd>{selected.specialty}</dd></div><div><dt>PATENTE</dt><dd>{selected.rankCode}</dd></div><div><dt>K/D</dt><dd>{selected.kd ?? '—'}</dd></div><div><dt>STATUS</dt><dd>{selected.status.toUpperCase()}</dd></div></dl><p>Foto e patente podem ser alteradas pelo painel administrativo conectado ao Supabase.</p></div></article></div>}
  </main></SiteShell>;
}

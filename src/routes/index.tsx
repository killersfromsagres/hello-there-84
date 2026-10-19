import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Grin, TacticalIcon } from '@/components/clan/marks';
import { Recruitment } from '@/components/clan/recruitment';
import { clanConfig, conduct, members, type Hierarchy, type Member } from '@/data/clan';
import { wickedBanner } from '@/assets/wicked-banner';
import '../banner-v2.css';

export const Route = createFileRoute('/')({
  component: WickedGrinPage,
  head: () => ({
    meta: [
      { title: 'WICKED GRIN — Clã de Combat Arms' },
      { name: 'description', content: 'WICKED GRIN: clã tático de Combat Arms. Conheça o esquadrão, as regras e o recrutamento.' },
      { property: 'og:title', content: 'WICKED GRIN — Sorrimos antes do primeiro tiro.' },
      { property: 'og:description', content: 'Precisão, disciplina e caos controlado.' },
      { property: 'og:image', content: '/og-wicked-grin.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});

const nav = [
  ['inicio', 'Início'],
  ['sobre', 'Sobre'],
  ['membros', 'Membros'],
  ['regras', 'Regras'],
  ['recrutamento', 'Recrutamento'],
  ['comunidade', 'Comunidade'],
] as const;

const groups: Hierarchy[] = ['Comando', 'Oficiais', 'Soldados', 'Recrutas'];

function SectionHead({ n, kicker, title, text }: { n: string; kicker: string; title: string; text?: string }) {
  return (
    <header className="wg-section-head">
      <span className="wg-section-code">// {n}</span>
      <div>
        <span className="wg-eyebrow">{kicker}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </header>
  );
}

function RankInsignia({ rank }: { rank: Member['rank'] }) {
  const stars = rank === 'General' ? 3 : rank === 'Coronel' ? 2 : rank === 'Major' ? 1 : 0;
  const bars = rank === 'Capitão' ? 3 : rank === 'Tenente' ? 2 : rank === 'Sargento' ? 1 : 2;
  return (
    <svg className="wg-rank-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M10 42 32 52 54 42 49 49 32 58 15 49Z" />
      {[...Array(stars)].map((_, index) => <path key={`s-${index}`} d={`M${18 + index * 14} 12l2.2 4.8 5.2.6-3.8 3.5 1 5.1-4.6-2.5-4.6 2.5 1-5.1-3.8-3.5 5.2-.6Z`} />)}
      {stars === 0 && [...Array(bars)].map((_, index) => <path key={`b-${index}`} d={`M16 ${18 + index * 8} 32 ${26 + index * 8} 48 ${18 + index * 8}v6L32 ${32 + index * 8} 16 ${24 + index * 8}Z`} />)}
    </svg>
  );
}

function MemberCard({ member, onOpen }: { member: Member; onOpen: (member: Member) => void }) {
  return (
    <button className="wg-member-card wg-glass" type="button" onClick={() => onOpen(member)} aria-label={`Abrir ficha de ${member.nick}`}>
      <div className="wg-card-corners" aria-hidden="true" />
      <div className="wg-avatar-frame"><Grin /><span>{member.nick.slice(0, 2)}</span></div>
      <div className="wg-member-status"><i className={member.online ? 'online' : ''} /> {member.online ? 'ONLINE' : 'OFFLINE'}</div>
      <div className="wg-member-main"><span className="wg-member-role">{member.role}</span><h3>{member.nick}</h3><p>{member.function} · {member.weapon}</p></div>
      <div className="wg-member-meta"><span><RankInsignia rank={member.rank} />{member.rank}</span><b>{member.id}</b></div>
    </button>
  );
}

function WickedGrinPage() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('inicio');
  const [query, setQuery] = useState('');
  const [rank, setRank] = useState('Todos');
  const [role, setRole] = useState('Todos');
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    const sections = nav.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: '-25% 0px -55%', threshold: [0.1, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const ranks = useMemo(() => ['Todos', ...Array.from(new Set(members.map((member) => member.rank)))], []);
  const functions = useMemo(() => ['Todos', ...Array.from(new Set(members.map((member) => member.function)))], []);
  const filtered = useMemo(() => members.filter((member) => {
    const matchesQuery = member.nick.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (rank === 'Todos' || member.rank === rank) && (role === 'Todos' || member.function === role);
  }), [query, rank, role]);

  return (
    <div className="wg-site">
      <a href="#sobre" className="wg-skip">Ir para o conteúdo</a>

      <section id="inicio" className="wg-hero" aria-label="Início WICKED GRIN">
        <img
          src={wickedBanner}
          className="wg-hero-art"
          alt="Arte oficial WICKED GRIN com personagem mascarado e lettering do clã"
          width={1672}
          height={941}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          draggable={false}
        />
        <div className="wg-hero-vignette" aria-hidden="true" />
        <div className="wg-tactical-grid" aria-hidden="true" />

        <header className="wg-nav wg-glass">
          <a href="#inicio" className="wg-brand" aria-label="Wicked Grin — início"><Grin /><span><b>WICKED</b><strong>GRIN</strong><small>TACTICAL UNIT</small></span></a>
          <nav className={menu ? 'is-open' : ''} aria-label="Navegação principal">
            {nav.map(([id, label]) => <a key={id} className={active === id ? 'active' : ''} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
          </nav>
          <a href="#recrutamento" className="wg-btn wg-btn-critical wg-nav-cta">Recrutamento</a>
          <button className="wg-menu" type="button" aria-expanded={menu} aria-label={menu ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenu((value) => !value)}><span /><span /><span /></button>
        </header>
      </section>

      <main>
        <section id="sobre" className="wg-section wg-shell">
          <SectionHead n="01" kicker="SOBRE O CLÃ" title="DISCIPLINA PARA VENCER. HUMOR PARA SOBREVIVER." />
          <div className="wg-about wg-glass">
            <article><p>WICKED GRIN é um clã para quem entende que mira boa sem comunicação vira highlight perdido. Jogamos com call limpa, pressão coordenada e respeito por quem veste a tag.</p><strong>“O placar fala. A gente só sorri.”</strong></article>
            <div className="wg-pillars"><div><TacticalIcon kind="target" /><b>PRECISÃO</b><span>Decisão rápida, tiro limpo.</span></div><div><TacticalIcon kind="shield" /><b>LEALDADE</b><span>O time vem antes do ego.</span></div><div><TacticalIcon kind="signal" /><b>COMUNICAÇÃO</b><span>Call curta. Informação útil.</span></div></div>
          </div>
        </section>

        <section id="membros" className="wg-section wg-section-deep">
          <div className="wg-shell">
            <SectionHead n="02" kicker="MEMBROS DO CLÃ" title="FICHA DE COMBATE" text="Busque, filtre e abra a ficha de cada operador. Os dados ficam centralizados em src/data/clan.ts." />
            <div className="wg-member-tools wg-glass"><label className="wg-search"><span>BUSCAR OPERADOR</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Digite um nick..." /></label><div className="wg-filter-row"><span>PATENTE</span>{ranks.map((item) => <button key={item} type="button" className={`wg-filter ${rank === item ? 'active' : ''}`} onClick={() => setRank(item)}>{item}</button>)}</div><div className="wg-filter-row"><span>FUNÇÃO</span>{functions.map((item) => <button key={item} type="button" className={`wg-filter ${role === item ? 'active' : ''}`} onClick={() => setRole(item)}>{item}</button>)}</div></div>

            <div className="wg-member-groups">
              {groups.map((group) => {
                const groupMembers = filtered.filter((member) => member.hierarchy === group);
                if (!groupMembers.length) return null;
                return <section className="wg-member-group" key={group}><header><span>// {group.toUpperCase()}</span><i /></header><div className="wg-member-grid">{groupMembers.map((member) => <MemberCard key={member.id} member={member} onOpen={setSelected} />)}</div></section>;
              })}
              {!filtered.length && <p className="wg-empty">Nenhum operador encontrado com esses filtros.</p>}
            </div>
          </div>
        </section>

        <section id="regras" className="wg-section wg-shell">
          <SectionHead n="03" kicker="REGRAS" title="SEM DISCIPLINA, SEM TAG." />
          <div className="wg-rules">{conduct.map(([title, body], index) => <details className="wg-glass" key={title}><summary><span>0{index + 1}</span><b>{title}</b><i>+</i></summary><p>{body}</p></details>)}</div>
        </section>

        <section id="recrutamento" className="wg-section wg-section-deep">
          <div className="wg-shell">
            <SectionHead n="04" kicker="RECRUTAMENTO" title="SE A MIRA É BOA, PROVE. SE O EGO É GRANDE, NEM TENTE." />
            <div className="wg-recruit-layout"><aside className="wg-requirements"><span className="wg-eyebrow">REQUISITOS MÍNIMOS</span><h3>ANTES DE ENVIAR</h3><ul><li>Comunicação ativa no Discord</li><li>Disponibilidade para treinos</li><li>Jogo limpo, sem atalhos</li><li>Maturidade para receber feedback</li><li>Compromisso com a equipe</li></ul><p>O formulário está em modo demonstração até um backend ser conectado.</p></aside><Recruitment /></div>
          </div>
        </section>

        <section id="comunidade" className="wg-section wg-shell">
          <SectionHead n="05" kicker="COMUNIDADE" title="A SALA FICA ABERTA. A TAG, NÃO." />
          <div className="wg-community"><article className="wg-discord wg-glass"><TacticalIcon kind="signal" /><div><span className="wg-eyebrow">DISCORD</span><h3>CENTRAL DE OPERAÇÕES</h3><p>Treinos, avisos, resenha e recrutamento. O link real entra aqui quando for configurado.</p></div>{clanConfig.discordInvite ? <a href={clanConfig.discordInvite} className="wg-btn wg-btn-primary" target="_blank" rel="noreferrer">Entrar no Discord</a> : <span className="wg-offline-link">LINK PENDENTE</span>}</article><div className="wg-social-grid">{[['YouTube', clanConfig.youtube], ['Instagram', clanConfig.instagram], ['Twitch', clanConfig.twitch]].map(([name, href]) => href ? <a key={name} className="wg-glass" href={href} target="_blank" rel="noreferrer">{name}<span>↗</span></a> : <div key={name} className="wg-glass is-disabled">{name}<small>pendente</small></div>)}</div></div>
        </section>
      </main>

      <footer className="wg-footer"><div className="wg-shell"><div className="wg-footer-brand"><Grin /><span><b>WICKED GRIN</b><small>TACTICAL UNIT</small></span></div><p>Wicked Grin é um clã independente de fãs. Combat Arms é marca de seus respectivos proprietários. Este site não é afiliado nem endossado por eles.</p><span className="wg-hud-label">© {new Date().getFullYear()} WG // BR</span></div></footer>

      {selected && <div className="wg-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><aside className="wg-member-modal wg-glass" role="dialog" aria-modal="true" aria-labelledby="member-title"><button type="button" className="wg-modal-close" aria-label="Fechar ficha" onClick={() => setSelected(null)}>×</button><div className="wg-modal-header"><div className="wg-avatar-frame large"><Grin /><span>{selected.nick.slice(0, 2)}</span></div><div><span className="wg-eyebrow">{selected.id} // {selected.role}</span><h2 id="member-title">{selected.nick}</h2><p>{selected.function} · {selected.weapon}</p></div></div><dl><div><dt>PATENTE</dt><dd><RankInsignia rank={selected.rank} />{selected.rank}</dd></div><div><dt>STATUS</dt><dd>{selected.online ? 'ONLINE' : 'OFFLINE'}</dd></div><div><dt>ENTRADA</dt><dd>{new Intl.DateTimeFormat('pt-BR').format(new Date(`${selected.joined}T12:00:00`))}</dd></div>{selected.discord && <div><dt>DISCORD</dt><dd>{selected.discord}</dd></div>}</dl><blockquote>{selected.note}</blockquote><div className="wg-dogtag">{selected.id}<small>WICKED GRIN / ACTIVE UNIT</small></div></aside></div>}
    </div>
  );
}

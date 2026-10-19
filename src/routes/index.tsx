import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Grin, TacticalIcon } from '@/components/clan/marks';
import { Recruitment } from '@/components/clan/recruitment';
import { members, sortRanking, monthly, matches, conduct, clanConfig, type SortKey } from '@/data/clan';
import { wickedBanner } from '@/assets/wicked-banner';
import '../banner-v2.css';

export const Route = createFileRoute('/')({
  component: WickedGrinPage,
  head: () => ({
    meta: [
      { title: 'WICKED GRIN — Clã de Combat Arms' },
      { name: 'description', content: 'WICKED GRIN: operações, esquadrão, ranking, código de conduta e recrutamento do clã.' },
      { property: 'og:title', content: 'WICKED GRIN — Sorrimos antes do primeiro tiro.' },
      { property: 'og:description', content: 'Precisão, disciplina e caos controlado. Conheça o WICKED GRIN.' },
      { property: 'og:image', content: '/og-wicked-grin.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});

const nav = [
  ['sobre', 'O CLÃ'],
  ['equipe', 'EQUIPE'],
  ['ranking', 'RANKING'],
  ['operacoes', 'OPERAÇÕES'],
  ['galeria', 'GALERIA'],
  ['conduta', 'REGRAS'],
] as const;

function SectionHead({ n, kicker, title, accent }: { n: string; kicker: string; title: string; accent?: string }) {
  return (
    <header className="wg-section-head">
      <span className="wg-index">// {n}</span>
      <div>
        <span className="wg-kicker">{kicker}</span>
        <h2>{title} {accent && <em>{accent}</em>}</h2>
      </div>
      <span className="wg-coordinate">WG-{n} / BR</span>
    </header>
  );
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const left = Math.max(0, new Date(date).getTime() - now);
  const seconds = Math.floor(left / 1000);
  if (!left) return <span>OPERAÇÃO INICIADA</span>;
  return <span>{String(Math.floor(seconds / 86400)).padStart(2, '0')}D : {String(Math.floor(seconds / 3600) % 24).padStart(2, '0')}H : {String(Math.floor(seconds / 60) % 60).padStart(2, '0')}M : {String(seconds % 60).padStart(2, '0')}S</span>;
}

function WickedGrinPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [role, setRole] = useState('Todos');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: 'kd', asc: false });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const roster = useMemo(
    () => members.filter((m) => (role === 'Todos' || m.role === role) && (!onlineOnly || m.online)),
    [role, onlineOnly],
  );

  const ranking = useMemo(() => sortRanking(sort.key, sort.asc), [sort]);
  const toggleSort = (key: SortKey) => setSort((old) => ({ key, asc: old.key === key ? !old.asc : key === 'nick' }));

  return (
    <div className="wg-site">
      <a href="#sobre" className="wg-skip">Ir para o conteúdo</a>

      <section id="inicio" className="wg-hero" aria-label="Banner oficial WICKED GRIN">
        <img
          src={wickedBanner}
          className="wg-hero-art"
          alt="Banner oficial Wicked Grin criado pelo clã, com operador mascarado em estética cyberpunk"
          width={1280}
          height={720}
          fetchPriority="high"
        />
        <div className="wg-hero-vignette" aria-hidden="true" />
        <div className="wg-hero-noise" aria-hidden="true" />

        <header className={`wg-nav wg-glass ${scrolled ? 'is-scrolled' : ''}`}>
          <a href="#inicio" className="wg-brand" aria-label="Wicked Grin — início">
            <Grin />
            <span><b>WICKED</b> <strong>GRIN</strong><small>COMBAT ARMS CLAN</small></span>
          </a>
          <nav className={menu ? 'is-open' : ''} aria-label="Navegação principal">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
          </nav>
          <a href="#recrutamento" className="wg-join">JUNTE-SE <TacticalIcon kind="arrow" /></a>
          <button className="wg-menu" type="button" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-label={menu ? 'Fechar menu' : 'Abrir menu'}>
            {menu ? <TacticalIcon kind="cross" /> : <span>☰</span>}
          </button>
        </header>

        <aside className="wg-rail" aria-label="Atalhos">
          <span className="wg-rail-grid">••<br/>••</span>
          <i />
          <a href="#comunidade" aria-label="Comunidade"><TacticalIcon kind="signal" /></a>
          <a href="#recrutamento" aria-label="Recrutamento"><TacticalIcon kind="target" /></a>
          <span className="wg-rail-word">FOLLOW US</span>
          <i />
          <span className="wg-rail-scroll">SCROLL<br/>DOWN</span>
        </aside>

        <div className="wg-live-card wg-glass">
          <span><i /> RECRUTAMENTO ABERTO</span>
          <small>WG // ACTIVE UNIT</small>
        </div>

        <div className="wg-mobile-copy wg-glass">
          <span>WICKED GRIN // COMBAT ARMS</span>
          <h1>SORRIMOS ANTES DO PRIMEIRO TIRO.</h1>
          <p>Precisão na mira. Lealdade no sangue. Caos controlado.</p>
          <div>
            <a href="#recrutamento" className="wg-primary">ENTRAR NO CLÃ <TacticalIcon kind="arrow" /></a>
            <a href="#sobre" className="wg-ghost">EXPLORAR</a>
          </div>
        </div>

        <div className="wg-bottom-hud wg-glass">
          <div className="wg-orb"><span>WG</span></div>
          <div className="wg-hud-stat"><small>OPERADORES</small><b>+12</b><span>ESQUADRÃO ATIVO</span></div>
          <div className="wg-hud-stat"><small>K/D MÉDIO</small><b>2.15</b><span>DADOS DEMO</span></div>
          <div className="wg-hud-stat"><small>OPERAÇÕES</small><b>+240</b><span>HISTÓRICO DEMO</span></div>
          <div className="wg-hud-stat"><small>STATUS</small><b>ON</b><span>RECRUTAMENTO</span></div>
          <a href="#sobre" className="wg-hud-arrow" aria-label="Avançar para quem somos"><TacticalIcon kind="arrow" /></a>
        </div>
      </section>

      <main>
        <section id="sobre" className="wg-section wg-shell">
          <SectionHead n="01" kicker="QUEM SOMOS" title="SOMOS O SORRISO" accent="NO ESCURO." />
          <div className="wg-about-grid">
            <article className="wg-manifesto">
              <h3>Não pedimos permissão para entrar na sala.</h3>
              <p>O WICKED GRIN joga com cabeça fria, call limpa e pressão constante. Ninguém carrega o nome do clã sozinho: cada avanço depende do flanco, cada clutch começa na confiança e cada derrota vira treino.</p>
              <p>Nosso humor é ácido. Nossa disciplina, séria. E nossa melhor propaganda continua sendo o placar.</p>
              <strong>“Aqui, o sorriso é a última coisa que você vê.”</strong>
            </article>
            <div className="wg-about-mark wg-glass"><Grin /><span>FEAR THE GRIN</span></div>
            <div className="wg-number-card wg-glass"><b>12+</b><span>OPERADORES</span><small>efetivo demonstrativo</small></div>
            <div className="wg-number-card wg-glass"><b>87%</b><span>WIN RATE</span><small>estatística demonstrativa</small></div>
          </div>
        </section>

        <section id="equipe" className="wg-section wg-band">
          <div className="wg-shell">
            <SectionHead n="02" kicker="A EQUIPE" title="QUEM SEGURA" accent="A LINHA." />
            <div className="wg-filters" role="group" aria-label="Filtrar equipe">
              {['Todos', 'Líder', 'Sub-líder', 'Oficial', 'Membro', 'Recruta'].map((r) => (
                <button key={r} type="button" className={role === r ? 'active' : ''} onClick={() => setRole(r)}>{r}</button>
              ))}
              <label><input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} /> só online <i /></label>
            </div>
            <div className="wg-roster">
              {roster.map((m, i) => (
                <article className={`wg-member wg-glass ${i === 0 ? 'leader' : ''}`} key={m.nick}>
                  <div className="wg-member-top"><span>WG-{String(members.indexOf(m) + 1).padStart(3, '0')}</span><small className={m.online ? 'online' : ''}>{m.online ? '● ONLINE' : '○ OFFLINE'}</small></div>
                  <div className="wg-member-face"><Grin /><span>{m.nick.slice(0, 2)}</span></div>
                  <span className="wg-rank">{m.role}</span>
                  <h3>{m.nick}</h3>
                  <p>{m.function} · {m.rank}</p>
                  <footer><span>{m.weapon}</span><b>K/D {m.kd.toFixed(2)}</b></footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ranking" className="wg-section wg-shell">
          <SectionHead n="03" kicker="RANKING & DESEMPENHO" title="NÚMEROS NÃO" accent="MENTEM." />
          <div className="wg-ranking-grid">
            <div className="wg-table-wrap wg-glass">
              <table>
                <caption>Ranking demonstrativo dos operadores</caption>
                <thead><tr><th>#</th>{([{ key: 'nick', label: 'OPERADOR' }, { key: 'kd', label: 'K/D' }, { key: 'kills', label: 'ABATES' }, { key: 'wins', label: 'VITÓRIAS' }] as const).map((col) => <th key={col.key}><button type="button" onClick={() => toggleSort(col.key)}>{col.label} {sort.key === col.key ? (sort.asc ? '↑' : '↓') : '↕'}</button></th>)}</tr></thead>
                <tbody>{ranking.map((m, i) => <tr key={m.nick}><td>{String(i + 1).padStart(2, '0')}</td><td><strong>{m.nick}</strong><small>{m.role}</small></td><td>{m.kd.toFixed(2)}</td><td>{m.kills.toLocaleString('pt-BR')}</td><td>{m.wins}</td></tr>)}</tbody>
              </table>
            </div>
            <aside className="wg-performance wg-glass">
              <span>JOGADOR DO MÊS</span><Grin /><h3>REAPER</h3><p>O primeiro a entrar. O último a cair.</p>
              <div className="wg-bars">{monthly.map((m) => <div key={m.month} title={`${m.wins} vitórias`}><i style={{ height: `${Math.max(28, m.wins)}px` }} /><span>{m.month}</span></div>)}</div>
            </aside>
          </div>
        </section>

        <section id="operacoes" className="wg-section wg-band">
          <div className="wg-shell">
            <SectionHead n="04" kicker="OPERAÇÕES" title="PRÓXIMO" accent="ALVO." />
            <div className="wg-ops">
              {matches.map((m, i) => (
                <article className={`wg-op wg-glass ${i === 0 ? 'featured' : ''}`} key={m.id}>
                  <div><span>{m.id}</span><b className={m.status === 'Derrota' ? 'loss' : ''}>{m.status}</b></div>
                  <h3>WICKED GRIN <em>VS</em> {m.opponent}</h3>
                  <p>{m.map} // {m.mode}</p>
                  <footer><time dateTime={m.date}>{new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(m.date))}</time>{m.score ? <strong>{m.score}</strong> : <Countdown date={m.date} />}</footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="galeria" className="wg-section wg-shell">
          <SectionHead n="05" kicker="GALERIA / HIGHLIGHTS" title="ECOS DO" accent="CAMPO." />
          <div className="wg-gallery">
            {[0, 1, 2, 3].map((i) => (
              <figure key={i} className={`wg-shot shot-${i}`}>
                <img src={wickedBanner} alt={i === 0 ? 'Recorte da arte oficial do banner Wicked Grin' : ''} loading="lazy" />
                <figcaption><span>ARQUIVO // 0{i + 1}</span><b>{['ZONA DE IMPACTO', 'OPERADOR WG', 'PROTOCOLO VERMELHO', 'NOITE DE CAÇA'][i]}</b></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="conduta" className="wg-section wg-band">
          <div className="wg-shell wg-rules-grid">
            <div><SectionHead n="06" kicker="CÓDIGO DE CONDUTA" title="SEM HONRA," accent="SEM CLÃ." /><p className="wg-rule-lead">Disciplina não limita a força. Ela dá direção.</p><TacticalIcon kind="shield" /></div>
            <div className="wg-rules">{conduct.map(([title, body], i) => <details key={title}><summary><span>0{i + 1}</span><b>{title}</b><i>+</i></summary><p>{body}</p></details>)}</div>
          </div>
        </section>

        <section id="recrutamento" className="wg-section wg-shell wg-recruit-grid">
          <div><SectionHead n="07" kicker="RECRUTAMENTO" title="ENTRE NA" accent="LINHA." /><h3>Boa mira abre portas. Lealdade mantém você dentro.</h3><p>O formulário abaixo está em demonstração e não envia dados até um backend ser conectado.</p><ul><li>Jogo limpo, sem cheats ou macros abusivos.</li><li>Comunicação clara no Discord.</li><li>Presença em treinos e disposição para evoluir.</li></ul></div>
          <Recruitment />
        </section>

        <section id="comunidade" className="wg-section wg-band">
          <div className="wg-shell">
            <SectionHead n="08" kicker="COMUNIDADE" title="FORA DO MAPA." accent="DENTRO DO CLÃ." />
            <div className="wg-community">
              <article className="wg-discord wg-glass"><TacticalIcon kind="signal" /><div><span>QUARTEL-GENERAL</span><h3>Discord do esquadrão</h3><p>Calls, treinos, partidas e resenha depois do clutch.</p>{clanConfig.discordInvite ? <a className="wg-primary" href={clanConfig.discordInvite} target="_blank" rel="noreferrer">ENTRAR NO DISCORD</a> : <button disabled>DISCORD A CONFIGURAR</button>}</div></article>
              <article className="wg-socials wg-glass"><span>REDES DO CLÃ</span>{[['INSTAGRAM', clanConfig.instagram], ['YOUTUBE', clanConfig.youtube]].map(([name, href]) => href ? <a key={name} href={href} target="_blank" rel="noreferrer">{name} ↗</a> : <div key={name}><b>{name}</b><small>NÃO CONFIGURADO</small></div>)}</article>
            </div>
          </div>
        </section>
      </main>

      <footer className="wg-footer wg-shell">
        <a href="#inicio" className="wg-brand"><Grin /><span><b>WICKED</b> <strong>GRIN</strong><small>FEAR THE GRIN</small></span></a>
        <p>Wicked Grin é um clã independente de fãs. Combat Arms é marca de seus respectivos proprietários. Este site não é afiliado nem endossado por eles.</p>
        <a href="#inicio" aria-label="Voltar ao topo">↑</a>
      </footer>
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Grin, TacticalIcon } from '@/components/clan/marks';
import { Recruitment } from '@/components/clan/recruitment';
import {
  clanConfig,
  conduct,
  matches,
  members,
  monthly,
  sortRanking,
  type SortKey,
} from '@/data/clan';
import operator from '@/assets/wicked-operator.jpg';

export const Route = createFileRoute('/')({
  component: Index,
  head: () => ({
    meta: [
      { title: 'WICKED GRIN — Clã Combat Arms | Sorrimos antes do primeiro tiro.' },
      {
        name: 'description',
        content:
          'Conheça o WICKED GRIN: esquadrão, ranking, operações, código de conduta e recrutamento do clã de Combat Arms.',
      },
      { property: 'og:title', content: 'WICKED GRIN — Sorrimos antes do primeiro tiro.' },
      {
        property: 'og:description',
        content: 'Precisão na mira. Lealdade no sangue. Um esquadrão, nenhuma hesitação.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/og-wicked-grin.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'WICKED GRIN — Combat Arms Clan' },
      {
        name: 'twitter:description',
        content: 'Sorrimos antes do primeiro tiro. Conheça o WICKED GRIN.',
      },
      { name: 'twitter:image', content: '/og-wicked-grin.svg' },
    ],
    links: [{ rel: 'canonical', href: '/' }],
  }),
});

const navItems = [
  { id: 'sobre', label: 'O CLÃ' },
  { id: 'equipe', label: 'EQUIPE' },
  { id: 'ranking', label: 'RANKING' },
  { id: 'operacoes', label: 'OPERAÇÕES' },
  { id: 'galeria', label: 'GALERIA' },
  { id: 'conduta', label: 'REGRAS' },
  { id: 'comunidade', label: 'COMUNIDADE' },
];

const gallery = [
  { title: 'Zona de impacto', subtitle: 'ARTE CONCEITUAL / 001', scene: 'industrial' },
  { title: 'Silêncio no perímetro', subtitle: 'ARTE CONCEITUAL / 002', scene: 'night' },
  { title: 'Protocolo vermelho', subtitle: 'ARTE CONCEITUAL / 003', scene: 'red' },
  { title: 'Depois do último tiro', subtitle: 'ARTE CONCEITUAL / 004', scene: 'bunker' },
];

function SectionTitle({
  number,
  label,
  title,
  accent,
}: {
  number: string;
  label: string;
  title: string;
  accent?: string;
}) {
  return (
    <div className="section-heading">
      <span className="section-number">{number}</span>
      <div>
        <span className="eyebrow text-primary">{label}</span>
        <h2>
          {title} {accent && <span className="outline-text">{accent}</span>}
        </h2>
      </div>
      <span className="section-coordinate hud">WG // {number}.00</span>
    </div>
  );
}

function Scene({ scene }: { scene: string }) {
  return (
    <div className={`scene scene-${scene}`}>
      <svg viewBox="0 0 800 450" aria-hidden="true">
        <defs>
          <pattern id={`windows-${scene}`} width="40" height="45" patternUnits="userSpaceOnUse">
            <path d="M5 8h14v22H5Z" fill="currentColor" opacity=".13" />
          </pattern>
        </defs>
        <path
          d="M0 450V145h130V65h130v190h75V180h135V30h150v170h85V90h95v360Z"
          fill="currentColor"
          opacity=".2"
        />
        <path
          d="M0 450V145h130V65h130v190h75V180h135V30h150v170h85V90h95v360Z"
          fill={`url(#windows-${scene})`}
        />
        <path
          d="M0 410h800M120 450l230-170m330 170L450 280M360 450V280m85 170V280"
          stroke="currentColor"
          opacity=".3"
        />
        <path
          d="M387 220v-18q13-20 26 0v18l15 38-8 28 7 56h-14l-13-45-11 45h-14l8-58-8-29Z"
          fill="currentColor"
          opacity=".8"
        />
        <path d="m414 239 52 24-3 8-54-16" stroke="currentColor" strokeWidth="5" />
        <path
          d="M30 35h35m-35 0v35m705-35h35v35M30 380v35h35m670 0h35v-35"
          stroke="currentColor"
          opacity=".6"
        />
      </svg>
      <span className="scene-reticle">+</span>
      <span className="scene-label hud">WICKED GRIN / VISUAL ARCHIVE</span>
    </div>
  );
}

function Countdown({ date }: { date: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (now === null) return <span className="countdown">SINCRONIZANDO</span>;

  const remaining = Math.max(0, new Date(date).getTime() - now);
  if (remaining === 0) return <span className="countdown">OPERAÇÃO INICIADA</span>;

  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  const secs = seconds % 60;

  return (
    <span className="countdown">
      {String(days).padStart(2, '0')}D : {String(hours).padStart(2, '0')}H :{' '}
      {String(minutes).padStart(2, '0')}M : {String(secs).padStart(2, '0')}S
    </span>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [role, setRole] = useState('Todos');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: 'kd', asc: false });
  const [selectedGallery, setSelectedGallery] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['inicio', ...navItems.map((item) => item.id), 'recrutamento'];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const filteredMembers = useMemo(
    () => members.filter((member) => (role === 'Todos' || member.role === role) && (!onlineOnly || member.online)),
    [onlineOnly, role],
  );

  function changeSort(key: SortKey) {
    setSort((current) => ({
      key,
      asc: current.key === key ? !current.asc : key === 'nick',
    }));
  }

  return (
    <>
      <a className="skip-link" href="#sobre">Pular para o conteúdo</a>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <a href="#inicio" className="brand" aria-label="WICKED GRIN, início">
          <Grin />
          <span>
            WICKED<span className="text-primary">GRIN</span>
            <small>COMBAT ARMS CLAN</small>
          </span>
        </a>

        <nav aria-label="Navegação principal" className={menuOpen ? 'nav-open' : ''}>
          {navItems.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              data-active={activeSection === item.id ? 'true' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="mobile-recruit"
            href="#recrutamento"
            data-active={activeSection === 'recrutamento' ? 'true' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            RECRUTAMENTO
          </a>
        </nav>

        <Button asChild variant="danger" size="tactical" className="header-cta">
          <a href="#recrutamento">
            JUNTE-SE AO CLÃ <TacticalIcon kind="arrow" />
          </a>
        </Button>

        <Button
          className="menu-toggle"
          variant="ghost"
          size="icon"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <TacticalIcon kind="cross" /> : <span className="hamburger">☰</span>}
        </Button>
      </header>

      <main>
        <section id="inicio" className="hero">
          <img
            src={operator}
            className="hero-art"
            alt="Operador tático original do WICKED GRIN em ambiente noturno"
            width={1920}
            height={1024}
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-grid" />

          <div className="hero-hud hud">
            <span>BR // COMBAT ARMS</span>
            <span>PROTOCOLO WG // SEM RECUO</span>
          </div>

          <div className="hero-content">
            <div className="recruit-status">
              <span className="status-dot" /> RECRUTAMENTO ABERTO <span className="status-line" />
            </div>
            <h1>
              <span>WICKED</span>
              <span className="grin-word">GRIN<span className="title-cross">+</span></span>
            </h1>
            <p className="hero-tagline">Sorrimos antes do primeiro tiro.</p>
            <p className="hero-description">
              Não é só um clã. É uma sentença.<br />
              Precisão na mira. Lealdade no sangue. Caos no campo.
            </p>

            <div className="hero-actions">
              <Button asChild variant="danger" size="tactical">
                <a href="#recrutamento">
                  <TacticalIcon kind="target" /> QUERO FAZER PARTE <TacticalIcon kind="arrow" />
                </a>
              </Button>
              <Button asChild variant="outline" size="tactical" className="tactical-button">
                <a href="#sobre">CONHEÇA O CLÃ <span>↗</span></a>
              </Button>
            </div>

            <div className="hero-micro hud">
              <TacticalIcon kind="shield" />
              <span>JOGO LIMPO. MENTE IMPLACÁVEL.</span>
            </div>
          </div>

          <div className="operator-hud hud">
            <span className="text-primary">◈ OPERADOR WG-001</span>
            <span>CLASS: ASSAULT</span>
            <span>STATUS: EM COMBATE</span>
            <div className="hud-bars">▰▰▰▰▰▱▱</div>
          </div>

          <div className="hero-serial hud">
            SIGNAL LOCK // WG
            <br />
            NO FEAR. JUST GRIN.
          </div>

          <div className="hero-bottom">
            <div className="hero-stat glass">
              <TacticalIcon kind="shield" />
              <div><strong>12<span>+</span></strong><span>OPERADORES</span></div>
              <small>UM SÓ ESQUADRÃO</small>
            </div>
            <div className="hero-stat glass">
              <TacticalIcon kind="target" />
              <div><strong>87<span>%</span></strong><span>WIN RATE</span></div>
              <small>DADO DEMONSTRATIVO</small>
            </div>
            <div className="hero-stat glass">
              <TacticalIcon kind="signal" />
              <div><strong>2.15</strong><span>K/D DO CLÃ</span></div>
              <small>DADO DEMONSTRATIVO</small>
            </div>
            <a href="#sobre" className="scroll-cue hud">
              <span>ROLE PARA<br />ENTRAR NA ZONA</span>
              <span>↓</span>
            </a>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <span>PRECISÃO</span><Grin /><span>LEALDADE</span><Grin /><span>SEM RECUO</span><Grin />
          <span>WICKED GRIN</span><Grin /><span>PRECISÃO</span><Grin /><span>LEALDADE</span>
        </div>

        <section id="sobre" className="section container">
          <SectionTitle number="01" label="QUEM SOMOS" title="NÃO PEDIMOS" accent="PERMISSÃO." />
          <div className="about-layout">
            <div className="manifesto">
              <p className="manifesto-lead">Não pedimos permissão<br />para entrar na sala.</p>
              <p>
                O WICKED GRIN nasceu onde a pressão separa jogadores de operadores. Somos um esquadrão
                competitivo de Combat Arms que troca desculpas por treino, ego por comunicação e barulho por resultado.
              </p>
              <p>
                Aqui, cada call importa. Cada round ensina. E quando o mapa fica silencioso, você já sabe quem está chegando.
              </p>
              <span className="signature hud">// AQUI, O SORRISO É A ÚLTIMA COISA QUE VOCÊ VÊ.</span>
            </div>

            <div className="about-emblem">
              <Grin />
              <span className="hud">LEALDADE ACIMA DO PLACAR</span>
              <div className="emblem-cross">+</div>
            </div>
          </div>

          <div className="about-numbers">
            <div><strong>12<span>+</span></strong><span>OPERADORES</span></div>
            <div><strong>240<span>+</span></strong><span>OPERAÇÕES DEMO</span></div>
            <div><strong>01</strong><span>MENTALIDADE</span></div>
            <p className="hud">DADOS ILUSTRATIVOS<br />SUBSTITUA PELOS NÚMEROS REAIS DO CLÃ.</p>
          </div>
        </section>

        <section id="equipe" className="section section-band">
          <div className="container">
            <SectionTitle number="02" label="A EQUIPE" title="OS ROSTOS" accent="DO CAOS." />
            <div className="section-intro">
              <p>Do primeiro avanço à última cobertura. Conheça quem segura a linha.</p>
              <span className="hud">EFETIVO FICTÍCIO // {members.length} OPERADORES</span>
            </div>

            <div className="team-filters" aria-label="Filtrar equipe">
              {['Todos', 'Líder', 'Sub-líder', 'Oficial', 'Membro', 'Recruta'].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  aria-pressed={role === item}
                  className={role === item ? 'filter-active' : ''}
                  onClick={() => setRole(item)}
                >
                  {item}
                </Button>
              ))}
              <label className="online-filter">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(event) => setOnlineOnly(event.target.checked)}
                />
                Só online <span className="status-dot" />
              </label>
            </div>

            <div className="team-grid">
              {filteredMembers.map((member, index) => (
                <article key={member.nick} className={`member-card ${member.role === 'Líder' ? 'leader' : ''}`}>
                  <div className="member-top">
                    <span className="hud">WG-{String(members.indexOf(member) + 1).padStart(3, '0')}</span>
                    <span className={member.online ? 'member-online' : 'member-offline'}>
                      <span className="status-dot" /> {member.online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                  <div className={`member-portrait portrait-${index % 4}`}>
                    <Grin />
                    <span className="portrait-cross">+</span>
                  </div>
                  <div className="member-info">
                    <span className="eyebrow text-primary">{member.role}</span>
                    <h3>{member.nick}</h3>
                    <p>{member.function} <span>/ {member.rank}</span></p>
                    <div className="member-bottom">
                      <span className="hud">{member.weapon}</span>
                      <span className="text-primary hud">K/D {member.kd.toFixed(2)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <p className="empty-state">Nenhum operador encontrado neste filtro.</p>
            )}
          </div>
        </section>

        <section id="ranking" className="section container">
          <SectionTitle number="03" label="RANKING & DESEMPENHO" title="NÚMEROS NÃO" accent="MENTEM." />
          <div className="section-intro">
            <p>O desempenho fala. O resto é ruído.</p>
            <span className="hud">TEMPORADA OUT/2026 · DADOS DEMONSTRATIVOS</span>
          </div>

          <div className="ranking-layout">
            <div className="ranking-table-wrap">
              <table className="ranking-table">
                <caption className="sr-only">Ranking demonstrativo dos operadores WICKED GRIN</caption>
                <thead>
                  <tr>
                    <th>#</th>
                    {([
                      { key: 'nick', label: 'OPERADOR' },
                      { key: 'kd', label: 'K/D' },
                      { key: 'kills', label: 'ABATES' },
                      { key: 'wins', label: 'VITÓRIAS' },
                    ] as const).map((item) => (
                      <th
                        key={item.key}
                        aria-sort={sort.key === item.key ? (sort.asc ? 'ascending' : 'descending') : 'none'}
                      >
                        <Button variant="ghost" onClick={() => changeSort(item.key)}>
                          {item.label} <span>{sort.key === item.key ? (sort.asc ? '↑' : '↓') : '↕'}</span>
                        </Button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortRanking(sort.key, sort.asc).map((member, index) => (
                    <tr key={member.nick}>
                      <td className={index < 3 ? 'text-primary' : ''}>{String(index + 1).padStart(2, '0')}</td>
                      <td><span className="rank-nick">{member.nick}</span><small>{member.role}</small></td>
                      <td className="text-primary">{member.kd.toFixed(2)}</td>
                      <td>{member.kills.toLocaleString('pt-BR')}</td>
                      <td>{member.wins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="ranking-aside">
              <div className="player-month glass">
                <span className="eyebrow text-primary">★ JOGADOR DO MÊS</span>
                <div className="month-mark"><Grin /></div>
                <h3>REAPER</h3>
                <p>O primeiro a entrar.<br />O último a cair.</p>
                <div>
                  <strong>2.84 <small>K/D</small></strong>
                  <strong>186 <small>VITÓRIAS</small></strong>
                </div>
              </div>

              <div className="monthly-chart">
                <div className="chart-heading">
                  <span className="eyebrow">EVOLUÇÃO DO CLÃ</span>
                  <span className="hud text-primary">+96% ↗</span>
                </div>
                <p>Vitórias por mês</p>
                <svg
                  viewBox="0 0 320 150"
                  role="img"
                  aria-label="Vitórias mensais: maio 54, junho 68, julho 61, agosto 82, setembro 91, outubro 106"
                >
                  <path className="chart-grid" d="M10 20h300M10 65h300M10 110h300" />
                  <path className="chart-area" d="M10 105 70 83 130 94 190 62 250 48 310 24V130H10Z" />
                  <path className="chart-line" d="M10 105 70 83 130 94 190 62 250 48 310 24" />
                  {[[10, 105], [70, 83], [130, 94], [190, 62], [250, 48], [310, 24]].map(([x, y]) => (
                    <circle key={x} cx={x} cy={y} r="3" className="chart-dot" />
                  ))}
                </svg>
                <div className="chart-labels hud">
                  {monthly.map((item) => <span key={item.month} title={`${item.wins} vitórias`}>{item.month}</span>)}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="operacoes" className="section section-band">
          <div className="container">
            <SectionTitle number="04" label="OPERAÇÕES" title="PRÓXIMO" accent="ALVO." />
            <div className="section-intro">
              <p>O mapa muda. A missão continua.</p>
              <span className="hud">AGENDA DEMONSTRATIVA · HORÁRIO DE BRASÍLIA</span>
            </div>

            <div className="operations">
              {matches.map((match, index) => (
                <article key={match.id} className={`operation ${index === 0 ? 'next-operation glass' : ''}`}>
                  <div className="operation-meta">
                    <span className="hud">{match.id}</span>
                    <span className={match.status === 'Derrota' ? 'text-destructive' : 'text-primary'}>
                      {match.status === 'Agendada' ? `● ${match.status}` : match.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="operation-versus">
                    <Grin />
                    <strong>WICKED GRIN</strong>
                    <span className="hud">VS</span>
                    <strong>{match.opponent}</strong>
                  </div>
                  <div className="operation-details">
                    <span>{match.map} <small>// {match.mode}</small></span>
                    <time dateTime={match.date}>
                      {new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'America/Sao_Paulo',
                      }).format(new Date(match.date))}
                    </time>
                  </div>
                  <div className="operation-result">
                    {match.score ? (
                      <strong className={match.status === 'Derrota' ? 'text-destructive' : 'text-primary'}>
                        {match.score}
                      </strong>
                    ) : (
                      <Countdown date={match.date} />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="galeria" className="section container">
          <SectionTitle number="05" label="GALERIA / HIGHLIGHTS" title="ECOS DO" accent="CAMPO." />
          <div className="section-intro">
            <p>Alguns momentos não cabem no placar.</p>
            <span className="hud">ARQUIVO VISUAL · ARTES ORIGINAIS PROVISÓRIAS</span>
          </div>

          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <Button
                key={item.title}
                variant="ghost"
                className={`gallery-item gallery-${index}`}
                onClick={() => setSelectedGallery(index)}
                aria-label={`Ampliar ${item.title}`}
              >
                <Scene scene={item.scene} />
                <div className="gallery-caption">
                  <div>
                    <small className="hud">{item.subtitle}</small>
                    <h3>{item.title}</h3>
                  </div>
                  <span>↗</span>
                </div>
              </Button>
            ))}
          </div>

          <Dialog open={selectedGallery !== null} onOpenChange={(open) => !open && setSelectedGallery(null)}>
            <DialogContent className="lightbox">
              {selectedGallery !== null && gallery[selectedGallery] && (
                <>
                  <DialogTitle>{gallery[selectedGallery].title}</DialogTitle>
                  <DialogDescription>
                    {gallery[selectedGallery].subtitle} · Ilustração original provisória, não é uma captura oficial de Combat Arms.
                  </DialogDescription>
                  <Scene scene={`${gallery[selectedGallery].scene}-lightbox`} />
                  <div className="lightbox-controls">
                    <Button
                      variant="outline"
                      aria-label="Imagem anterior"
                      onClick={() => setSelectedGallery((selectedGallery + gallery.length - 1) % gallery.length)}
                    >
                      ←
                    </Button>
                    <span className="hud">0{selectedGallery + 1} / 04</span>
                    <Button
                      variant="outline"
                      aria-label="Próxima imagem"
                      onClick={() => setSelectedGallery((selectedGallery + 1) % gallery.length)}
                    >
                      →
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </section>

        <section id="conduta" className="section section-band">
          <div className="container conduct-layout">
            <div>
              <SectionTitle number="06" label="CÓDIGO DE CONDUTA" title="SEM HONRA," accent="SEM CLÃ." />
              <p>Disciplina não limita a força.<br />Ela dá direção.</p>
              <TacticalIcon kind="shield" className="conduct-shield" />
            </div>
            <div className="conduct-list">
              {conduct.map(([title, body], index) => (
                <details key={title}>
                  <summary>
                    <span className="hud text-primary">0{index + 1}</span>
                    <h3>{title}</h3>
                    <span className="details-plus">+</span>
                  </summary>
                  <p>{body}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="recrutamento" className="section container recruitment-layout">
          <div>
            <SectionTitle number="07" label="RECRUTAMENTO ABERTO" title="SEU LUGAR É" accent="NA LINHA." />
            <p className="recruit-lead">Boa mira abre portas.<br />Lealdade mantém você dentro.</p>
            <p>
              Procuramos quem joga pelo time, aprende com os erros e não desaparece quando a partida aperta.
            </p>
            <ul className="recruit-checks">
              <li><TacticalIcon kind="shield" /> Compromisso com o jogo limpo</li>
              <li><TacticalIcon kind="signal" /> Comunicação e presença nos treinos</li>
              <li><TacticalIcon kind="target" /> Vontade de evoluir em equipe</li>
            </ul>
            <a className="hud text-primary" href="#conduta">LEIA O CÓDIGO DE CONDUTA ↗</a>
            <div className="recruit-warning">
              <span className="eyebrow">TRANSPARÊNCIA OPERACIONAL</span>
              <p>
                O formulário está em demonstração. Nenhuma candidatura será enviada até a integração com um backend configurado.
              </p>
            </div>
          </div>
          <Recruitment />
        </section>

        <section id="comunidade" className="section section-band community">
          <div className="container">
            <SectionTitle number="08" label="COMUNIDADE" title="FORA DO MAPA." accent="DENTRO DO CLÃ." />
            <div className="community-layout">
              <div className="discord-panel glass">
                <svg className="discord-icon" viewBox="0 0 64 48" fill="currentColor" aria-hidden="true">
                  <path d="M13 5 23 2l2 5h14l2-5 10 3 8 29-12 8-4-6c-7 3-15 3-22 0l-4 6-12-8Z" />
                  <ellipse cx="23" cy="23" rx="4" ry="5" className="discord-eyes" />
                  <ellipse cx="41" cy="23" rx="4" ry="5" className="discord-eyes" />
                </svg>
                <div>
                  <span className="eyebrow text-primary">NOSSO PONTO DE ENCONTRO</span>
                  <h3>O quartel-general.</h3>
                  <p>Calls, treinos, partidas e aquela resenha depois do clutch.</p>
                  {clanConfig.discordServerId && clanConfig.discordInvite ? (
                    <Button asChild variant="tactical" size="tactical">
                      <a href={clanConfig.discordInvite} target="_blank" rel="noopener noreferrer">
                        ENTRAR NO DISCORD <TacticalIcon kind="arrow" />
                      </a>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" disabled>DISCORD NÃO CONFIGURADO</Button>
                      <small className="config-note">ID do servidor e link de convite pendentes.</small>
                    </>
                  )}
                </div>
              </div>

              <div className="social-links">
                <span className="eyebrow">ACOMPANHE O ESQUADRÃO</span>
                {[
                  { label: 'INSTAGRAM', href: clanConfig.instagram },
                  { label: 'YOUTUBE', href: clanConfig.youtube },
                ].map((social) =>
                  social.href ? (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                      {social.label}<span>↗</span>
                    </a>
                  ) : (
                    <div key={social.label}>
                      <span>{social.label}</span><small>EM BREVE / NÃO CONFIGURADO</small>
                    </div>
                  ),
                )}
                <p className="hud">SEM SPAM. SEM RUÍDO.<br />SÓ O QUE IMPORTA.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <a className="brand" href="#inicio">
          <Grin />
          <span>
            WICKED<span className="text-primary">GRIN</span>
            <small>SORRIMOS ANTES DO PRIMEIRO TIRO.</small>
          </span>
        </a>
        <div>
          <p>© 2026 WICKED GRIN. Feito para quem não recua.</p>
          <small>
            Wicked Grin é um clã independente de fãs. Combat Arms é marca de seus respectivos proprietários.
            Este site não é afiliado nem endossado por eles. Membros, estatísticas e partidas exibidos atualmente são fictícios.
          </small>
        </div>
        <a href="#inicio" className="back-top" aria-label="Voltar ao início">↑</a>
      </footer>
    </>
  );
}

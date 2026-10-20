import { Link } from '@tanstack/react-router';
import { Crosshair, Shield, Target, Trophy, Users, Play, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ClanRank, Member } from '@/data/wicked-v3';

export function SectionTitle({ code, eyebrow, title, text }: { code: string; eyebrow: string; title: string; text?: string }) {
  return <header className="wg3-section-title"><span className="wg3-code">// {code}</span><div><span className="wg3-kicker">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div></header>;
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass hud-frame ${className}`}><i className="hud-corner tl" /><i className="hud-corner tr" /><i className="hud-corner bl" /><i className="hud-corner br" />{children}</div>;
}

export function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const duration = 1100;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: .4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);
  return <div ref={ref} className="wg3-counter"><strong>{display}{suffix}</strong><span>{label}</span></div>;
}

export function PillarCard({ icon, title, text, index }: { icon: 'team' | 'comp' | 'legacy'; title: string; text: string; index: string }) {
  const Icon = icon === 'team' ? Users : icon === 'comp' ? Target : Trophy;
  return <GlassCard className="wg3-pillar"><span className="wg3-pillar-index">{index}</span><Icon /><h3>{title}</h3><p>{text}</p><span className="wg3-card-line" /></GlassCard>;
}

export function MemberCard({ member, onOpen }: { member: Member; onOpen?: () => void }) {
  return <button type="button" className="wg3-member-card glass hud-frame" onClick={onOpen}>
    <div className="wg3-member-avatar"><Crosshair /><span>{member.nick.slice(0, 2)}</span></div>
    <div className="wg3-member-status"><i className={member.status === 'online' ? 'online' : ''} />{member.status.toUpperCase()}</div>
    <span className="wg3-kicker">{member.id} // {member.role}</span>
    <h3>{member.nick}</h3>
    <p>{member.specialty} · K/D {member.kd ?? '—'}</p>
    <footer><span>{member.rank}</span><ArrowUpRight /></footer>
  </button>;
}

export function RankCard({ rank }: { rank: ClanRank }) {
  const [failed, setFailed] = useState(false);
  return <GlassCard className="wg3-rank-card">
    <span className="wg3-rank-level">NÍVEL {rank.nivel}</span>
    <div className="wg3-rank-art">
      {!failed ? <img src={rank.imagem} alt={`Insígnia da patente ${rank.nome}`} loading="lazy" onError={() => setFailed(true)} /> : <Shield aria-label="Imagem da patente pendente" />}
    </div>
    <h3>{rank.nome}</h3><p>{rank.descricao}</p><small>{String(rank.id).padStart(2, '0')} // ARQUIVO DE PATENTE</small>
  </GlassCard>;
}

export function Marquee() {
  const text = 'WICKED GRIN • COMBAT ARMS • UNIDOS PELA HABILIDADE • MOVIDOS PELA PAIXÃO • ';
  return <div className="wg3-marquee" aria-hidden="true"><div>{text.repeat(4)}</div></div>;
}

export function VideoCard({ onPlay }: { onPlay: () => void }) {
  return <button className="wg3-video-card glass" type="button" onClick={onPlay}><span className="wg3-kicker">TRANSMISSÃO // 01</span><div className="wg3-play"><Play /></div><strong>ASSISTIR AO VÍDEO</strong><small>TRAILER DO CLÃ · LINK A DEFINIR</small></button>;
}

export function CTA({ title, text }: { title: string; text: string }) {
  return <section className="wg3-recruit-cta"><div className="wg3-shell"><span className="wg3-kicker">ALISTAMENTO ABERTO</span><h2>{title}</h2><p>{text}</p><Link to="/contato" className="neon-btn">ALISTAR-SE AGORA</Link></div></section>;
}

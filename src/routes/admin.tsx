import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck, RefreshCw, Plus, Trash2, Save, Upload, UserRound } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { RankBadge } from '@/components/wg/UI';
import { combatRanks } from '@/data/combat-ranks';
import { adminCreate, adminDelete, adminList, adminLogin, adminUpdate, supabaseReady, uploadMemberPhoto } from '@/lib/supabase-rest';

export const Route = createFileRoute('/admin')({ component: AdminPage, head: () => ({ meta: [{ title: 'Admin — Wicked Grin' }, { name: 'robots', content: 'noindex,nofollow' }] }) });

const tables = [
  ['members', 'Membros'], ['clan_ranks', 'Patentes'], ['news', 'Notícias'], ['media', 'Mídia'], ['events', 'Eventos'], ['clan_stats', 'Números'], ['recruitment_requests', 'Alistamentos'],
] as const;

type MemberDraft = {
  member_code: string;
  nick: string;
  role: string;
  specialty: 'Rifleman' | 'Sniper' | 'Suporte' | 'Entry';
  rank_code: string;
  kd: string;
  status: 'online' | 'offline';
  avatar_url: string;
  featured: boolean;
  active: boolean;
};

const emptyMember: MemberDraft = { member_code: '', nick: '', role: 'Membro', specialty: 'Rifleman', rank_code: 'RANK-001', kd: '', status: 'offline', avatar_url: '', featured: false, active: true };

function memberFromRow(row: Record<string, unknown>): MemberDraft {
  return {
    member_code: String(row.member_code ?? ''),
    nick: String(row.nick ?? ''),
    role: String(row.role ?? 'Membro'),
    specialty: (['Rifleman', 'Sniper', 'Suporte', 'Entry'].includes(String(row.specialty)) ? String(row.specialty) : 'Rifleman') as MemberDraft['specialty'],
    rank_code: String(row.rank_code ?? 'RANK-001'),
    kd: row.kd === null || row.kd === undefined ? '' : String(row.kd),
    status: String(row.status) === 'online' ? 'online' : 'offline',
    avatar_url: String(row.avatar_url ?? ''),
    featured: Boolean(row.featured),
    active: row.active === undefined ? true : Boolean(row.active),
  };
}

function AdminPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); const [user, setUser] = useState('');
  const [table, setTable] = useState<(typeof tables)[number][0]>('members');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]); const [message, setMessage] = useState('');
  const [draft, setDraft] = useState('{}'); const [editingId, setEditingId] = useState<string | number | null>(null);
  const [memberDraft, setMemberDraft] = useState<MemberDraft>(emptyMember);
  const [uploading, setUploading] = useState(false);

  async function load(nextTable = table, auth = token) {
    if (!auth) return; setMessage('CARREGANDO ARQUIVOS…');
    try { setRows(await adminList(nextTable, auth)); setMessage('ARQUIVO SINCRONIZADO'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha de leitura'); }
  }
  async function login(event: React.FormEvent) {
    event.preventDefault(); setMessage('AUTENTICANDO…');
    try { const session = await adminLogin(email, password); setToken(session.access_token); setUser(session.user.email ?? email); setMessage('ACESSO LIBERADO'); setRows(await adminList(table, session.access_token)); } catch (error) { setMessage(error instanceof Error ? error.message : 'ACESSO NEGADO'); }
  }
  async function saveDraft() {
    if (!token) return;
    try {
      const payload = JSON.parse(draft) as Record<string, unknown>;
      if (editingId === null) await adminCreate(table, payload, token); else await adminUpdate(table, editingId, payload, token);
      setDraft('{}'); setEditingId(null); await load(); setMessage('REGISTRO SALVO');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'JSON inválido ou falha ao salvar.'); }
  }
  async function saveMember() {
    if (!token || !memberDraft.nick.trim()) return setMessage('Informe o nick do integrante.');
    try {
      setMessage('SALVANDO OPERADOR…');
      const payload: Record<string, unknown> = {
        member_code: memberDraft.member_code.trim() || null,
        nick: memberDraft.nick.trim(), role: memberDraft.role.trim() || 'Membro', specialty: memberDraft.specialty,
        rank_code: memberDraft.rank_code, kd: memberDraft.kd.trim() ? Number(memberDraft.kd) : null,
        status: memberDraft.status, avatar_url: memberDraft.avatar_url || null, featured: memberDraft.featured, active: memberDraft.active,
      };
      if (editingId === null) await adminCreate('members', payload, token); else await adminUpdate('members', editingId, payload, token);
      setMemberDraft(emptyMember); setEditingId(null); await load('members'); setMessage('OPERADOR SALVO');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao salvar operador.'); }
  }
  async function handlePhoto(file?: File) {
    if (!file || !token) return;
    try { setUploading(true); setMessage('ENVIANDO FOTO…'); const photoUrl = await uploadMemberPhoto(file, token); setMemberDraft((current) => ({ ...current, avatar_url: photoUrl })); setMessage('FOTO PRONTA PARA SALVAR'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Falha no upload.'); }
    finally { setUploading(false); }
  }
  async function remove(id: string | number) { if (!token || !window.confirm('Excluir este registro?')) return; try { await adminDelete(table, id, token); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao excluir'); } }

  function selectTable(id: (typeof tables)[number][0]) {
    setTable(id); setEditingId(null); setDraft('{}'); setMemberDraft(emptyMember); void load(id);
  }

  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ÁREA RESTRITA // COMANDO</span><h1>PAINEL <em>ADMIN</em></h1><p>Gestão de elenco, fotos, patentes, conteúdo, eventos e recrutamento via Supabase Auth + RLS.</p></div></section>
    <section className="wg3-section wg3-shell">
      {!token ? <form className="wg3-admin-login glass" onSubmit={login}><LockKeyhole /><span className="wg3-kicker">AUTENTICAÇÃO</span><h2>ACESSO DO COMANDO</h2><p>{supabaseReady ? 'Entre com uma conta autorizada no Supabase.' : 'Supabase ainda não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'}</p><label><span>E-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label><span>Senha</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="neon-btn" type="submit" disabled={!supabaseReady}>ENTRAR <LogIn /></button>{message && <small>{message}</small>}</form>
      : <div className="wg3-admin-dashboard"><div className="wg3-admin-head glass"><ShieldCheck /><div><span className="wg3-kicker">SESSÃO AUTORIZADA</span><h2>{user}</h2></div><button className="ghost-btn" onClick={() => { setToken(''); setRows([]); }}>ENCERRAR SESSÃO</button></div>
        <div className="wg3-admin-tabs">{tables.map(([id,label]) => <button key={id} className={table === id ? 'active' : ''} onClick={() => selectTable(id)}>{label}</button>)}</div>
        <div className="wg3-admin-toolbar glass"><div><span className="wg3-kicker">EDITOR // {table}</span><strong>{rows.length} REGISTRO(S)</strong></div><button className="ghost-btn" onClick={() => void load()}><RefreshCw /> ATUALIZAR</button><button className="neon-btn" onClick={() => { setEditingId(null); setDraft('{}'); setMemberDraft(emptyMember); }}><Plus /> NOVO</button></div>

        {table === 'members' ? <div className="wg3-member-admin-layout">
          <section className="wg3-member-form glass"><span className="wg3-kicker">{editingId === null ? 'NOVO OPERADOR' : `EDITAR OPERADOR // ${editingId}`}</span><h2>FICHA DO INTEGRANTE</h2><div className="wg3-member-admin-preview">{memberDraft.avatar_url ? <img src={memberDraft.avatar_url} alt="Prévia do integrante" /> : <div><UserRound /><span>SEM FOTO</span></div>}<RankBadge code={memberDraft.rank_code} /></div>
            <label><span>FOTO DO INTEGRANTE</span><input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} onChange={(e) => void handlePhoto(e.target.files?.[0])} /></label>
            <div className="wg3-member-form-grid"><label><span>ID DO CLÃ</span><input value={memberDraft.member_code} onChange={(e) => setMemberDraft({ ...memberDraft, member_code: e.target.value })} placeholder="WG-001" /></label><label><span>NICK</span><input value={memberDraft.nick} onChange={(e) => setMemberDraft({ ...memberDraft, nick: e.target.value })} placeholder="Nome no jogo" /></label><label><span>FUNÇÃO NO CLÃ</span><input value={memberDraft.role} onChange={(e) => setMemberDraft({ ...memberDraft, role: e.target.value })} placeholder="Líder, Oficial, Membro..." /></label><label><span>ESPECIALIDADE</span><select value={memberDraft.specialty} onChange={(e) => setMemberDraft({ ...memberDraft, specialty: e.target.value as MemberDraft['specialty'] })}>{['Rifleman','Sniper','Suporte','Entry'].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>PATENTE</span><select value={memberDraft.rank_code} onChange={(e) => setMemberDraft({ ...memberDraft, rank_code: e.target.value })}>{combatRanks.map((rank) => <option key={rank.code} value={rank.code}>{rank.code}</option>)}</select></label><label><span>K/D</span><input value={memberDraft.kd} onChange={(e) => setMemberDraft({ ...memberDraft, kd: e.target.value })} inputMode="decimal" placeholder="1.85" /></label><label><span>STATUS</span><select value={memberDraft.status} onChange={(e) => setMemberDraft({ ...memberDraft, status: e.target.value as MemberDraft['status'] })}><option value="offline">OFFLINE</option><option value="online">ONLINE</option></select></label></div>
            <div className="wg3-member-switches"><label><input type="checkbox" checked={memberDraft.featured} onChange={(e) => setMemberDraft({ ...memberDraft, featured: e.target.checked })} />DESTAQUE NA HOME</label><label><input type="checkbox" checked={memberDraft.active} onChange={(e) => setMemberDraft({ ...memberDraft, active: e.target.checked })} />MEMBRO ATIVO</label></div><button className="neon-btn" onClick={() => void saveMember()} disabled={uploading}>{uploading ? <Upload /> : <Save />} {uploading ? 'ENVIANDO FOTO…' : 'SALVAR OPERADOR'}</button>
          </section>
          <section className="wg3-admin-list wg3-member-admin-list glass"><span className="wg3-kicker">ELENCO CADASTRADO</span>{rows.length ? rows.map((row, index) => <article key={String(row.id ?? index)} className="wg3-admin-member-row"><div className="wg3-admin-member-mini">{row.avatar_url ? <img src={String(row.avatar_url)} alt="" /> : <UserRound />}<RankBadge code={String(row.rank_code ?? 'RANK-001')} compact /></div><div><strong>{String(row.nick ?? 'OPERADOR')}</strong><small>{String(row.member_code ?? '')} · {String(row.role ?? 'Membro')} · {String(row.specialty ?? '')}</small></div><div className="wg3-admin-row-actions"><button className="ghost-btn" onClick={() => { setEditingId((row.id as string | number) ?? index); setMemberDraft(memberFromRow(row)); }}>EDITAR</button>{row.id !== undefined && <button className="wg3-danger-btn" onClick={() => void remove(row.id as string | number)}><Trash2 /> EXCLUIR</button>}</div></article>) : <p>Nenhum integrante cadastrado.</p>}</section>
        </div> : <div className="wg3-admin-editor"><section className="glass"><span className="wg3-kicker">{editingId === null ? 'NOVO REGISTRO' : `EDITAR // ${editingId}`}</span><p>Edite o JSON do registro. Campos obrigatórios dependem da tabela e do schema SQL.</p><textarea value={draft} onChange={(e) => setDraft(e.target.value)} spellCheck={false} /><button className="neon-btn" onClick={() => void saveDraft()}><Save /> SALVAR REGISTRO</button></section><section className="wg3-admin-list glass"><span className="wg3-kicker">REGISTROS</span>{rows.length ? rows.map((row, index) => <article key={String(row.id ?? index)}><pre>{JSON.stringify(row, null, 2)}</pre><div><button className="ghost-btn" onClick={() => { setEditingId((row.id as string | number) ?? index); const { id, created_at, ...editable } = row; setDraft(JSON.stringify(editable, null, 2)); }}>EDITAR</button>{row.id !== undefined && <button className="wg3-danger-btn" onClick={() => void remove(row.id as string | number)}><Trash2 /> EXCLUIR</button>}</div></article>) : <p>Nenhum registro encontrado.</p>}</section></div>}
        {message && <div className="wg3-admin-message">{message}</div>}
      </div>}
    </section>
  </main></SiteShell>;
}

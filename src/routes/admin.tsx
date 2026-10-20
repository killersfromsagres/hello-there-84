import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck, RefreshCw, Plus, Trash2, Save } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { adminCreate, adminDelete, adminList, adminLogin, adminUpdate, supabaseReady } from '@/lib/supabase-rest';

export const Route = createFileRoute('/admin')({ component: AdminPage, head: () => ({ meta: [{ title: 'Admin — Wicked Grin' }, { name: 'robots', content: 'noindex,nofollow' }] }) });

const tables = [
  ['members', 'Membros'], ['clan_ranks', 'Patentes'], ['news', 'Notícias'], ['media', 'Mídia'], ['events', 'Eventos'], ['clan_stats', 'Números'], ['recruitment_requests', 'Alistamentos'],
] as const;

function AdminPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [token, setToken] = useState(''); const [user, setUser] = useState('');
  const [table, setTable] = useState<(typeof tables)[number][0]>('members');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]); const [message, setMessage] = useState('');
  const [draft, setDraft] = useState('{}'); const [editingId, setEditingId] = useState<string | number | null>(null);

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
  async function remove(id: string | number) { if (!token || !window.confirm('Excluir este registro?')) return; try { await adminDelete(table, id, token); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao excluir'); } }

  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ÁREA RESTRITA // COMANDO</span><h1>PAINEL <em>ADMIN</em></h1><p>Gestão de elenco, patentes, conteúdo, eventos e recrutamento via Supabase Auth + RLS.</p></div></section>
    <section className="wg3-section wg3-shell">
      {!token ? <form className="wg3-admin-login glass" onSubmit={login}><LockKeyhole /><span className="wg3-kicker">AUTENTICAÇÃO</span><h2>ACESSO DO COMANDO</h2><p>{supabaseReady ? 'Entre com uma conta autorizada no Supabase.' : 'Supabase ainda não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'}</p><label><span>E-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label><span>Senha</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="neon-btn" type="submit" disabled={!supabaseReady}>ENTRAR <LogIn /></button>{message && <small>{message}</small>}</form>
      : <div className="wg3-admin-dashboard"><div className="wg3-admin-head glass"><ShieldCheck /><div><span className="wg3-kicker">SESSÃO AUTORIZADA</span><h2>{user}</h2></div><button className="ghost-btn" onClick={() => { setToken(''); setRows([]); }}>ENCERRAR SESSÃO</button></div>
        <div className="wg3-admin-tabs">{tables.map(([id,label]) => <button key={id} className={table === id ? 'active' : ''} onClick={() => { setTable(id); setEditingId(null); setDraft('{}'); void load(id); }}>{label}</button>)}</div>
        <div className="wg3-admin-toolbar glass"><div><span className="wg3-kicker">EDITOR // {table}</span><strong>{rows.length} REGISTRO(S)</strong></div><button className="ghost-btn" onClick={() => void load()}><RefreshCw /> ATUALIZAR</button><button className="neon-btn" onClick={() => { setEditingId(null); setDraft('{}'); }}><Plus /> NOVO</button></div>
        <div className="wg3-admin-editor"><section className="glass"><span className="wg3-kicker">{editingId === null ? 'NOVO REGISTRO' : `EDITAR // ${editingId}`}</span><p>Edite o JSON do registro. Campos obrigatórios dependem da tabela e do schema SQL.</p><textarea value={draft} onChange={(e) => setDraft(e.target.value)} spellCheck={false} /><button className="neon-btn" onClick={() => void saveDraft()}><Save /> SALVAR REGISTRO</button></section><section className="wg3-admin-list glass"><span className="wg3-kicker">REGISTROS</span>{rows.length ? rows.map((row, index) => <article key={String(row.id ?? index)}><pre>{JSON.stringify(row, null, 2)}</pre><div><button className="ghost-btn" onClick={() => { setEditingId((row.id as string | number) ?? index); const { id, created_at, ...editable } = row; setDraft(JSON.stringify(editable, null, 2)); }}>EDITAR</button>{row.id !== undefined && <button className="wg3-danger-btn" onClick={() => void remove(row.id as string | number)}><Trash2 /> EXCLUIR</button>}</div></article>) : <p>Nenhum registro encontrado.</p>}</section></div>
        {message && <div className="wg3-admin-message">{message}</div>}
      </div>}
    </section>
  </main></SiteShell>;
}

import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { LockKeyhole, LogIn, ShieldCheck } from 'lucide-react';
import { SiteShell } from '@/components/wg/SiteShell';
import { adminList, adminLogin, supabaseReady } from '@/lib/supabase-rest';

export const Route = createFileRoute('/admin')({ component: AdminPage, head: () => ({ meta: [{ title: 'Admin — Wicked Grin' }, { name: 'robots', content: 'noindex,nofollow' }] }) });

function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const [requests, setRequests] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState('');

  async function login(event: React.FormEvent) {
    event.preventDefault(); setMessage('AUTENTICANDO…');
    try {
      const session = await adminLogin(email, password);
      setToken(session.access_token); setUser(session.user.email ?? email); setMessage('ACESSO LIBERADO');
      setRequests(await adminList('recruitment_requests', session.access_token));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'ACESSO NEGADO'); }
  }

  return <SiteShell><main className="wg3-page"><section className="wg3-page-hero"><div className="wg3-shell"><span className="wg3-kicker">ÁREA RESTRITA // COMANDO</span><h1>PAINEL <em>ADMIN</em></h1><p>Gestão operacional preparada para Supabase Auth + RLS.</p></div></section>
    <section className="wg3-section wg3-shell">
      {!token ? <form className="wg3-admin-login glass" onSubmit={login}><LockKeyhole /><span className="wg3-kicker">AUTENTICAÇÃO</span><h2>ACESSO DO COMANDO</h2><p>{supabaseReady ? 'Entre com uma conta autorizada no Supabase.' : 'Supabase ainda não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'}</p><label><span>E-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label><span>Senha</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="neon-btn" type="submit" disabled={!supabaseReady}>ENTRAR <LogIn /></button>{message && <small>{message}</small>}</form>
      : <div className="wg3-admin-dashboard"><div className="wg3-admin-head glass"><ShieldCheck /><div><span className="wg3-kicker">SESSÃO AUTORIZADA</span><h2>{user}</h2></div><button className="ghost-btn" onClick={() => { setToken(''); setRequests([]); }}>ENCERRAR SESSÃO</button></div><div className="wg3-admin-grid">{['Membros','Patentes','Notícias','Mídia','Eventos','Números'].map((item) => <article className="glass" key={item}><span className="wg3-kicker">CRUD</span><h3>{item}</h3><p>Estrutura de tabela prevista no schema SQL. Interface detalhada entra após dados reais e regras de acesso.</p></article>)}</div><section className="wg3-admin-requests glass"><span className="wg3-kicker">ALISTAMENTOS</span><h2>{requests.length} PEDIDO(S)</h2>{requests.length ? requests.map((row, index) => <pre key={index}>{JSON.stringify(row, null, 2)}</pre>) : <p>Nenhum pedido encontrado ou tabela ainda não populada.</p>}</section></div>}
    </section>
  </main></SiteShell>;
}

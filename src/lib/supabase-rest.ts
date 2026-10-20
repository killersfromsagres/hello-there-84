const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseReady = Boolean(url && anonKey);

function headers(token?: string) {
  return {
    apikey: anonKey ?? '',
    Authorization: `Bearer ${token || anonKey || ''}`,
    'Content-Type': 'application/json',
  };
}

export async function submitRecruitment(payload: Record<string, unknown>) {
  if (!supabaseReady) return { mode: 'demo' as const };
  const response = await fetch(`${url}/rest/v1/recruitment_requests`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'return=minimal' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Falha ao registrar alistamento.');
  return { mode: 'live' as const };
}

export async function adminLogin(email: string, password: string) {
  if (!supabaseReady) throw new Error('Supabase ainda não configurado.');
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Acesso negado. Verifique e-mail e senha.');
  return response.json() as Promise<{ access_token: string; user: { email?: string } }>;
}

export async function adminList(table: string, token: string) {
  if (!supabaseReady) return [];
  const response = await fetch(`${url}/rest/v1/${table}?select=*&order=created_at.desc`, { headers: headers(token) });
  if (!response.ok) throw new Error(`Falha ao carregar ${table}.`);
  return response.json() as Promise<Record<string, unknown>[]>;
}

export async function adminCreate(table: string, payload: Record<string, unknown>, token: string) {
  const response = await fetch(`${url}/rest/v1/${table}`, { method: 'POST', headers: { ...headers(token), Prefer: 'return=representation' }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error(`Falha ao criar registro em ${table}.`);
  return response.json() as Promise<Record<string, unknown>[]>;
}

export async function adminUpdate(table: string, id: string | number, payload: Record<string, unknown>, token: string) {
  const response = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(String(id))}`, { method: 'PATCH', headers: { ...headers(token), Prefer: 'return=representation' }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error(`Falha ao atualizar registro em ${table}.`);
  return response.json() as Promise<Record<string, unknown>[]>;
}

export async function adminDelete(table: string, id: string | number, token: string) {
  const response = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(String(id))}`, { method: 'DELETE', headers: headers(token) });
  if (!response.ok) throw new Error(`Falha ao excluir registro em ${table}.`);
}

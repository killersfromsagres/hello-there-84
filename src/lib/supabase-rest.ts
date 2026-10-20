import type { Member } from '@/data/wicked-v3';

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

export async function publicMembers(): Promise<Member[]> {
  if (!supabaseReady) return [];
  const response = await fetch(`${url}/rest/v1/members?select=*&active=eq.true&order=created_at.asc`, { headers: headers() });
  if (!response.ok) return [];
  const rows = await response.json() as Record<string, unknown>[];
  return rows.map((row) => ({
    id: String(row.member_code ?? row.id ?? ''),
    nick: String(row.nick ?? 'OPERADOR'),
    role: String(row.role ?? 'Membro'),
    specialty: (['Rifleman', 'Sniper', 'Suporte', 'Entry'].includes(String(row.specialty)) ? String(row.specialty) : 'Rifleman') as Member['specialty'],
    rankCode: String(row.rank_code ?? 'RANK-001'),
    kd: row.kd === null || row.kd === undefined ? undefined : String(row.kd),
    status: String(row.status) === 'online' ? 'online' : 'offline',
    featured: Boolean(row.featured),
    photoUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    joinedAt: row.joined_at ? String(row.joined_at) : undefined,
  }));
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

export async function uploadMemberPhoto(file: File, token: string) {
  if (!supabaseReady || !url) throw new Error('Supabase Storage ainda não configurado.');
  const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'webp';
  const objectPath = `members/${crypto.randomUUID()}.${extension}`;
  const response = await fetch(`${url}/storage/v1/object/member-photos/${objectPath}`, {
    method: 'POST',
    headers: {
      apikey: anonKey ?? '',
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: file,
  });
  if (!response.ok) throw new Error('Falha ao enviar a foto do integrante. Verifique o bucket member-photos.');
  return `${url}/storage/v1/object/public/member-photos/${objectPath}`;
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

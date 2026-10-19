export const clanConfig = { discordInvite: '', discordServerId: '', instagram: '', youtube: '' };
export const members = [
  { nick: 'REAPER', role: 'Líder', function: 'Entry fragger', rank: 'General', weapon: 'M416 CQB', online: true, kd: 2.84, wins: 186, kills: 14820 },
  { nick: 'GHOST', role: 'Sub-líder', function: 'Sniper', rank: 'General', weapon: 'L96A1', online: true, kd: 2.67, wins: 172, kills: 13640 },
  { nick: 'VIPER', role: 'Oficial', function: 'Suporte', rank: 'Coronel', weapon: 'G36E', online: true, kd: 2.41, wins: 158, kills: 12180 },
  { nick: 'HAVOC', role: 'Oficial', function: 'Entry fragger', rank: 'Coronel', weapon: 'AK-47', online: false, kd: 2.32, wins: 143, kills: 11420 },
  { nick: 'NYX', role: 'Membro', function: 'Sniper', rank: 'Major', weapon: 'TPG-1', online: true, kd: 2.26, wins: 139, kills: 10870 },
  { nick: 'BLITZ', role: 'Membro', function: 'Assault', rank: 'Major', weapon: 'M4A1', online: false, kd: 2.18, wins: 131, kills: 10250 },
  { nick: 'RAVEN', role: 'Membro', function: 'Suporte', rank: 'Capitão', weapon: 'SCAR-L', online: true, kd: 2.04, wins: 124, kills: 9840 },
  { nick: 'FANG', role: 'Membro', function: 'Assault', rank: 'Capitão', weapon: 'AK-74M', online: false, kd: 1.98, wins: 118, kills: 9250 },
  { nick: 'VENOM', role: 'Membro', function: 'Entry fragger', rank: 'Tenente', weapon: 'UMP45', online: true, kd: 1.91, wins: 112, kills: 8870 },
  { nick: 'ZERO', role: 'Membro', function: 'Sniper', rank: 'Tenente', weapon: 'L115A3', online: false, kd: 1.86, wins: 104, kills: 8210 },
  { nick: 'ECHO', role: 'Recruta', function: 'Suporte', rank: 'Sargento', weapon: 'K2', online: false, kd: 1.72, wins: 78, kills: 6520 },
  { nick: 'ASH', role: 'Recruta', function: 'Assault', rank: 'Sargento', weapon: 'M16A3', online: true, kd: 1.64, wins: 65, kills: 5870 },
];
export type Member = typeof members[number];
export type SortKey = 'nick' | 'kd' | 'wins' | 'kills';
export function sortRanking(key: SortKey, ascending: boolean) {
  return [...members].sort((a, b) => { const x = a[key]; const y = b[key]; const result = typeof x === 'string' && typeof y === 'string' ? x.localeCompare(y) : Number(x) - Number(y); return ascending ? result : -result; });
}
export const monthly = [ { month: 'MAI', wins: 54 }, { month: 'JUN', wins: 68 }, { month: 'JUL', wins: 61 }, { month: 'AGO', wins: 82 }, { month: 'SET', wins: 91 }, { month: 'OUT', wins: 106 } ];
export const matches = [
  { id: 'OP-041', opponent: 'BLACK COBRA', date: '2026-10-23T23:00:00Z', map: 'Sand Hog', mode: 'Search & Destroy', score: null, status: 'Agendada' },
  { id: 'OP-042', opponent: 'IRON WOLVES', date: '2026-10-25T22:00:00Z', map: 'Warhead', mode: 'Elimination Pro', score: null, status: 'Agendada' },
  { id: 'OP-040', opponent: 'DEAD SILENCE', date: '2026-10-17T23:00:00Z', map: 'Power Surge', mode: 'Search & Destroy', score: '8 : 3', status: 'Vitória' },
  { id: 'OP-039', opponent: 'NIGHT RAID', date: '2026-10-15T23:00:00Z', map: 'Rattlesnake', mode: 'Elimination Pro', score: '6 : 8', status: 'Derrota' },
];
export const conduct = [
  ['Respeito não é opcional.', 'Rivalidade fica dentro da partida. Racismo, preconceito, assédio e ataques pessoais não têm espaço aqui. Respeite o time, os adversários e a comunidade.'],
  ['Mira limpa. Consciência limpa.', 'Sem cheats, macros abusivos ou exploração de bugs. Vitória conquistada com trapaça não é vitória. Suspeitas são avaliadas pela liderança com evidências.'],
  ['A missão vem antes do ego.', 'Escute as calls, mantenha a comunicação objetiva e avise quando não puder comparecer. O placar individual nunca vale mais que a equipe.'],
  ['Seu nick carrega nosso nome.', 'Não exponha conversas, dados pessoais ou estratégias internas. Fora do jogo, você também representa o WICKED GRIN.'],
  ['Errou? Evolua. Repetiu? Responda.', 'Feedback é parte do treino. Infrações são avaliadas pela liderança e podem resultar em advertência, afastamento ou remoção, de acordo com a gravidade.'],
];

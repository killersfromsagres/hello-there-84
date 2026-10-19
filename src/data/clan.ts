export const clanConfig = {
  discordInvite: '',
  discordServerId: '',
  instagram: '',
  youtube: '',
  twitch: '',
};

export type Hierarchy = 'Comando' | 'Oficiais' | 'Soldados' | 'Recrutas';
export type MemberRole = 'Líder' | 'Vice-líder' | 'Oficial' | 'Soldado' | 'Recruta';

export type Member = {
  id: string;
  nick: string;
  hierarchy: Hierarchy;
  role: MemberRole;
  function: 'Rifleman' | 'Sniper' | 'Suporte' | 'Entry';
  rank: 'General' | 'Coronel' | 'Major' | 'Capitão' | 'Tenente' | 'Sargento';
  weapon: string;
  online: boolean;
  joined: string;
  note: string;
  discord?: string;
};

export const members: Member[] = [
  { id: 'WG-001', nick: 'REAPER', hierarchy: 'Comando', role: 'Líder', function: 'Entry', rank: 'General', weapon: 'M416 CQB', online: true, joined: '2022-03-14', note: 'Puxa a primeira entrada e organiza as calls de ataque.', discord: 'reaper.wg' },
  { id: 'WG-002', nick: 'GHOST', hierarchy: 'Comando', role: 'Vice-líder', function: 'Sniper', rank: 'General', weapon: 'L96A1', online: true, joined: '2022-04-02', note: 'Controle de longa distância e leitura de rotação inimiga.', discord: 'ghost.wg' },
  { id: 'WG-003', nick: 'VIPER', hierarchy: 'Oficiais', role: 'Oficial', function: 'Suporte', rank: 'Coronel', weapon: 'G36E', online: true, joined: '2022-08-19', note: 'Coordena utilidade, cobertura e disciplina de posição.' },
  { id: 'WG-004', nick: 'HAVOC', hierarchy: 'Oficiais', role: 'Oficial', function: 'Entry', rank: 'Coronel', weapon: 'AK-47', online: false, joined: '2022-10-07', note: 'Especialista em abertura agressiva com recuo controlado.' },
  { id: 'WG-005', nick: 'NYX', hierarchy: 'Oficiais', role: 'Oficial', function: 'Sniper', rank: 'Major', weapon: 'TPG-1', online: true, joined: '2023-01-18', note: 'Âncoras defensivas e pickoffs antes da execução.' },
  { id: 'WG-006', nick: 'BLITZ', hierarchy: 'Soldados', role: 'Soldado', function: 'Rifleman', rank: 'Major', weapon: 'M4A1', online: false, joined: '2023-03-11', note: 'Rifle consistente, bom em troca e avanço coordenado.' },
  { id: 'WG-007', nick: 'RAVEN', hierarchy: 'Soldados', role: 'Soldado', function: 'Suporte', rank: 'Capitão', weapon: 'SCAR-L', online: true, joined: '2023-05-29', note: 'Segura linhas, faz trade e mantém a formação viva.' },
  { id: 'WG-008', nick: 'FANG', hierarchy: 'Soldados', role: 'Soldado', function: 'Rifleman', rank: 'Capitão', weapon: 'AK-74M', online: false, joined: '2023-07-22', note: 'Versátil em ataque e defesa, sem inventar moda quando a call está limpa.' },
  { id: 'WG-009', nick: 'VENOM', hierarchy: 'Soldados', role: 'Soldado', function: 'Entry', rank: 'Tenente', weapon: 'UMP45', online: true, joined: '2024-01-09', note: 'Fecha distância rápido e força espaço para o restante do time.' },
  { id: 'WG-010', nick: 'ZERO', hierarchy: 'Soldados', role: 'Soldado', function: 'Sniper', rank: 'Tenente', weapon: 'L115A3', online: false, joined: '2024-02-17', note: 'Paciente no gatilho. Se viu primeiro, normalmente termina primeiro.' },
  { id: 'WG-011', nick: 'ECHO', hierarchy: 'Recrutas', role: 'Recruta', function: 'Suporte', rank: 'Sargento', weapon: 'K2', online: false, joined: '2026-08-03', note: 'Em avaliação de comunicação, presença e leitura de equipe.' },
  { id: 'WG-012', nick: 'ASH', hierarchy: 'Recrutas', role: 'Recruta', function: 'Rifleman', rank: 'Sargento', weapon: 'M16A3', online: true, joined: '2026-09-12', note: 'Em avaliação técnica. Boa disciplina de mira e movimentação.' },
];

export const conduct = [
  ['Respeito não é opcional.', 'Rivalidade fica dentro da partida. Racismo, preconceito, assédio e ataques pessoais não têm espaço aqui.'],
  ['Mira limpa. Consciência limpa.', 'Sem cheats, macros abusivos ou exploração de bugs. Vitória suja não entra no histórico.'],
  ['A missão vem antes do ego.', 'Escute as calls, mantenha a comunicação objetiva e faça o simples bem feito.'],
  ['Presença é parte do contrato.', 'Treinos e partidas marcadas exigem compromisso. Se não puder ir, avise com antecedência.'],
  ['Discord é nossa sala de operação.', 'Chamadas, avisos e decisões importantes passam pelos canais oficiais do clã.'],
  ['Seu nick carrega nosso nome.', 'Fora da partida você continua representando o WICKED GRIN. Pense antes de agir.'],
];

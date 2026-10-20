export type Member = {
  id: string;
  nick: string;
  role: string;
  specialty: 'Rifleman' | 'Sniper' | 'Suporte' | 'Entry';
  rank: string;
  kd?: string;
  status: 'online' | 'offline';
  featured?: boolean;
};

export type ClanRank = {
  id: number;
  nome: string;
  nivel: string;
  imagem: string;
  descricao: string;
};

export const clanStats = [
  { value: 24, suffix: '+', label: 'Membros ativos' },
  { value: 418, suffix: '', label: 'Vitórias registradas' },
  { value: 12, suffix: '', label: 'Torneios disputados' },
  { value: 6, suffix: '', label: 'Anos de história' },
];

export const members: Member[] = [
  { id: 'WG-001', nick: 'REAPER', role: 'Líder', specialty: 'Rifleman', rank: 'A DEFINIR', kd: '2.41', status: 'online', featured: true },
  { id: 'WG-002', nick: 'GHOST', role: 'Sub-líder', specialty: 'Sniper', rank: 'A DEFINIR', kd: '2.18', status: 'online', featured: true },
  { id: 'WG-003', nick: 'VIPER', role: 'Oficial', specialty: 'Entry', rank: 'A DEFINIR', kd: '1.96', status: 'offline', featured: true },
  { id: 'WG-004', nick: 'HAVOC', role: 'Oficial', specialty: 'Suporte', rank: 'A DEFINIR', kd: '1.84', status: 'online' },
  { id: 'WG-005', nick: 'NYX', role: 'Membro', specialty: 'Sniper', rank: 'A DEFINIR', kd: '1.78', status: 'offline' },
  { id: 'WG-006', nick: 'BLITZ', role: 'Membro', specialty: 'Entry', rank: 'A DEFINIR', kd: '1.72', status: 'online' },
  { id: 'WG-007', nick: 'RAVEN', role: 'Membro', specialty: 'Rifleman', rank: 'A DEFINIR', kd: '1.65', status: 'offline' },
  { id: 'WG-008', nick: 'FANG', role: 'Recruta', specialty: 'Suporte', rank: 'A DEFINIR', kd: '1.44', status: 'online' },
];

export const ranks: ClanRank[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  nome: 'A DEFINIR',
  nivel: 'A DEFINIR',
  imagem: `/assets/patentes/patente-${String(index + 1).padStart(2, '0')}.png`,
  descricao: 'Aguardando o nome, nível e a imagem oficial fornecidos pelo clã.',
}));

export const news = [
  { tag: 'OPERAÇÃO', date: 'A DEFINIR', title: 'Próxima missão do esquadrão', text: 'Calendário oficial será publicado assim que as datas forem confirmadas.' },
  { tag: 'ELENCO', date: 'A DEFINIR', title: 'Janela de recrutamento', text: 'Seleção orientada por disciplina, comunicação e consistência em combate.' },
  { tag: 'COMUNIDADE', date: 'A DEFINIR', title: 'Base Wicked Grin', text: 'Discord, calendário de treinos e conteúdo do clã serão centralizados aqui.' },
];

export const timeline = [
  ['FUNDAÇÃO', 'O Wicked Grin nasce com uma regra simples: habilidade individual só vale quando fortalece o esquadrão.'],
  ['FORMAÇÃO', 'A estrutura cresce em torno de liderança, disciplina tática, comunicação curta e evolução constante.'],
  ['COMPETIÇÃO', 'O clã passa a organizar treinos, desafios internos e presença competitiva com foco em execução coletiva.'],
  ['PRÓXIMA MISSÃO', 'Expandir a comunidade sem perder identidade, lealdade e padrão de jogo.'],
] as const;

export const rules = [
  ['ARTIGO 01', 'RESPEITO É REGRA', 'Sem toxicidade, discriminação ou perseguição. Quem veste a tag representa o esquadrão.'],
  ['ARTIGO 02', 'JOGO LIMPO', 'Cheats, exploits abusivos e qualquer atalho incompatível com competição justa não têm espaço.'],
  ['ARTIGO 03', 'CALL LIMPA', 'Comunicação objetiva durante partidas. Informação útil acima de ruído e ego.'],
  ['ARTIGO 04', 'TIME ANTES DO EGO', 'Decisão coletiva e função do esquadrão vêm antes de estatística individual.'],
  ['ARTIGO 05', 'PRESENÇA', 'Treinos, eventos e compromissos confirmados devem ser tratados com responsabilidade.'],
  ['ARTIGO 06', 'EVOLUÇÃO', 'Feedback é parte da operação. Aprender rápido vale tanto quanto mirar bem.'],
] as const;

export const mediaItems = [
  { type: 'Screenshot', title: 'Operação Neon', note: 'Espaço reservado para screenshot real do clã.' },
  { type: 'Highlight', title: 'Último Segundo', note: 'Espaço reservado para highlight enviado pelo clã.' },
  { type: 'Torneio', title: 'Zona de Confronto', note: 'Espaço reservado para material de torneio.' },
  { type: 'Vídeo', title: 'Trailer Wicked Grin', note: 'Aguardando link do vídeo oficial.' },
  { type: 'Screenshot', title: 'Esquadrão Completo', note: 'Envie imagens do grupo para substituir este card.' },
  { type: 'Highlight', title: 'Mira Travada', note: 'Galeria preparada para receber seus arquivos.' },
];

export const hierarchy = [
  ['LÍDER', 'Comando estratégico e decisão final.'],
  ['SUB-LÍDER', 'Coordenação operacional e suporte ao comando.'],
  ['OFICIAIS', 'Organização de treinos, disciplina e squads.'],
  ['MEMBROS', 'Base operacional ativa do Wicked Grin.'],
  ['RECRUTAS', 'Em avaliação técnica e comportamental.'],
] as const;

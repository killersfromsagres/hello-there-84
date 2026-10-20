export type CombatRank = { id: number; code: string; nome: string; nivel: string; x: number; y: number; width: number; height: number };

const rows: Array<{ y: number; count: number }> = [
  { y: 6, count: 2 },
  { y: 58, count: 1 },
  { y: 108, count: 1 },
  { y: 158, count: 1 },
  { y: 209, count: 1 },
  { y: 260, count: 3 },
  { y: 310, count: 3 },
  { y: 361, count: 4 },
  { y: 412, count: 5 },
  { y: 462, count: 5 },
  { y: 513, count: 5 },
  { y: 564, count: 5 },
  { y: 614, count: 5 },
  { y: 665, count: 5 },
  { y: 716, count: 5 },
  { y: 766, count: 5 },
  { y: 817, count: 5 },
  { y: 868, count: 5 },
  { y: 918, count: 5 },
  { y: 969, count: 5 },
];

const xs = [26, 81, 136, 191, 246];

export const combatRanks: CombatRank[] = rows.flatMap((row) =>
  xs.slice(0, row.count).map((x) => ({ x, y: row.y })),
).map((position, index) => ({
  id: index + 1,
  code: `RANK-${String(index + 1).padStart(3, '0')}`,
  nome: 'A DEFINIR',
  nivel: 'A DEFINIR',
  x: position.x,
  y: position.y,
  width: 30,
  height: 32,
}));

export const rankByCode = (code?: string) => combatRanks.find((rank) => rank.code === code) ?? combatRanks[0];

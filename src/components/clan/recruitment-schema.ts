import { z } from 'zod';

const safeLink = z.string().trim().max(500, 'Use até 500 caracteres.').refine((value) => {
  if (!value) return true;
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, 'Informe um link válido com https://.');

export const recruitmentSchema = z.object({
  nick: z.string().trim().min(2, 'Informe um nick com pelo menos 2 caracteres.').max(24, 'Use até 24 caracteres.').regex(/^[\p{L}\p{N}_.-]+$/u, 'Use letras, números, ponto, hífen ou sublinhado.'),
  age: z.coerce.number({ invalid_type_error: 'Informe sua idade.' }).int('Informe uma idade inteira.').min(13, 'A idade mínima para esta demonstração é 13 anos.').max(120, 'Informe uma idade válida.'),
  discord: z.string().trim().min(2, 'Informe seu usuário do Discord.').max(64, 'Use até 64 caracteres.'),
  rank: z.string().min(1, 'Selecione sua patente.'),
  availability: z.string().trim().min(3, 'Informe seus dias e horários.').max(200, 'Use até 200 caracteres.'),
  function: z.enum(['', 'Rifleman', 'Sniper', 'Suporte', 'Entry']).refine((value) => value !== '', 'Selecione uma função.'),
  gameplay: safeLink,
  motivation: z.string().trim().min(20, 'Conte sua motivação em pelo menos 20 caracteres.').max(1000, 'Use até 1.000 caracteres.'),
});

export const stepFields = [
  ['nick', 'age', 'discord'],
  ['rank', 'availability', 'function', 'gameplay'],
  ['motivation'],
] as const;

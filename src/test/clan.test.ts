import { describe, it, expect } from 'vitest';
import { members } from '@/data/clan';
import { recruitmentSchema, stepFields } from '@/components/clan/recruitment-schema';

const valid = {
  nick: 'OPERADOR',
  age: '24',
  discord: 'operador.wg',
  rank: 'Major',
  availability: 'Segunda 20h',
  function: 'Sniper',
  gameplay: 'https://example.com/video',
  motivation: 'Quero evoluir com o time e jogar limpo.',
};

describe('Clan rules', () => {
  it('has at least 12 fictional members across the four tactical groups', () => {
    expect(members.length).toBeGreaterThanOrEqual(12);
    expect(new Set(members.map((member) => member.hierarchy))).toEqual(new Set(['Comando', 'Oficiais', 'Soldados', 'Recrutas']));
    expect(new Set(members.map((member) => member.role))).toEqual(new Set(['Líder', 'Vice-líder', 'Oficial', 'Soldado', 'Recruta']));
  });

  it('uses unique dog-tag ids', () => {
    expect(new Set(members.map((member) => member.id)).size).toBe(members.length);
  });

  it('uses exactly three recruitment steps', () => {
    expect(stepFields).toHaveLength(3);
    expect(stepFields.flat()).toContain('motivation');
  });

  it('validates a complete candidate', () => {
    expect(recruitmentSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unsafe gameplay links', () => {
    expect(recruitmentSchema.safeParse({ ...valid, gameplay: 'javascript:alert(1)' }).success).toBe(false);
    expect(recruitmentSchema.safeParse({ ...valid, gameplay: '' }).success).toBe(true);
  });
});

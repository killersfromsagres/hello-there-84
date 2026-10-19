import { describe, it, expect } from 'vitest';
import { members, sortRanking } from '@/data/clan';
import { recruitmentSchema, stepFields } from '@/components/clan/recruitment-schema';
const valid = { nick:'OPERADOR',age:'24',discord:'operador.wg',rank:'Major',availability:'Segunda 20h',function:'Sniper',gameplay:'https://example.com/video',motivation:'Quero evoluir com o time e jogar limpo.',consent:true };
describe('Clan rules',()=>{
 it('has at least 12 fictional members and all five required ranks',()=>{expect(members.length).toBeGreaterThanOrEqual(12);expect(new Set(members.map(m=>m.role))).toEqual(new Set(['Líder','Sub-líder','Oficial','Membro','Recruta']));});
 it('sorts concrete ranking values in both directions',()=>{expect(sortRanking('kd',false)[0]?.kd).toBe(2.84);expect(sortRanking('kd',true)[0]?.kd).toBe(1.64);expect(sortRanking('wins',false)[0]?.wins).toBe(186);});
 it('uses exactly four recruitment steps',()=>{expect(stepFields).toHaveLength(4);expect(stepFields.flat()).toContain('motivation');});
 it('validates a complete candidate',()=>{expect(recruitmentSchema.safeParse(valid).success).toBe(true);});
 it('rejects unsafe gameplay links',()=>{expect(recruitmentSchema.safeParse({...valid,gameplay:'javascript:alert(1)'}).success).toBe(false);expect(recruitmentSchema.safeParse({...valid,gameplay:''}).success).toBe(true);});
 it('requires conduct consent',()=>{expect(recruitmentSchema.safeParse({...valid,consent:false}).success).toBe(false);});
});

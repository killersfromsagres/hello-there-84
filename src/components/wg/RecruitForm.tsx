import { useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { submitRecruitment, supabaseReady } from '@/lib/supabase-rest';

const initial = { nick: '', rank: '', age: '', schedule: '', experience: '', discord: '', motivation: '' };

export function RecruitForm() {
  const [values, setValues] = useState(initial);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const update = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.nick || !values.age || !values.discord || !values.motivation) {
      setState('error'); setMessage('MISSÃO FALHOU: preencha os campos obrigatórios.'); return;
    }
    setState('sending'); setMessage('');
    try {
      const result = await submitRecruitment({ ...values, status: 'pending', created_at: new Date().toISOString() });
      setState('success');
      setMessage(result.mode === 'live' ? 'ALISTAMENTO REGISTRADO. O comando recebeu seu dossiê.' : 'SIMULAÇÃO CONCLUÍDA. Configure o Supabase para envio real.');
      if (result.mode === 'live') setValues(initial);
    } catch (error) {
      setState('error'); setMessage(error instanceof Error ? error.message : 'MISSÃO FALHOU, TENTE NOVAMENTE.');
    }
  }

  return <form className="wg3-recruit-form glass hud-frame" onSubmit={submit}>
    <div className="wg3-form-head"><div><span className="wg3-kicker">FORMULÁRIO // ALISTE-SE</span><h2>ENTRE PARA O ESQUADRÃO</h2></div><span className={`wg3-backend-badge ${supabaseReady ? 'live' : ''}`}>{supabaseReady ? 'BANCO ONLINE' : 'MODO DEMO'}</span></div>
    <div className="wg3-form-grid">
      <label><span>Nick no jogo *</span><input value={values.nick} onChange={(e) => update('nick', e.target.value)} placeholder="Seu codinome" /></label>
      <label><span>Patente atual</span><input value={values.rank} onChange={(e) => update('rank', e.target.value)} placeholder="A DEFINIR / sua patente" /></label>
      <label><span>Idade *</span><input type="number" min="13" value={values.age} onChange={(e) => update('age', e.target.value)} placeholder="Idade" /></label>
      <label><span>Horário de jogo</span><input value={values.schedule} onChange={(e) => update('schedule', e.target.value)} placeholder="Ex.: 20h–23h" /></label>
      <label><span>Discord *</span><input value={values.discord} onChange={(e) => update('discord', e.target.value)} placeholder="usuario.discord" /></label>
      <label><span>Experiência</span><input value={values.experience} onChange={(e) => update('experience', e.target.value)} placeholder="Resumo da sua experiência" /></label>
      <label className="full"><span>Por que quer entrar no Wicked Grin? *</span><textarea rows={6} value={values.motivation} onChange={(e) => update('motivation', e.target.value)} placeholder="Disciplina, função, objetivos e o que você entrega ao time." /></label>
    </div>
    {message && <div className={`wg3-form-message ${state}`}>{state === 'success' && <ShieldCheck />}{message}</div>}
    <button className="neon-btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'ENVIANDO DOSSIÊ…' : <>ENVIAR ALISTAMENTO <Send /></>}</button>
  </form>;
}

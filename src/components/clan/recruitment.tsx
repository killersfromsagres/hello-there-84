import { useState } from 'react';
import { recruitmentSchema, stepFields } from './recruitment-schema';
import { TacticalIcon } from './marks';

type Values = {
  nick: string;
  age: string;
  discord: string;
  rank: string;
  availability: string;
  function: '' | 'Rifleman' | 'Sniper' | 'Suporte' | 'Entry';
  gameplay: string;
  motivation: string;
};

const initial: Values = {
  nick: '',
  age: '',
  discord: '',
  rank: '',
  availability: '',
  function: '',
  gameplay: '',
  motivation: '',
};

const labels = ['Dados do jogador', 'Experiência', 'Motivação'];

export function Recruitment() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function update(key: keyof Values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  }

  function validateCurrentStep() {
    const result = recruitmentSchema.safeParse(values);
    const fields: readonly string[] = stepFields[step] ?? [];
    const nextErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (fields.includes(key)) nextErrors[key] = issue.message;
      });
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function next() {
    if (!validateCurrentStep()) return;
    if (step < 2) setStep((current) => current + 1);
    else setSuccess(true);
  }

  function field(key: keyof Values, label: string, placeholder: string, type = 'text') {
    return (
      <label className="wg-field" htmlFor={`recruit-${key}`}>
        <span>{label}</span>
        <input
          id={`recruit-${key}`}
          value={values[key]}
          type={type}
          placeholder={placeholder}
          onChange={(event) => update(key, event.target.value)}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        />
        {errors[key] && <small id={`${key}-error`} className="wg-form-error">{errors[key]}</small>}
      </label>
    );
  }

  if (success) {
    return (
      <div className="wg-recruit-success wg-glass" role="status">
        <TacticalIcon kind="shield" />
        <span className="wg-eyebrow">DOSSIÊ VALIDADO</span>
        <h3>Perfil pronto, {values.nick}.</h3>
        <p>Esta versão ainda funciona em modo demonstração: nenhum dado foi enviado ou salvo. O envio real depende da configuração de um backend ou serviço de formulário.</p>
        <button className="wg-btn wg-btn-secondary" type="button" onClick={() => { setValues(initial); setStep(0); setSuccess(false); setErrors({}); }}>
          Nova simulação
        </button>
      </div>
    );
  }

  return (
    <form className="wg-recruit-form wg-glass" onSubmit={(event) => { event.preventDefault(); next(); }} noValidate>
      <div className="wg-form-heading">
        <div><span className="wg-eyebrow">DOSSIÊ DE RECRUTAMENTO</span><h3>{labels[step]}</h3></div>
        <span className="wg-demo-tag">DEMO / SEM ENVIO</span>
      </div>

      <ol className="wg-stepper">
        {labels.map((label, index) => (
          <li key={label} className={index === step ? 'current' : index < step ? 'complete' : ''} aria-current={index === step ? 'step' : undefined}>
            <span>0{index + 1}</span><small>{label}</small>
          </li>
        ))}
      </ol>

      <div className="wg-step-body" aria-live="polite">
        {step === 0 && <div className="wg-field-grid">{field('nick', 'Nick', 'Seu codinome')}{field('age', 'Idade', 'Sua idade', 'number')}{field('discord', 'Discord', 'ex.: reaper.wg')}</div>}

        {step === 1 && (
          <div className="wg-field-grid">
            <label className="wg-field" htmlFor="recruit-rank"><span>Patente</span><select id="recruit-rank" value={values.rank} onChange={(event) => update('rank', event.target.value)} aria-invalid={Boolean(errors.rank)}><option value="">Selecione</option>{['Soldado', 'Cabo', 'Sargento', 'Tenente', 'Capitão', 'Major', 'Coronel', 'General'].map((rank) => <option key={rank}>{rank}</option>)}</select>{errors.rank && <small className="wg-form-error">{errors.rank}</small>}</label>
            <label className="wg-field" htmlFor="recruit-function"><span>Função preferida</span><select id="recruit-function" value={values.function} onChange={(event) => update('function', event.target.value)} aria-invalid={Boolean(errors.function)}><option value="">Selecione</option>{['Rifleman', 'Sniper', 'Suporte', 'Entry'].map((role) => <option key={role}>{role}</option>)}</select>{errors.function && <small className="wg-form-error">{errors.function}</small>}</label>
            {field('availability', 'Horários disponíveis', 'Ex.: seg. a sex., 20h–23h')}
            {field('gameplay', 'Link de gameplay · opcional', 'https://youtube.com/...', 'url')}
          </div>
        )}

        {step === 2 && (
          <label className="wg-field" htmlFor="recruit-motivation"><span>Por que o WICKED GRIN?</span><textarea id="recruit-motivation" value={values.motivation} onChange={(event) => update('motivation', event.target.value)} rows={6} maxLength={1000} placeholder="Mais que boa mira: o que você acrescenta ao esquadrão?" aria-invalid={Boolean(errors.motivation)} /><small className={errors.motivation ? 'wg-form-error' : 'wg-form-count'}>{errors.motivation || `${values.motivation.length}/1000`}</small></label>
        )}
      </div>

      <div className="wg-form-actions">
        <button className="wg-btn wg-btn-secondary" type="button" disabled={step === 0} onClick={() => { setStep((current) => Math.max(0, current - 1)); setErrors({}); }}>← Voltar</button>
        <span className="wg-hud-label">0{step + 1} / 03</span>
        <button className="wg-btn wg-btn-critical" type="submit">{step === 2 ? 'Concluir simulação' : 'Continuar'} <TacticalIcon kind="arrow" /></button>
      </div>
    </form>
  );
}

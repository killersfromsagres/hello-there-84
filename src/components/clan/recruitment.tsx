import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { recruitmentSchema, stepFields } from './recruitment-schema';
import { TacticalIcon } from './marks';

type Values = {
  nick: string;
  age: string;
  discord: string;
  rank: string;
  availability: string;
  function: '' | 'Assault' | 'Sniper' | 'Suporte' | 'Entry fragger';
  gameplay: string;
  motivation: string;
  consent: boolean;
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
  consent: false,
};

const labels = ['Identificação', 'Perfil tático', 'Seu diferencial', 'Confirmar'];

export function Recruitment() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function update(key: keyof Values, value: string | boolean) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  }

  function next() {
    const result = recruitmentSchema.safeParse(values);
    const currentFields: readonly string[] = stepFields[step] ?? [];
    const nextErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        if (step === 3 || currentFields.includes(key)) nextErrors[key] = issue.message;
      });
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (step < 3) setStep((current) => current + 1);
    else setSuccess(true);
  }

  function field(
    key: keyof Omit<Values, 'consent'>,
    label: string,
    placeholder: string,
    type = 'text',
  ) {
    const maxLength = key === 'availability' ? 200 : key === 'gameplay' ? 500 : key === 'discord' ? 64 : 24;
    return (
      <label className="field" htmlFor={`recruit-${key}`}>
        <span>{label}</span>
        <input
          id={`recruit-${key}`}
          value={values[key]}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(event) => update(key, event.target.value)}
          aria-invalid={Boolean(errors[key])}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
        />
        {errors[key] && (
          <small id={`${key}-error`} className="form-error">
            {errors[key]}
          </small>
        )}
      </label>
    );
  }

  if (success) {
    return (
      <div className="recruit-success glass" role="status">
        <TacticalIcon kind="shield" />
        <span className="eyebrow text-primary">SIMULAÇÃO CONCLUÍDA</span>
        <h3>Perfil pronto, {values.nick}.</h3>
        <p>
          Este é um formulário de demonstração. Sua candidatura não foi enviada nem armazenada.
          O envio real ficará disponível quando um backend, como Supabase, for configurado.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setValues(initial);
            setStep(0);
            setSuccess(false);
          }}
        >
          Nova simulação <TacticalIcon kind="arrow" />
        </Button>
      </div>
    );
  }

  return (
    <form
      className="recruit-form glass"
      onSubmit={(event) => {
        event.preventDefault();
        next();
      }}
      noValidate
    >
      <div className="form-top">
        <span className="eyebrow">DOSSIÊ DE RECRUTAMENTO</span>
        <span className="demo-tag">MODO DEMONSTRAÇÃO</span>
      </div>

      <ol className="stepper">
        {labels.map((label, index) => (
          <li
            key={label}
            className={index === step ? 'current' : index < step ? 'complete' : ''}
            aria-current={index === step ? 'step' : undefined}
          >
            <span>0{index + 1}</span>
            <small>{label}</small>
          </li>
        ))}
      </ol>

      <div className="step-body" aria-live="polite">
        <h3>{labels[step]}</h3>

        {step === 0 && (
          <div className="field-grid">
            {field('nick', 'Nick no jogo', 'Seu codinome')}
            {field('age', 'Idade', 'Sua idade', 'number')}
            {field('discord', 'Usuário do Discord', 'ex.: reaper.wg')}
          </div>
        )}

        {step === 1 && (
          <div className="field-grid">
            <label className="field" htmlFor="recruit-rank">
              <span>Patente</span>
              <select
                id="recruit-rank"
                value={values.rank}
                onChange={(event) => update('rank', event.target.value)}
                aria-invalid={Boolean(errors.rank)}
              >
                <option value="">Selecione sua patente</option>
                {['Soldado', 'Cabo', 'Sargento', 'Tenente', 'Capitão', 'Major', 'Coronel', 'General'].map((rank) => (
                  <option key={rank}>{rank}</option>
                ))}
              </select>
              {errors.rank && <small className="form-error">{errors.rank}</small>}
            </label>

            <label className="field" htmlFor="recruit-function">
              <span>Função</span>
              <select
                id="recruit-function"
                value={values.function}
                onChange={(event) => update('function', event.target.value)}
                aria-invalid={Boolean(errors.function)}
              >
                <option value="">Selecione sua função</option>
                {['Assault', 'Sniper', 'Suporte', 'Entry fragger'].map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
              {errors.function && <small className="form-error">{errors.function}</small>}
            </label>

            {field('availability', 'Disponibilidade (horário de Brasília)', 'Ex.: seg. a sex., 20h–23h')}
          </div>
        )}

        {step === 2 && (
          <>
            {field('gameplay', 'Link de gameplay · opcional', 'https://youtube.com/...', 'url')}
            <label className="field" htmlFor="recruit-motivation">
              <span>Por que o WICKED GRIN?</span>
              <textarea
                id="recruit-motivation"
                value={values.motivation}
                onChange={(event) => update('motivation', event.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Mais que uma boa mira. O que você traz para o esquadrão?"
                aria-invalid={Boolean(errors.motivation)}
              />
              <small className={errors.motivation ? 'form-error' : 'text-muted-foreground'}>
                {errors.motivation || `${values.motivation.length}/1000`}
              </small>
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <dl className="review">
              <div><dt>OPERADOR</dt><dd>{values.nick} · {values.age} anos</dd></div>
              <div><dt>CONTATO</dt><dd>{values.discord}</dd></div>
              <div><dt>PERFIL</dt><dd>{values.rank} / {values.function}</dd></div>
              <div><dt>DISPONIBILIDADE</dt><dd>{values.availability}</dd></div>
              <div><dt>MOTIVAÇÃO</dt><dd>{values.motivation}</dd></div>
              {values.gameplay && <div><dt>GAMEPLAY</dt><dd>{values.gameplay}</dd></div>}
            </dl>
            <label className="consent">
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(event) => update('consent', event.target.checked)}
              />
              Li e aceito o código de conduta do clã.
            </label>
            {errors.consent && <p className="form-error">{errors.consent}</p>}
          </>
        )}
      </div>

      <div className="form-bottom">
        <Button
          variant="ghost"
          type="button"
          disabled={step === 0}
          onClick={() => {
            setStep((current) => Math.max(0, current - 1));
            setErrors({});
          }}
        >
          ← Voltar
        </Button>
        <span className="hud">0{step + 1} / 04</span>
        <Button type="submit" variant="danger" size="tactical">
          {step === 3 ? 'Concluir simulação' : 'Continuar'}
          <TacticalIcon kind="arrow" />
        </Button>
      </div>

      <p className="demo-note">Nenhum dado é enviado ou salvo nesta demonstração.</p>
    </form>
  );
}

import { useEffect, useRef } from 'react';

type OperatorSpotlightProps = {
  nick: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};

const MAX_TILT = 13;

/**
 * Card de operador com efeito 3D. O cartão inclina seguindo o ponteiro, as camadas
 * (fundo, personagem, placa do nick) ficam em profundidades diferentes e um reflexo
 * acompanha o mouse. Tudo é feito com variáveis CSS, sem re-render do React.
 */
export function OperatorSpotlight({ nick, image, imageWidth, imageHeight }: OperatorSpotlightProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let rx = 0;
    let ry = 0;
    let mx = 50;
    let my = 40;

    const paint = () => {
      frame = 0;
      card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${mx.toFixed(1)}%`);
      card.style.setProperty('--my', `${my.toFixed(1)}%`);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      // Em telas de toque o cartão balança sozinho (ver CSS); a inclinação por
      // ponteiro vale só para mouse e caneta.
      if (event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      ry = (px - 0.5) * 2 * MAX_TILT;
      rx = (0.5 - py) * 2 * MAX_TILT;
      mx = px * 100;
      my = py * 100;
      card.classList.add('is-active');
      schedule();
    };
    const onLeave = () => {
      rx = 0;
      ry = 0;
      mx = 50;
      my = 40;
      card.classList.remove('is-active');
      schedule();
    };

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stageRef} className="wg3-op-stage">
      <article ref={cardRef} className="wg3-op-card" aria-label={`Operador em destaque: ${nick}`}>
        <div className="wg3-op-plate" aria-hidden="true" />
        <div className="wg3-op-glare" aria-hidden="true" />
        <i className="hud-corner tl" /><i className="hud-corner tr" /><i className="hud-corner bl" /><i className="hud-corner br" />

        <span className="wg3-kicker wg3-op-tag">OPERADOR // WICKED GRIN</span>

        <div className="wg3-op-figure">
          <img
            src={image}
            alt={`Personagem de ${nick}`}
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        <footer className="wg3-op-nameplate">
          <span className="wg3-op-line" aria-hidden="true" />
          <h3>{nick}</h3>
        </footer>
      </article>
    </div>
  );
}

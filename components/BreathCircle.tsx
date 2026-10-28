'use client';
import { useEffect, useState, type CSSProperties } from 'react';

// Дыхательное упражнение в блоке «Начните с 20 минут»: 3 цикла «вдох — пауза — выдох».
// Круг расширяется на вдохе и сжимается на выдохе; в покое показывает «20 минут» пробного урока.
const PHASES = [
  { label: 'Вдох', ms: 4000, big: true },
  { label: 'Пауза', ms: 2000, big: true },
  { label: 'Выдох', ms: 6000, big: false },
];
const CYCLES = 3;
const TOTAL_SEC = (CYCLES * PHASES.reduce((s, p) => s + p.ms, 0)) / 1000;

export default function BreathCircle() {
  const [step, setStep] = useState<number | null>(null); // номер фазы от 0 до CYCLES*3-1
  const [left, setLeft] = useState(0);                     // секунд до конца фазы

  useEffect(() => {
    if (step === null) return;
    const phase = PHASES[step % PHASES.length];
    setLeft(Math.round(phase.ms / 1000));
    const tick = setInterval(() => setLeft((s) => Math.max(1, s - 1)), 1000);
    const next = setTimeout(() => setStep(step + 1 < CYCLES * PHASES.length ? step + 1 : null), phase.ms);
    return () => { clearInterval(tick); clearTimeout(next); };
  }, [step]);

  const running = step !== null;
  const phase = running ? PHASES[step % PHASES.length] : null;
  const cycle = running ? Math.floor(step / PHASES.length) + 1 : 0;

  return <div className="trial-art">
    <div className="trial-orbit orbit-one" aria-hidden="true" />
    <div className="trial-orbit orbit-two" aria-hidden="true" />
    <div className={`trial-center${phase?.big ? ' is-in' : ''}${running ? ' is-running' : ''}`} style={{ '--phase-ms': `${phase?.ms ?? 600}ms` } as CSSProperties} aria-hidden="true">
      {phase
        ? <><span className="breath-label">{phase.label}</span><small>{left}</small></>
        : <><span>20</span><small>МИНУТ</small></>}
      <span className="trial-spark">✳</span>
    </div>
    <button type="button" className="breath-btn" onClick={() => setStep(running ? null : 0)} aria-pressed={running}>
      {running ? `Остановить · цикл ${cycle} из ${CYCLES}` : `Подышать вместе · ${TOTAL_SEC} сек`}
    </button>
    <p className="sr-only" aria-live="polite">{phase ? `${phase.label}, ${phase.ms / 1000} секунды. Цикл ${cycle} из ${CYCLES}.` : ''}</p>
  </div>;
}

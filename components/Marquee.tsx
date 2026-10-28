'use client';
import { useState } from 'react';

// Бегущая строка. Движение дольше 5 секунд должно останавливаться по желанию пользователя (WCAG 2.2.2).
export default function Marquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  return <div className={`marquee${paused ? ' is-paused' : ''}`}>
    <div className="marquee-window" aria-hidden="true">
      <div className="marquee-track">{[...items, ...items].map((x, i) => <span key={i}>{x}</span>)}</div>
    </div>
    <button type="button" className="marquee-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Запустить бегущую строку' : 'Остановить бегущую строку'}>
      <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
    </button>
  </div>;
}

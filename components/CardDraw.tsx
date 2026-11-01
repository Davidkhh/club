'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PublicCard } from '@/lib/cards';

// Вытягивание метафорической карты. Анимация в духе Quizlet: карта — это две грани
// (рубашка и лицо) на общей оси, переворот через rotateY в 3D. Всё глушится при
// prefers-reduced-motion. Карты уже перемешаны на сервере случайным выбором индекса здесь.
export default function CardDraw({ cards }: { cards: PublicCard[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const reduce = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const pick = useCallback(() => {
    if (cards.length <= 1) return 0;
    let n = Math.floor(Math.random() * cards.length);
    if (n === index) n = (n + 1) % cards.length; // не ту же самую подряд
    return n;
  }, [cards.length, index]);

  const reveal = useCallback(() => {
    setIndex((cur) => (cur === null ? pick() : cur));
    setFlipped(true);
  }, [pick]);

  const next = useCallback(() => {
    setFlipped(false);
    const run = () => { setIndex(pick()); setFlipped(true); };
    if (reduce.current) run();
    else { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(run, 480); }
  }, [pick]);

  const onCardClick = () => (flipped ? next() : reveal());
  const card = index === null ? null : cards[index];

  return (
    <div className="mak-stage">
      <div className={`mak-card${flipped ? ' is-flipped' : ''}`} aria-hidden="true">
        <button type="button" className="mak-card-inner" onClick={onCardClick} tabIndex={-1}>
          <span className="mak-face mak-back">
            <span className="mak-back-mark">с.</span>
            <span className="mak-back-hint">Нажмите, чтобы вытянуть</span>
          </span>
          <span className="mak-face mak-front">
            {card && <img src={card.image} alt="" draggable={false} />}
          </span>
        </button>
      </div>

      <div className="mak-reveal" aria-live="polite">
        {flipped && card && (
          <div className="mak-reveal-in" key={card.id}>
            {card.title && <h2 className="mak-card-title">{card.title}</h2>}
            <p className="mak-card-meaning">{card.meaning}</p>
          </div>
        )}
      </div>

      <div className="mak-actions">
        {!flipped
          ? <button type="button" className="button button-primary" onClick={reveal}>Вытянуть карту <span aria-hidden="true">→</span></button>
          : <button type="button" className="button button-primary" onClick={next}>Вытянуть ещё одну <span aria-hidden="true">↻</span></button>}
      </div>
    </div>
  );
}

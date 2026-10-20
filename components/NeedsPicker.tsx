'use client';
import { useState } from 'react';
const needs = [
  { symbol: '↗', title: 'Тело просит внимания', text: 'Усталость, скованность, напряжение после долгого дня и желание двигаться свободнее.', picks: [['Йога для здоровья', 'https://clubschastya-yoga.ru/yoga_beginer'], ['Йогатерапия', 'https://clubschastya-yoga.ru/yoga_therapy']] },
  { symbol: '〰', title: 'Мысли не замолкают', text: 'Внешний шум остаётся с вами даже вечером, а найти внутреннюю тишину всё труднее.', picks: [['Цигун и дыхание', 'https://clubschastya-yoga.ru/tsigun'], ['Расслабление', 'https://clubschastya-yoga.ru/relax_yoga']] },
  { symbol: '✳', title: 'Не хватает поддержки', text: 'Хочется тёплого общения, бережного отношения к себе и пространства без оценок.', picks: [['Психологическое кафе', 'https://clubschastya-yoga.ru/cafe'], ['Клубные встречи', '#how']] },
];
export default function NeedsPicker() {
  const [sel, setSel] = useState<number | null>(null);
  return <>
    <div className="needs-grid">
      {needs.map((n, i) => <button key={n.title} type="button" className={`need-card need-btn${sel === i ? ' is-selected' : ''}`} aria-pressed={sel === i} onClick={() => setSel(sel === i ? null : i)}>
        <span className="need-symbol">{n.symbol}</span><h3>{n.title}</h3><p>{n.text}</p>
      </button>)}
    </div>
    <div className="need-result" aria-live="polite">
      {sel === null ? <p>Выберите, что вам сейчас ближе, и мы подскажем, с чего начать.</p> : <><p>Начните с этого:</p><div className="need-chips">{needs[sel].picks.map(([label, href]) => <a key={label} href={href}>{label} <span>↗</span></a>)}</div></>}
    </div>
  </>;
}

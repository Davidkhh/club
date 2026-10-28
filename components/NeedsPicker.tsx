'use client';
import { useState } from 'react';
import Link from 'next/link';

const needs = [
  { symbol: '↗', title: 'Тело просит внимания', text: 'Усталость, скованность, напряжение после долгого дня и желание двигаться свободнее.', picks: [['Йога для здоровья', '/practices/yoga'], ['Йогатерапия', '/practices/therapy']] },
  { symbol: '〰', title: 'Мысли не замолкают', text: 'Внешний шум остаётся с вами даже вечером, а найти внутреннюю тишину всё труднее.', picks: [['Цигун и дыхание', '/practices/qigong'], ['Расслабление', '/practices/relax']] },
  { symbol: '✳', title: 'Не хватает поддержки', text: 'Хочется тёплого общения, бережного отношения к себе и пространства без оценок.', picks: [['Психологическое кафе', '/practices/cafe'], ['Клубные встречи', '#how']] },
];

export default function NeedsPicker() {
  const [sel, setSel] = useState<number | null>(null);
  return <>
    <div className="needs-grid">
      {needs.map((n, i) => <button key={n.title} type="button" className={`need-card${sel === i ? ' is-selected' : ''}`} aria-pressed={sel === i} onClick={() => setSel(sel === i ? null : i)}>
        <span className="need-symbol" aria-hidden="true">{n.symbol}</span>
        <span className="need-title">{n.title}</span>
        <p>{n.text}</p>
      </button>)}
    </div>
    <div className="need-result" aria-live="polite">
      {sel === null
        ? <p>Выберите, что вам сейчас ближе, и мы подскажем, с чего начать.</p>
        : <><p>Начните с этого:</p><div className="need-chips">{needs[sel].picks.map(([label, href]) => <Link key={label} href={href}>{label} <span aria-hidden="true">{href.startsWith('#') ? '↓' : '→'}</span></Link>)}</div></>}
    </div>
  </>;
}

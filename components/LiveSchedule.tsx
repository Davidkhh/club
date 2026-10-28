'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { schedule } from '@/lib/content';

// dow — день недели (0 = воскресенье), h — час начала по Москве, d — длительность в минутах (по умолчанию 60)
const slots: Record<string, { dow: number; h: number; d?: number }> = { 'Йогатерапия': { dow: 1, h: 7 }, 'Полезные простукивания и массаж точек': { dow: 2, h: 18 }, 'Йога для начинающих': { dow: 3, h: 7 }, 'Цигун, дыхание, медитация': { dow: 4, h: 7 }, 'Психологическое кафе': { dow: 0, h: 16, d: 120 } };

function minutesUntil(now: number, s: { dow: number; h: number }) {
  const m = new Date(now + 3 * 3600e3); // Москва, UTC+3
  return ((s.dow - m.getUTCDay() + 7) % 7) * 1440 + s.h * 60 - (m.getUTCHours() * 60 + m.getUTCMinutes());
}

export default function LiveSchedule() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  let next: { title: string; mins: number; live: boolean } | null = null;
  if (now !== null) for (const [title, s] of Object.entries(slots)) {
    const dur = s.d ?? 60;
    let mins = minutesUntil(now, s); const live = mins <= 0 && mins > -dur;
    if (mins <= -dur) mins += 10080;
    if (!next || (live ? -1 : mins) < (next.live ? -1 : next.mins)) next = { title, mins, live };
  }
  const fmt = (mins: number) => { const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60; return d ? `${d} д ${h} ч` : h ? `${h} ч ${m} мин` : `${m} мин`; };
  const local = next && now !== null ? new Date(now + next.mins * 60000).toLocaleString('ru-RU', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : '';
  // Без aria-live: счётчик обновляется каждые 30 секунд, скринридер зачитывал бы его постоянно.
  return <>
    {/* стеклянная плашка над солнечным пятном */}
    <div className="next-live-wrap">
      <div className={`next-live glass${next?.live ? ' is-live' : ''}`}>{next
        ? (next.live
          ? <><span className="live-dot" aria-hidden="true" /><b>Сейчас идёт эфир:</b> {next.title}</>
          : <><b>Ближайший эфир через {fmt(next.mins)}:</b> {next.title}<small>{local} по вашему времени</small></>)
        : <b>Считаем время до эфира…</b>}</div>
    </div>
    <div className="schedule-list" id="schedule">{schedule.map((item) => {
      const isNext = next?.title === item.title;
      const isLive = isNext && next?.live;
      return <div key={item.title} className={`schedule-row${isNext ? ' is-next' : ''}${isLive ? ' is-live' : ''}`}>
        <span className="schedule-index">{isNext ? <><span className="live-dot" aria-hidden="true" /><span className="sr-only">{isLive ? 'Идёт сейчас' : 'Ближайший эфир'}</span></> : ''}</span>
        <span className="schedule-day">{item.day}<small>{slots[item.title] ? `${item.time} по Москве` : item.time}</small></span>
        <div className="schedule-title"><Link href={item.href}>{item.title} <span aria-hidden="true">→</span></Link><small>Ведёт: {item.teacher}</small></div>
        <Link className="schedule-open" href={item.href} aria-label={`Подробнее: ${item.title}`}><span aria-hidden="true">→</span></Link>
      </div>;
    })}</div>
  </>;
}

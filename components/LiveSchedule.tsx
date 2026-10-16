'use client';
import { useEffect, useState } from 'react';
import { schedule } from '@/lib/content';
const slots: Record<string, { dow: number; h: number }> = { 'Йогатерапия': { dow: 1, h: 7 }, 'Полезные простукивания и массаж точек': { dow: 2, h: 18 }, 'Йога для начинающих': { dow: 3, h: 7 }, 'Цигун, дыхание, медитация': { dow: 4, h: 7 } };
function minutesUntil(now: number, s: { dow: number; h: number }) {
  const m = new Date(now + 3 * 3600e3); // Москва, UTC+3
  return ((s.dow - m.getUTCDay() + 7) % 7) * 1440 + s.h * 60 - (m.getUTCHours() * 60 + m.getUTCMinutes());
}
export default function LiveSchedule() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  let next: { title: string; mins: number; live: boolean } | null = null;
  if (now !== null) for (const [title, s] of Object.entries(slots)) {
    let mins = minutesUntil(now, s); const live = mins <= 0 && mins > -60;
    if (mins <= -60) mins += 10080;
    if (!next || (live ? -1 : mins) < (next.live ? -1 : next.mins)) next = { title, mins, live };
  }
  const fmt = (mins: number) => { const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60; return d ? `${d} д ${h} ч` : h ? `${h} ч ${m} мин` : `${m} мин`; };
  const local = next && now !== null ? new Date(now + next.mins * 60000).toLocaleString('ru-RU', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : '';
  return <>
    <div className="next-live" aria-live="polite">{next ? (next.live ? <><b>Сейчас идёт эфир:</b> {next.title}</> : <><b>Ближайший эфир через {fmt(next.mins)}:</b> {next.title}<small>{local} по вашему времени</small></>) : <b>Считаем время до эфира…</b>}</div>
    <div className="schedule-list" id="schedule">{schedule.map(item => {
      const isNext = next?.title === item.title;
      return <div key={item.title} className={`schedule-row${isNext ? ' is-next' : ''}`}><span className="schedule-index">{isNext ? '●' : ''}</span><span className="schedule-day">{item.day}<small>{slots[item.title] ? `${item.time} по Москве` : item.time}</small></span><div className="schedule-title"><a href={item.href}>{item.title} <span>↗</span></a><small>Ведущий: {item.teacher}</small></div><a className="schedule-open" href={item.href} aria-label={`Подробнее: ${item.title}`}>↗</a></div>;
    })}</div>
  </>;
}

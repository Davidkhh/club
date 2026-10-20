'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { site } from '@/lib/content';
export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [open]);
  const links = [{ href: '/#about', label: 'О клубе' }, { href: '/#practices', label: 'Практики' }, { href: '/teachers', label: 'Преподаватели' }, { href: '/#schedule', label: 'Расписание' }, { href: '/#reviews', label: 'Отзывы' }, { href: '/#price', label: 'Участие' }];
  return <header className="header"><Link className="wordmark" href="/" aria-label="Клуб Счастья — на главную"><span className="wordmark-mark">с.</span><span>КЛУБ<br/>СЧАСТЬЯ</span></Link><button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>{open ? 'Закрыть' : 'Меню'} <span>{open ? '−' : '+'}</span></button><nav id="main-nav" className={open ? 'nav nav-open' : 'nav'} aria-label="Основная навигация">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<a className="nav-cta" href={site.joinUrl}>Войти в клуб <span>↗</span></a></nav></header>;
}

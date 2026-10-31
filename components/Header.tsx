'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { site } from '@/lib/content';

const links = [{ href: '/#about', label: 'О клубе' }, { href: '/#practices', label: 'Практики' }, { href: '/teachers', label: 'Преподаватели' }, { href: '/#schedule', label: 'Расписание' }, { href: '/#reviews', label: 'Отзывы' }, { href: '/#price', label: 'Участие' }];

// Шапка держит постоянную высоту; при прокрутке внутренняя плашка превращается в парящую стеклянную капсулу.
// Стекло капсулы — на подложке ::before, а не на самой плашке: иначе выпадающее меню (тоже стекло)
// не смогло бы размывать страницу — браузер не размывает фон «стекла внутри стекла».

// Волна-рябь от точки нажатия — тактильная отдача в стиле «жидкого стекла».
function ripple(e: React.PointerEvent<HTMLElement>) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const d = Math.max(r.width, r.height);
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.width = s.style.height = `${d}px`;
  s.style.left = `${e.clientX - r.left - d / 2}px`;
  s.style.top = `${e.clientY - r.top - d / 2}px`;
  el.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
    <div className="header-bar">
      <Link className="wordmark" href="/" aria-label="Клуб Счастья — на главную" onPointerDown={ripple}><span className="wordmark-mark" aria-hidden="true">с.</span><span aria-hidden="true">КЛУБ<br />СЧАСТЬЯ</span></Link>
      <button className="menu-toggle" type="button" onPointerDown={ripple} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-nav">{open ? 'Закрыть' : 'Меню'} <span aria-hidden="true">{open ? '−' : '+'}</span></button>
      <nav id="main-nav" className={open ? 'nav nav-open' : 'nav'} aria-label="Основная навигация">
        {links.map((link) => <Link key={link.href} href={link.href} onPointerDown={ripple} onClick={() => setOpen(false)}>{link.label}</Link>)}
        <Link className="nav-cta" href={site.joinUrl} onPointerDown={ripple} onClick={() => setOpen(false)}>Вступить в клуб <span aria-hidden="true">→</span></Link>
      </nav>
    </div>
  </header>;
}

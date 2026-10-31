'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// Плавное появление при прокрутке. Сервер отдаёт контент видимым: если JS не загрузится,
// ничего не пропадёт. Прячется только блок ниже экрана — пока пользователь до него не долистал.
// stagger: вместо всего блока по очереди проявляются вложенные элементы с классом .stagger-item.
export default function Reveal({ children, className = '', stagger = false }: { children: ReactNode; className?: string; stagger?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setHidden(true);
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setHidden(false); observer.disconnect(); } }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const cls = `reveal${stagger ? ' reveal-stagger' : ''}${hidden ? ' is-hidden' : ''}${className ? ` ${className}` : ''}`;
  return <div ref={ref} className={cls}>{children}</div>;
}

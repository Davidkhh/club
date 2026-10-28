'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// Плавное появление при прокрутке. Сервер отдаёт контент видимым: если JS не загрузится,
// ничего не пропадёт. Прячется только блок ниже экрана — пока пользователь до него не долистал.
export default function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
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
  return <div ref={ref} className={`reveal${hidden ? ' is-hidden' : ''}${className ? ` ${className}` : ''}`}>{children}</div>;
}

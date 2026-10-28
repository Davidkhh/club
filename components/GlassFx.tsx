'use client';
import { useEffect } from 'react';

// 1) Помечает Chromium-браузеры классом .lg-refract: только они умеют преломление через SVG-фильтр.
// 2) Блик на стеклянных панелях следует за курсором (--mx/--my). Только для мыши, не для касаний.
export default function GlassFx() {
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua)) document.documentElement.classList.add('lg-refract');

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const update = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const el = (e.target as Element | null)?.closest?.('.glass') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => { last = e; if (!frame) frame = requestAnimationFrame(update); };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => { document.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame); };
  }, []);
  return null;
}

'use client';
import { useState } from 'react';
import { faqs } from '@/lib/content';
export default function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return <div className="faq-list">{faqs.map((item, i) => <article className={`faq-item ${active === i ? 'faq-active' : ''}`} key={item.q}><button className="faq-question" aria-expanded={active === i} onClick={() => setActive(active === i ? null : i)}><span>{item.q}</span><span className="faq-icon">{active === i ? '−' : '+'}</span></button>{active === i && <div className="faq-answer"><p>{item.a}</p></div>}</article>)}</div>;
}

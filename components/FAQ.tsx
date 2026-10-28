'use client';
import { useState } from 'react';
import { faqs } from '@/lib/content';

export default function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return <div className="faq-list">{faqs.map((item, i) => {
    const open = active === i;
    return <div className="faq-item" key={item.q}>
      <h3><button type="button" className="faq-question" id={`faq-q-${i}`} aria-expanded={open} aria-controls={`faq-a-${i}`} onClick={() => setActive(open ? null : i)}>
        <span>{item.q}</span><span className="faq-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button></h3>
      <div className="faq-answer" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!open}><p>{item.a}</p></div>
    </div>;
  })}</div>;
}

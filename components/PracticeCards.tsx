import { type CSSProperties } from 'react';
import { Link } from 'next-view-transitions';
import { practiceInfo, type PracticeInfo } from '@/lib/practice-info';
import Reveal from './Reveal';

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  const inner = <>{children} <span aria-hidden="true">{href.startsWith("/") ? "→" : "↗"}</span></>;
  return href.startsWith('/') ? <Link className="pr-link" href={href}>{inner}</Link> : <a className="pr-link" href={href}>{inner}</a>;
}

function Meta({ p }: { p: PracticeInfo }) {
  if (p.lead) {
    const [name, ...rest] = p.lead.split(', ');
    return <p className="pr-meta"><span>Ведёт {p.leadHref ? <Link href={p.leadHref}>{name}</Link> : name}</span>{rest.length > 0 && <small>{rest.join(', ')}</small>}</p>;
  }
  return <p className="pr-meta">{p.when && <small>{p.when}</small>}</p>;
}

export default function PracticeCards() {
  const practices = practiceInfo.filter((p) => p.id !== 'seminars' && p.inCatalog !== false);
  const seminars = practiceInfo.find((p) => p.id === 'seminars');
  return <Reveal stagger>
    <ul className="pr-grid">{practices.map((p, i) => <li key={p.id} className="pr-card stagger-item" style={{ '--i': i } as CSSProperties}>
      <h3 style={{ viewTransitionName: `pt-${p.id}` }}>{p.title}</h3>
      <p className="pr-text">{p.summary}</p>
      <Meta p={p} />
      <MoreLink href={p.href}>Подробнее о практике</MoreLink>
    </li>)}</ul>
    {seminars && <div className="pr-sem stagger-item" style={{ '--i': practices.length } as CSSProperties}>
      <h3>Полезные семинары</h3>
      <p>Встречи о здоровье, питании, эмоциях и долголетии.</p>
      <MoreLink href={seminars.href}>Подробнее о семинарах</MoreLink>
    </div>}
  </Reveal>;
}

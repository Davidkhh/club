import Link from 'next/link';
import { practiceInfo, type PracticeInfo } from '@/lib/practice-info';

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  const inner = <>{children} <span aria-hidden="true">→</span></>;
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
  const practices = practiceInfo.filter((p) => p.id !== 'seminars');
  const seminars = practiceInfo.find((p) => p.id === 'seminars');
  return <>
    <ul className="pr-grid">{practices.map((p) => <li key={p.id} className="pr-card">
      <h3>{p.title}</h3>
      <p className="pr-text">{p.summary}</p>
      <Meta p={p} />
      <MoreLink href={p.href}>Подробнее о практике</MoreLink>
    </li>)}</ul>
    {seminars && <div className="pr-sem">
      <h3>Полезные семинары</h3>
      <p>Встречи о здоровье, питании, эмоциях и долголетии.</p>
      <MoreLink href={seminars.href}>Подробнее о семинарах</MoreLink>
    </div>}
  </>;
}

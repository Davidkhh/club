import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { site } from '@/lib/content';
import { practiceById, practiceInfo } from '@/lib/practice-info';
import { teachers } from '@/lib/teachers';
import Portrait from '@/components/Portrait';
import { programs } from '@/lib/programs';

// Страница каждой практики на новом сайте. У простукиваний отдельная страница /useful-hit.
const pages = practiceInfo.filter((p) => p.href === `/practices/${p.id}`);

export const dynamicParams = false;
export function generateStaticParams() { return pages.map((p) => ({ id: p.id })); }

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = practiceById((await params).id);
  if (!p) return {};
  return { title: `${p.title} — Клуб Счастья`, description: p.summary, alternates: { canonical: p.href } };
}

export default async function PracticePage({ params }: Props) {
  const p = practiceById((await params).id);
  if (!p || p.href !== `/practices/${p.id}`) notFound();

  // «Юлия, среда 07:00–08:00 по Москве» → ведущая и время
  const [leadName, ...leadRest] = p.lead?.split(', ') ?? [];
  const when = leadRest.join(', ') || p.when;
  const leadHref = p.leadHref ?? (leadName ? `/teachers#${teachers.find((t) => t.name === leadName)?.id ?? ''}` : undefined);

  const details = [
    { label: p.onLessonLabel ?? 'Как проходит занятие', text: p.onLesson },
    { label: p.forWhomLabel ?? 'Кому подойдёт', text: p.forWhom },
    { label: p.benefitLabel ?? 'Чем полезна практика', text: p.benefit },
  ];
  const prog = programs[p.id];
  const leadTeacher = teachers.find((t) => t.name === leadName);
  const others = practiceInfo.filter((x) => x.id !== p.id && x.inCatalog !== false && x.id !== 'seminars').slice(0, 3);

  return <>
    <Header />
    <main id="content" tabIndex={-1}>
      <section className="pp-hero section-shell">
        <div className="pp-hero-copy">
          <nav aria-label="Навигация по сайту" className="pp-crumbs"><Link href="/">Главная</Link><span aria-hidden="true">/</span><Link href="/#practices">Практики</Link></nav>
          <h1 style={{ viewTransitionName: `pt-${p.id}` }}>{p.title}</h1>
          <p className="pp-summary">{p.summary}</p>
          <div className="pp-actions">
            <Link className="button button-primary" href={site.trialUrl}>Получить пробный урок <span aria-hidden="true">→</span></Link>
            {prog?.steps
              ? <a className="text-link" href="#lesson">Как проходит занятие <span aria-hidden="true">↓</span></a>
              : <Link className="text-link" href={site.joinUrl}>Вступить в клуб</Link>}
          </div>
        </div>
        {(leadName || when || p.format) && <div className="pp-card-wrap"><dl className="pp-card glass">
          {leadName && <div><dt>Ведёт</dt><dd>{leadHref ? <Link href={leadHref}>{leadName}</Link> : leadName}</dd></div>}
          {when && <div><dt>Когда</dt><dd>{when}</dd></div>}
          {p.format && <div><dt>Формат</dt><dd><ul>{p.format.map((f) => <li key={f}>{f}</li>)}</ul></dd></div>}
        </dl></div>}
      </section>

      {prog ? <>
        <section className="uh-split section-shell" id="about">
          <h2>Что это <em>за практика?</em></h2>
          <div>{prog.about.map((t) => <p key={t}>{t}</p>)}</div>
        </section>

        {prog.steps && <section className="uh-lesson section-shell" id="lesson">
          <h2>Как проходит <em>занятие?</em></h2>
          <p className="uh-note">{prog.stepsNote ? `${prog.stepsNote} ` : ''}Структура из описания программы, состав конкретного занятия может отличаться.</p>
          <ol>{prog.steps.map((st) => <li key={st.title}><h3>{st.title}</h3>{st.text && <p>{st.text}</p>}</li>)}</ol>
        </section>}

        {prog.result && <section className="uh-split section-shell">
          <h2>Что даёт <em>практика</em></h2>
          <div>{prog.result.map((t) => <p key={t}>{t}</p>)}</div>
        </section>}

        <section className="uh-split section-shell">
          <h2>Кому <em>подойдёт</em></h2>
          <div>
            <ul className="uh-parts">{prog.forWhom.map((x) => <li key={x}>{x}</li>)}</ul>
            {prog.notFor && <p className="pp-notfor">{prog.notFor}</p>}
          </div>
        </section>

        {prog.teacher && <section className="uh-olga section-shell" aria-labelledby="teacher-h">
          <Portrait name={prog.teacher.name} src={leadTeacher?.photo} alt={leadTeacher?.photoAlt} />
          <div>
            <p className="eyebrow">{prog.teacher.title}</p>
            <h2 id="teacher-h">{prog.teacher.name}</h2>
            <ul className="uh-parts">{prog.teacher.facts.map((f) => <li key={f}>{f}</li>)}</ul>
            {prog.teacher.quotes && <div className="pp-quotes">{prog.teacher.quotes.map((x) => <figure key={x.q}>
              <figcaption>{x.q}</figcaption>
              <blockquote>{x.a}</blockquote>
            </figure>)}</div>}
            {leadHref && <Link className="text-link" href={leadHref}>Все занятия: {prog.teacher.name}</Link>}
          </div>
        </section>}

        {prog.limits && <section className="uh-limits section-shell panel" aria-labelledby="limits-h">
          <h2 id="limits-h">Важные <em>ограничения</em></h2>
          {prog.limits.lead && <p>{prog.limits.lead}</p>}
          {prog.limits.items && <ul>{prog.limits.items.map((x) => <li key={x}>{x}</li>)}</ul>}
          {prog.limits.text && <p>{prog.limits.text}</p>}
        </section>}
      </> : <>
      <section className="pp-details section-shell" aria-label="Подробнее о практике">
        {details.map((d, i) => <div className="pp-row" key={d.label}>
          <h2>{d.label}</h2>
          <div>
            <p>{d.text}</p>
            {i === details.length - 1 && p.note && <p className="pp-note" role="note">{p.note}</p>}
          </div>
        </div>)}
      </section>
      </>}

      {others.length > 0 && <section className="pp-more section-shell" aria-labelledby="more-h">
        <h2 id="more-h">Другие практики клуба</h2>
        <ul>{others.map((x) => <li key={x.id}>
          <Link href={x.href}>
            <h3 style={{ viewTransitionName: `pt-${x.id}` }}>{x.title}</h3>
            <p>{x.summary}</p>
            <span className="pp-more-go">Подробнее <span aria-hidden="true">→</span></span>
          </Link>
        </li>)}</ul>
      </section>}

      <section className="page-cta section-shell panel">
        <h2>Попробуйте бесплатно</h2>
        <p>Пробный урок длится 20 минут: вы познакомитесь с ведущими и форматом клуба.</p>
        <Link className="button button-primary" href={site.trialUrl}>Получить пробный урок <span aria-hidden="true">→</span></Link>
        <p className="page-cta-back"><Link className="text-link" href="/#practices">Все практики клуба</Link></p>
      </section>
    </main>
    <Footer />
  </>;
}

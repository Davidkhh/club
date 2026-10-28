import type { Metadata } from 'next';
import Link from 'next/link';
import Portrait from '@/components/Portrait';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { site } from '@/lib/content';
import { getPublicTeachers } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Преподаватели — Клуб Счастья',
  description: 'Ведущие онлайн-клуба «Клуб Счастья»: кто проводит занятия по йоге, цигун, йогатерапии и другим практикам и когда проходят эфиры.',
  alternates: { canonical: '/teachers' },
};

const principles = ['Без спешки', 'Без соревнований', 'Без необходимости соответствовать'];

export const dynamic = 'force-dynamic';

export default async function TeachersPage() {
  const teachers = await getPublicTeachers();
  return <>
    <Header />
    <main id="content" tabIndex={-1}>
      <section className="page-hero section-shell">
        <p className="eyebrow">Преподаватели клуба</p>
        <h1>Люди, которые помогают <em>вернуться к себе.</em></h1>
        <p className="page-lead">Ведущие сопровождают занятия клуба: йогу, цигун, йогатерапию и другие практики. Выберите направление и познакомьтесь с тем, кто его проводит.</p>
      </section>
      <section className="section-shell" aria-label="Ведущие клуба">
        {teachers.map((t, i) => <article key={t.id} id={t.id} className={`teacher${i % 2 ? ' teacher-reverse' : ''}`}>
          <Portrait name={t.name} src={t.photo} alt={t.photoAlt} eager={i === 0} />
          <div className="teacher-body">
            <p className="eyebrow">Преподаватель клуба</p>
            <h2>{t.name}</h2>
            {t.role && <p className="teacher-role">{t.role}</p>}
            {t.shortBio && <p className="teacher-short">{t.shortBio}</p>}
            {t.bio && t.bio.split(/\n{2,}/).map((para, k) => <p key={k} className="teacher-bio">{para}</p>)}
            {t.facts && <ul className="teacher-facts">{t.facts.map((f) => <li key={f}>{f}</li>)}</ul>}
            <ul className="teacher-sessions">{t.sessions.map((s) => <li key={s.title}>
              <Link href={s.href}>{s.title} <span aria-hidden="true">→</span></Link>
              {s.description && <p>{s.description}</p>}
              <small>{s.when}</small>
            </li>)}</ul>
          </div>
        </article>)}
      </section>
      <section className="principles section-shell">
        <p className="eyebrow">Подход клуба</p>
        <h2>Практика в вашем <em>ритме.</em></h2>
        <ul>{principles.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
      <section className="page-cta section-shell panel">
        <h2>Начните с практики, которая подходит <em>именно вам.</em></h2>
        <p>Бесплатный пробный урок знакомит с четырьмя ведущими и разными стилями практик.</p>
        <Link className="button button-primary" href={site.trialUrl}>Получить пробный урок <span aria-hidden="true">→</span></Link>
      </section>
    </main>
    <Footer />
  </>;
}

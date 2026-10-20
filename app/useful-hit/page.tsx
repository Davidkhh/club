import type { Metadata } from 'next';
import Link from 'next/link';
import Portrait from '@/components/Portrait';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Страница программы на платформе клуба (GetCourse). Кнопка присоединения на ней — единственный подтверждённый путь к участию.
const JOIN_URL = 'https://clubschastya-yoga.ru/useful_hit';

export const metadata: Metadata = {
  title: 'Полезные простукивания и массаж точек — Клуб Счастья',
  description: 'Программа клуба: простукивания, массаж точек, мягкая разминка и расслабление с пояснениями преподавателя Ольги. Как проходит занятие и какие есть ограничения.',
  alternates: { canonical: '/useful-hit' },
};

const steps = [
  ['Мягкая разминка', 'Лёгкие движения и упражнения для суставов, чтобы подготовить тело.'],
  ['Простукивания', 'Комплексы простукиваний, которые преподаватель объясняет по ходу занятия.'],
  ['Массаж точек', 'Массаж акупунктурных точек с пояснением, что и как вы делаете.'],
  ['Сопутствующие практики', 'Асаны и дыхание, если они предусмотрены конкретным занятием.'],
  ['Расслабление', 'Завершающий отдых, чтобы спокойно закончить практику.'],
];
const parts = ['Комплексы простукиваний', 'Массаж акупунктурных точек', 'Объяснения преподавателя о последовательности', 'Мягкие движения и упражнения для суставов', 'Сопутствующие асаны и дыхание', 'Релаксация'];
const limits = ['температура тела выше 38 °C', 'обострение хронических заболеваний', 'острая боль', 'систолическое давление выше 180 мм рт. ст.'];

export default function UsefulHitPage() {
  return <main id="top"><Header />
    <section className="uh-hero section-shell">
      <p className="eyebrow">Практика для себя</p>
      <h1>Полезные простукивания <em>и массаж точек</em></h1>
      <p className="uh-lead">Вы знакомитесь с последовательностями простукиваний, массажем точек, мягкими движениями и расслаблением, которые можно повторять самостоятельно.</p>
      <div className="uh-actions">
        <a className="button button-dark" href={JOIN_URL}>Присоединиться к программе <span aria-hidden="true">↗</span></a>
        <a className="text-link" href="#lesson">Как проходит занятие</a>
      </div>
      <span className="uh-sun" aria-hidden="true" />
    </section>

    <section className="uh-split section-shell" id="about">
      <h2>Что это <em>за практика?</em></h2>
      <div><p>Занятие сочетает простукивание определённых участков тела, массаж точек, мягкую разминку и дополнительные практики из программы. Преподаватель объясняет, что и зачем вы делаете, поэтому подойдёт и тем, кто раньше не занимался ничем подобным.</p>
      <p>Это практика заботы о себе, а не медицинская процедура.</p></div>
    </section>

    <section className="uh-lesson section-shell" id="lesson">
      <h2>Как проходит <em>занятие?</em></h2>
      <p className="uh-note">Общая структура из описания программы. Состав конкретного занятия может отличаться.</p>
      <ol>{steps.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}</ol>
    </section>

    <section className="uh-split section-shell">
      <h2>Что входит <em>в программу</em></h2>
      <ul className="uh-parts">{parts.map((x) => <li key={x}>{x}</li>)}</ul>
    </section>

    <section className="uh-split section-shell">
      <h2>Кому <em>подойдёт</em></h2>
      <div><p>Тем, кто хочет освоить спокойную последовательность действий для самостоятельной практики, уделить время себе и познакомиться с простыми телесными техниками.</p>
      <p>Если у вас есть заболевания, острые симптомы или сомнения в безопасности массажа определённых точек, заранее проконсультируйтесь с врачом.</p></div>
    </section>

    <section className="uh-olga section-shell" aria-labelledby="olga-h">
      <Portrait name="Ольга" src="/assets/olga.jpg" alt="Ольга — преподаватель Клуба Счастья" />
      <div>
        <p className="eyebrow">Ведущая программы</p>
        <h2 id="olga-h">Ольга</h2>
        <ul className="uh-parts">
          <li>Практикует и преподаёт йогу с 2000 года, опыт более 25 лет</li>
          <li>Преподаватель полного обучающего курса для инструкторов йоги</li>
          <li>Более 15 лет проводит индивидуальные занятия и консультации с женщинами</li>
          <li>Участвует в программе «Йога 50+»</li>
        </ul>
        <Link className="text-link" href="/teachers#olga">Все занятия Ольги</Link>
      </div>
    </section>

    <section className="uh-limits section-shell" aria-labelledby="limits-h">
      <h2 id="limits-h">Важные <em>ограничения</em></h2>
      <p>Массаж акупунктурных точек не стоит выполнять при:</p>
      <ul>{limits.map((x) => <li key={x}>{x}</li>)}</ul>
      <p>Клуб советует соблюдать время практики и силу воздействия. Список взят из описания программы и не исчерпывающий. Страница не заменяет консультацию врача: при сомнениях сначала обратитесь к специалисту.</p>
    </section>

    <section className="teacher-cta section-shell">
      <h2>Начните знакомство <em>с практикой</em></h2>
      <p>В программе вы познакомитесь с последовательностями простукиваний, массажем точек и сопутствующими практиками.</p>
      <a className="button button-dark" href={JOIN_URL}>Присоединиться к программе <span aria-hidden="true">↗</span></a>
      <p className="uh-back"><Link className="text-link" href="/#practices">Вернуться к практикам клуба</Link></p>
    </section>
    <Footer />
  </main>;
}

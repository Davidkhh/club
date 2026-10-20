import Link from 'next/link';
import Portrait from '@/components/Portrait';
import { getPublicTeachers } from '@/lib/cms';
import HeroArch from '@/components/HeroArch';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import FAQ from '@/components/FAQ';
import PracticeCards from '@/components/PracticeCards';
import NeedsPicker from '@/components/NeedsPicker';
import LiveSchedule from '@/components/LiveSchedule';
import { faqs, site, testimonials } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const teachers = await getPublicTeachers();
  return <main id="top"><Header />
    <section className="hero section-shell"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot"/> Онлайн-клуб, практики для жизни</p><h1>Время для счастья — <em>сейчас.</em></h1><p className="hero-sub">Место для счастья — здесь.</p><p className="hero-description">Йога, цигун, медитации и бережные практики, которые помогают уделить время себе — в любом возрасте и в любом теле.</p><div className="hero-actions"><a className="button button-dark" href={site.trialUrl}>Попробовать клуб <span>↗</span></a><a className="text-link" href="#practices">Исследовать практики <span>↓</span></a></div><div className="hero-note"><span className="note-line"/><span>Тело · внимание · внутреннее равновесие</span></div></div><div className="hero-visual"><HeroArch /></div><div className="hero-bottom"><span>ПРОСТРАНСТВО ДЛЯ ЗАБОТЫ О СЕБЕ</span><span>ПРОКРУТИТЕ, ЧТОБЫ УЗНАТЬ БОЛЬШЕ ↓</span></div></section>

    <section className="intro section-shell" id="about"><Reveal><p className="eyebrow">Философия клуба</p><div className="intro-grid"><h2>Счастье у каждого <em>своё.</em></h2><div className="intro-text"><p className="intro-lead">Но каждому нужно место, где можно остановиться и услышать себя.</p><p>Клуб Счастья — это не только занятия йогой. Это пространство для контакта с собой, спокойного движения и регулярной заботы о теле и сознании.</p><a className="text-link" href="#how">Как устроен клуб <span>↘</span></a></div></div></Reveal><div className="marquee" aria-hidden="true"><div className="marquee-track"><span>Без спешки</span><span>Без соревнований</span><span>Без необходимости соответствовать</span><span>Без спешки</span><span>Без соревнований</span><span>Без необходимости соответствовать</span></div></div></section>

    <section className="needs section-shell"><Reveal><div className="section-heading"><p className="eyebrow">Ваше состояние</p><h2>Когда напряжения<br/>становится <em>слишком много.</em></h2><p className="heading-aside">После 40 лет особенно важно не забывать о теле. Но забота о себе не имеет возраста.</p></div></Reveal><NeedsPicker /></section>

    <section className="practices section-shell" id="practices"><div className="pr-head"><div><p className="eyebrow">Что внутри</p><h2>Найдите свою <em>практику.</em></h2></div><p className="pr-aside">Здесь собраны практики клуба. Выберите ту, что откликается, и откройте её страницу, чтобы узнать подробности.</p></div><PracticeCards /></section>

    <section className="ts section-shell" id="teachers"><p className="eyebrow">Преподаватели</p><h2>Практики ведут <em>живые люди.</em></h2><ul className="ts-grid">{teachers.map((t) => <li key={t.id}><Link href={`/teachers#${t.id}`}><Portrait name={t.name} src={t.photo} alt={t.photoAlt} /><strong>{t.name}</strong><span>{t.sessions[0]?.title}</span></Link></li>)}</ul><Link className="text-link ts-all" href="/teachers">Познакомиться с преподавателями</Link></section>
    <section className="trial section-shell"><div className="trial-art"><div className="trial-orbit orbit-one"/><div className="trial-orbit orbit-two"/><div className="trial-center"><span>20</span><small>МИНУТ</small><span className="trial-spark">✳</span></div><span className="trial-art-note">ПОЗНАКОМЬТЕСЬ С КЛУБОМ</span></div><div className="trial-copy"><p className="eyebrow">Первое знакомство</p><h2>Начните с <em>20 минут.</em></h2><p>Бесплатный пробный урок: короткое знакомство с четырьмя ведущими, разными стилями и практиками, которые можно попробовать в своём ритме.</p><p className="small-note">Регистрация и получение урока проходят через действующую платформу клуба.</p><a className="button button-dark" href={site.trialUrl}>Получить пробный урок <span>↗</span></a></div></section>

    <section className="program section-shell"><Reveal><div className="section-heading section-heading-row"><div><p className="eyebrow">Ритм недели</p><h2>Практика в вашем<br/><em>расписании.</em></h2></div><p className="heading-aside">Прямые эфиры в удобное время, записи доступны в течение недели.</p></div></Reveal><LiveSchedule /></section>

    <section className="club-life section-shell" id="how"><div className="club-life-title"><p className="eyebrow">Как устроено участие</p><h2>Не просто занятия.<br/><em>Система поддержки.</em></h2></div><div className="life-steps"><article><span>01</span><div><h3>Выбираете тариф</h3><p>На сайте указана подписка с автоматическим продлением. Условия нужно проверить перед оплатой.</p></div></article><article><span>02</span><div><h3>Получаете доступ</h3><p>Личный кабинет клуба работает на платформе GetCourse.</p></div></article><article><span>03</span><div><h3>Занимаетесь в своём ритме</h3><p>Прямые эфиры, записи занятий и практики для самостоятельной работы.</p></div></article><article><span>04</span><div><h3>Остаётесь частью сообщества</h3><p>Клубные встречи, общение с ведущими и участниками, рассылка с анонсами.</p></div></article></div></section>

    <section className="testimonials section-shell" id="reviews"><Reveal><div className="section-heading section-heading-row"><div><p className="eyebrow">Слова участников</p><h2>Истории о том,<br/><em>что меняется внутри.</em></h2></div><p className="heading-aside">Что говорят участники клуба.</p></div></Reveal><div className="testimonial-grid">{testimonials.map((t, i) => <Reveal key={t.name+i} className="testimonial-card"><span className="quote-mark">“</span><blockquote>{t.quote}</blockquote><div className="testimonial-person"><span className="person-dot">{t.name.slice(0,1)}</span><span><strong>{t.name}, {t.age}</strong><small>{t.city}</small></span></div></Reveal>)}</div></section>

    <section className="price section-shell" id="price"><div className="price-heading"><p className="eyebrow">Участие в клубе</p><h2>Выберите место<br/>для <em>себя.</em></h2><p>Подписка на месяц с автопродлением. Перед оплатой проверьте актуальные условия на странице клуба.</p></div><div className="price-card"><div className="price-card-top"><span>ОСНОВНОЙ ТАРИФ</span><span className="price-dot">✳</span></div><p className="price-value">3 300 <small>₽ / месяц</small></p><p className="price-secondary">2 990 ₽ со второго месяца при подключении автопродления.</p><div className="price-rule"/><ul><li>Доступ к онлайн-занятиям и записям</li><li>Скидки на участие в семинарах</li><li>Скидки на «Психологическое кафе»</li></ul><a className="button button-light" href={site.joinUrl}>Вступить в клуб <span>↗</span></a></div></section>

    <section className="faq-section section-shell"><Reveal><div className="faq-heading"><p className="eyebrow">Вопросы перед стартом</p><h2>Можно просто<br/><em>начать?</em></h2><p>Коротко о формате клуба, доступе и первых шагах.</p></div></Reveal><FAQ /></section>

    <section className="final-cta section-shell"><div className="final-cta-top"><p className="eyebrow">Ваше время — сейчас</p><span className="final-star">✳</span></div><h2>Пусть забота о себе<br/>станет частью <em>жизни.</em></h2><p>Познакомьтесь с практиками и выберите тот путь, который подходит вам.</p><a className="button button-dark" href={site.joinUrl}>Присоединиться к клубу <span>↗</span></a></section>

    <Footer />
  </main>;
}

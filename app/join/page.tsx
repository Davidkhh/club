import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscribeForm from '@/components/SubscribeForm';
import { site } from '@/lib/content';

// Одна страница — два сценария:
//   /join            — пробный урок на e-mail;
//   /join?for=club   — заявка на вступление в клуб (оплата пока не подключена к новому сайту).
type Props = { searchParams: Promise<{ for?: string }> };

const copy = {
  trial: {
    title: 'Пробный урок бесплатно — Клуб Счастья',
    description: 'Оставьте e-mail и получите пробный урок Клуба Счастья: познакомьтесь с ведущими и атмосферой клуба за 20 минут.',
    eyebrow: 'Ваши 20 минут в подарок',
    h1: <>Познакомьтесь с клубом <em>за 20 минут</em></>,
    lead: 'Оставьте e-mail и получите пробный урок бесплатно. Попробуйте практики, познакомьтесь с преподавателями и почувствуйте атмосферу клуба.',
    note: '4 ведущих, 4 разных стиля и один общий путь — к жизни, в которой больше радости, энергии и внутренней опоры.',
  },
  club: {
    title: 'Вступить в клуб — Клуб Счастья',
    description: 'Заявка на участие в Клубе Счастья: онлайн-занятия, записи, скидки на семинары и «Психологическое кафе».',
    eyebrow: 'Участие в клубе',
    h1: <>Вступить <em>в клуб</em></>,
    lead: 'Оставьте e-mail — мы свяжемся с вами и расскажем, как оформить участие.',
    note: 'Основной тариф — 3 300 ₽ в месяц, 2 990 ₽ со второго месяца при подключении автопродления. Перед оплатой условия подтверждаются.',
  },
};

const pick = async (sp: Props['searchParams']) => ((await sp).for === 'club' ? 'club' : 'trial') as keyof typeof copy;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const c = copy[await pick(searchParams)];
  return { title: c.title, description: c.description, alternates: { canonical: '/join' } };
}

export default async function JoinPage({ searchParams }: Props) {
  const intent = await pick(searchParams);
  const c = copy[intent];
  return <>
    <Header />
    <main id="content" tabIndex={-1}>
      <section className="join section-shell">
        <div className="join-copy">
          <p className="eyebrow">{c.eyebrow}</p>
          <h1>{c.h1}</h1>
          <p className="join-lead">{c.lead}</p>
          <p className="join-note">{c.note}</p>
          <p className="join-switch">{intent === 'club'
            ? <Link className="text-link" href={site.trialUrl}>Сначала попробовать бесплатно <span aria-hidden="true">→</span></Link>
            : <Link className="text-link" href={site.joinUrl}>Уже готовы вступить в клуб <span aria-hidden="true">→</span></Link>}</p>
        </div>
        <div className="join-form panel"><SubscribeForm key={intent} intent={intent} privacyUrl={site.privacyUrl} email={site.email} /></div>
      </section>
    </main>
    <Footer />
  </>;
}

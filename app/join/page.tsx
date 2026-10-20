import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscribeForm from '@/components/SubscribeForm';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Пробный урок бесплатно — Клуб Счастья',
  description: 'Оставьте e-mail и получите пробный урок Клуба Счастья: познакомьтесь с ведущими и атмосферой клуба за 20 минут.',
  alternates: { canonical: '/join' },
};

export default function JoinPage() {
  return <main id="top"><Header />
    <section className="join section-shell">
      <div className="join-copy">
        <p className="eyebrow">Ваши 20 минут в подарок</p>
        <h1>Познакомьтесь с клубом <em>за 20 минут</em></h1>
        <p className="join-lead">Оставьте e-mail и получите пробный урок бесплатно. Попробуйте практики, познакомьтесь с преподавателями и почувствуйте атмосферу клуба.</p>
        <p className="join-note">4 ведущих, 4 разных стиля и один общий путь — к жизни, в которой больше радости, энергии и внутренней опоры.</p>
      </div>
      <div className="join-form"><SubscribeForm privacyUrl={site.privacyUrl} email={site.email} /></div>
    </section>
    <Footer />
  </main>;
}

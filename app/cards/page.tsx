import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CardDraw from '@/components/CardDraw';
import { site } from '@/lib/content';
import { getPublicCards } from '@/lib/cards';

export const metadata: Metadata = {
  title: 'Метафорические карты — Клуб Счастья',
  description: 'Вытяните метафорическую карту — мягкий инструмент для самонаблюдения, подсказка для размышления и опоры на день.',
  alternates: { canonical: '/cards' },
};

export const dynamic = 'force-dynamic';

export default async function CardsPage() {
  const cards = await getPublicCards();
  return <>
    <Header />
    <main id="content" tabIndex={-1}>
      <section className="page-hero section-shell">
        <p className="eyebrow">Метафорические карты</p>
        <h1>Вытяните карту и <em>прислушайтесь к себе.</em></h1>
        <p className="page-lead">Метафорические карты — мягкий инструмент самонаблюдения. В них нет «правильного» ответа: образ и несколько слов помогают увидеть то, что уже есть внутри. Сделайте вдох, задайте себе вопрос — и вытяните карту.</p>
      </section>

      <section className="section-shell mak-section" aria-label="Вытягивание карты">
        {cards.length === 0
          ? <p className="mak-empty">Карты скоро появятся здесь. Загляните чуть позже.</p>
          : <CardDraw cards={cards} />}
      </section>

      <section className="page-cta section-shell panel">
        <h2>Хочется большего, чем одна карта?</h2>
        <p>В клубе — живые практики йоги, цигун и медитаций, которые помогают возвращаться к себе каждый день.</p>
        <Link className="button button-primary" href={site.trialUrl}>Получить пробный урок <span aria-hidden="true">→</span></Link>
      </section>
    </main>
    <Footer />
  </>;
}

import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-session';
import { getAdminCards, type StoredCard } from '@/lib/cards';
import CardForm from '../CardForm';

export default async function EditCard({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const list = await getAdminCards();
  const isNew = id === 'new';
  const found = list.find((c) => c.id === id);
  if (!isNew && !found) notFound();
  const card: StoredCard = found ?? { id: 'new', title: '', meaning: '', image: '', order: list.length, published: false };
  return (
    <main id="content" tabIndex={-1} className="adm-main">
      <h1>{isNew ? 'Новая карта' : card.title || 'Карта'}</h1>
      <CardForm card={card} isNew={isNew} />
    </main>
  );
}

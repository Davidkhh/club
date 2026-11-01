import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-session';
import { getAdminCards } from '@/lib/cards';
import { storeInfo } from '@/lib/store';

export default async function CardsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const rows = await getAdminCards();
  const published = rows.filter((c) => c.published).length;
  return (
    <main id="content" tabIndex={-1} className="adm-main">
      <h1>Метафорические карты</h1>
      <p className="adm-notice-soft">Всего {rows.length} · опубликовано {published}. Публичная страница: <code>/cards</code>.</p>
      {sp.saved && <p className="adm-ok" role="status">Карта сохранена.</p>}
      {sp.deleted && <p className="adm-ok" role="status">Карта удалена.</p>}
      {!storeInfo().persistent && <p className="adm-notice">Постоянное хранилище не подключено: карты временные и пропадут при перезапуске (см. «Настройки»).</p>}
      <div className="adm-bar">
        <span />
        <Link className="adm-btn adm-link-btn" href="/admin/cards/new">Добавить карту</Link>
      </div>
      {rows.length === 0 ? <p className="adm-lead">Пока нет ни одной карты. Добавьте первую — она появится на странице <code>/cards</code>.</p> : (
        <ul className="adm-rows">{rows.map((c) => (
          <li key={c.id} className="adm-row">
            {c.image
              ? <img className="adm-card-thumb" src={c.image} alt={c.title || 'Карта'} />
              : <span className="adm-card-thumb adm-card-thumb-empty" aria-hidden="true">?</span>}
            <div><strong>{c.title || 'Без названия'}</strong><span>{c.meaning.slice(0, 80)}{c.meaning.length > 80 ? '…' : ''}</span></div>
            <span className={`adm-badge${c.published ? ' adm-badge-on' : ''}`}>{c.published ? 'Опубликована' : 'Черновик'}</span>
            <Link className="adm-btn adm-btn-ghost adm-link-btn" href={`/admin/cards/${c.id}`}>Редактировать</Link>
          </li>))}</ul>
      )}
    </main>
  );
}

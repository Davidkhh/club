import { requireAdmin } from '@/lib/admin-session';
import { listLeads, countLeads, leadsBackend } from '@/lib/leads';

export const dynamic = 'force-dynamic';

export default async function AdminLeads() {
  await requireAdmin();
  const leads = await listLeads();
  const c = await countLeads();
  return (
    <main id="content" tabIndex={-1} className="adm-main">
      <h1>Заявки и регистрации</h1>
      <p className="adm-notice-soft">Всего {c.total} · бесплатный доступ {c.free} · платный {c.paid}. Хранилище: <code>{leadsBackend()}</code>.</p>
      {leads.length === 0
        ? <p>Пока нет ни одной заявки.</p>
        : <div className="adm-table-wrap"><table className="adm-table">
            <thead><tr><th>Дата</th><th>Имя</th><th>Почта</th><th>Телефон</th><th>Доступ</th><th>IP</th></tr></thead>
            <tbody>{leads.map((l) => <tr key={l.id}>
              <td>{new Date(l.created_at).toLocaleString('ru-RU')}</td>
              <td>{l.name}</td>
              <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
              <td><a href={`tel:${l.phone}`}>{l.phone}</a></td>
              <td><span className={`adm-badge ${l.access === 'paid' ? 'adm-badge-on' : ''}`}>{l.access === 'paid' ? 'Платный' : 'Бесплатный'}</span></td>
              <td>{l.ip ?? '—'}</td>
            </tr>)}</tbody>
          </table></div>}
    </main>
  );
}

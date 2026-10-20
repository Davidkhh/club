import Link from 'next/link';
import Portrait from '@/components/Portrait';
import { requireAdmin } from '@/lib/admin-session';
import { getAdminTeachers } from '@/lib/cms';
import { storeInfo } from '@/lib/store';

export default async function TeachersAdmin({ searchParams }: { searchParams: Promise<{ q?: string; saved?: string; deleted?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().toLowerCase().slice(0, 80);
  const { list, fromStatic } = await getAdminTeachers();
  const rows = list.filter((t) => !q || t.name.toLowerCase().includes(q)).sort((a, b) => a.order - b.order);
  return (
    <main id="top" className="adm-main">
      <h1>Преподаватели</h1>
      {sp.saved && <p className="adm-ok" role="status">Профиль сохранён.</p>}
      {sp.deleted && <p className="adm-ok" role="status">Профиль удалён.</p>}
      {!storeInfo().persistent && <p className="adm-notice">Постоянное хранилище не подключено: изменения временные и пропадут (см. «Настройки»).</p>}
      {fromStatic && <p className="adm-notice">Показаны текущие профили сайта. Они попадут в хранилище при первом сохранении.</p>}
      <div className="adm-bar">
        <form className="adm-search" role="search"><label className="adm-sr" htmlFor="q">Поиск по имени</label><input id="q" name="q" defaultValue={sp.q ?? ''} placeholder="Поиск по имени" /><button className="adm-btn adm-btn-ghost" type="submit">Найти</button></form>
        <Link className="adm-btn adm-link-btn" href="/admin/teachers/new">Добавить преподавателя</Link>
      </div>
      {rows.length === 0 ? <p className="adm-lead">Ничего не найдено.</p> : (
        <ul className="adm-rows">{rows.map((t) => (
          <li key={t.id} className="adm-row">
            <Portrait name={t.name} src={t.photo || undefined} alt={t.name} />
            <div><strong>{t.name}</strong><span>{t.specialization || 'Без специализации'}</span></div>
            <span className={`adm-badge${t.published ? ' adm-badge-on' : ''}`}>{t.published ? 'Опубликован' : 'Черновик'}</span>
            <Link className="adm-btn adm-btn-ghost adm-link-btn" href={`/admin/teachers/${t.id}`}>Редактировать</Link>
          </li>))}</ul>
      )}
    </main>
  );
}

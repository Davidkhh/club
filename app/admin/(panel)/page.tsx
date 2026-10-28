import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-session';
import { getAdminTeachers } from '@/lib/cms';
import { storeInfo } from '@/lib/store';

export default async function AdminHome() {
  await requireAdmin();
  const { list } = await getAdminTeachers();
  const persistent = storeInfo().persistent;
  return (
    <main id="content" tabIndex={-1} className="adm-main">
      <h1>Панель управления</h1>
      {!persistent && <p className="adm-notice">Постоянное хранилище не подключено: изменения временные. Подробности в «Настройках».</p>}
      <ul className="adm-cards">
        <li className="adm-card"><h2>Преподаватели</h2><p>Профили, фотографии, порядок и публикация на странице преподавателей.</p><span className="adm-badge adm-badge-on">{list.length} в списке</span><Link className="adm-btn adm-btn-ghost adm-link-btn" href="/admin/teachers">Открыть</Link></li>
        <li className="adm-card"><h2>Мероприятия</h2><p>Анонсы занятий и встреч.</p><span className="adm-badge">Следующий этап</span></li>
        <li className="adm-card"><h2>Настройки</h2><p>Контактная почта сайта, состояние хранилища и GetCourse.</p><span className="adm-badge adm-badge-on">Работает</span><Link className="adm-btn adm-btn-ghost adm-link-btn" href="/admin/settings">Открыть</Link></li>
      </ul>
    </main>
  );
}

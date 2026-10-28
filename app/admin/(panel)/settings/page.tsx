import { requireAdmin, isConfigured } from '@/lib/admin-session';
import { getSettings } from '@/lib/cms';
import { getcourseStatus } from '@/lib/getcourse';
import { storeInfo } from '@/lib/store';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();
  const store = storeInfo();
  const gc = getcourseStatus();
  return (
    <main id="content" tabIndex={-1} className="adm-main">
      <h1>Настройки</h1>
      <SettingsForm email={s.contactEmail} />
      <h2 className="adm-h2">Состояние</h2>
      <ul className="adm-status">
        <li><span>Вход администратора</span><b>{isConfigured() ? 'Настроен' : 'Не настроен'}</b></li>
        <li><span>Хранилище данных</span><b>{store.persistent ? 'Подключено: ' + store.backend : 'Не подключено (временная память)'}</b></li>
        <li><span>GetCourse</span><b>{gc.configured ? 'Параметры заданы, связь не проверялась' : 'Не подключён. Нужны: ' + gc.missing.join(', ')}</b></li>
      </ul>
      {!store.persistent && <p className="adm-notice">Чтобы изменения сохранялись, задайте UPSTASH_REDIS_REST_URL и UPSTASH_REDIS_REST_TOKEN (README).</p>}
    </main>
  );
}

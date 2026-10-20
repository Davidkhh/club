import type { Metadata } from 'next';
import Link from 'next/link';
import { logoutAction } from '../login/actions';
import { requireAdmin } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Панель управления — Клуб Счастья', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="adm">
      <header className="adm-top">
        <p className="adm-brand">Клуб Счастья <span>Администрирование</span></p>
        <div className="adm-user">
          <span>{session.username}</span>
          <form action={logoutAction}><button className="adm-btn adm-btn-ghost" type="submit">Выйти</button></form>
        </div>
      </header>
      <nav className="adm-nav" aria-label="Разделы"><Link href="/admin">Обзор</Link><Link href="/admin/teachers">Преподаватели</Link><Link href="/admin/settings">Настройки</Link></nav>
      {children}
    </div>
  );
}

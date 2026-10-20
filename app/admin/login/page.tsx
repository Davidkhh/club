import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession, isConfigured } from '@/lib/admin-session';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Вход — Клуб Счастья', robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getSession()) redirect('/admin');
  return (
    <main id="top" className="adm adm-center">
      <section className="adm-card-login">
        <p className="adm-brand">Клуб Счастья</p>
        <h1>Вход для администратора</h1>
        <LoginForm configured={isConfigured()} />
      </section>
    </main>
  );
}

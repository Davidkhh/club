'use server';
import { redirect } from 'next/navigation';
import { checkCredentials, clearFailures, clientIp, endSession, isBlocked, isConfigured, recordFailure, startSession } from '@/lib/admin-session';

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!isConfigured()) return { error: 'Вход не настроен. Администратору нужно задать переменные окружения сервера.' };
  const ip = await clientIp();
  if (isBlocked(ip)) return { error: 'Слишком много попыток. Попробуйте позже.' };

  const username = form.get('username');
  const password = form.get('password');
  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) return { error: 'Введите логин и пароль.' };
  if (username.length > 128 || password.length > 256) return { error: 'Неверный логин или пароль.' };

  if (!checkCredentials(username.trim(), password)) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 600));
    return { error: 'Неверный логин или пароль.' };
  }
  clearFailures(ip);
  await startSession(username.trim());
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect('/admin/login');
}

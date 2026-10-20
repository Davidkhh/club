'use server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-session';
import { saveSettings } from '@/lib/cms';

export type SettingsState = { error?: string; ok?: boolean };

export async function saveSettingsAction(_p: SettingsState, f: FormData): Promise<SettingsState> {
  await requireAdmin();
  const email = typeof f.get('contactEmail') === 'string' ? (f.get('contactEmail') as string).trim() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return { error: 'Проверьте адрес электронной почты.' };
  try { await saveSettings({ contactEmail: email }); } catch { return { error: 'Не удалось сохранить. Проверьте подключение хранилища.' }; }
  revalidatePath('/', 'layout');
  return { ok: true };
}

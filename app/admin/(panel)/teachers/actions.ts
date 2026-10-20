'use server';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-session';
import { removeTeacher, saveTeacher } from '@/lib/cms';
import { kvSet } from '@/lib/store';

export type FormState = { error?: string };
const str = (f: FormData, k: string) => (typeof f.get(k) === 'string' ? (f.get(k) as string).replace(/\r\n/g, '\n').trim() : '');

export async function saveTeacherAction(_p: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const rawId = str(f, 'id');
  const id = rawId === 'new' ? randomUUID() : rawId;
  if (!/^[A-Za-z0-9-]{1,64}$/.test(id)) return { error: 'Некорректный идентификатор.' };
  const name = str(f, 'name'), specialization = str(f, 'specialization'), shortBio = str(f, 'shortBio'), bio = str(f, 'bio');
  const order = Number.parseInt(str(f, 'order') || '0', 10);
  if (name.length < 2 || name.length > 80) return { error: 'Имя: от 2 до 80 символов.' };
  if (specialization.length > 160) return { error: 'Специализация: не длиннее 160 символов.' };
  if (shortBio.length > 300) return { error: 'Краткое описание: не длиннее 300 символов.' };
  if (bio.length > 5000) return { error: 'Биография: не длиннее 5000 символов.' };
  if (!Number.isInteger(order) || order < 0 || order > 999) return { error: 'Порядок: число от 0 до 999.' };
  const published = f.get('published') === 'on';

  let photo = str(f, 'photo');
  if (photo && !/^(\/assets\/[\w.-]+|\/api\/photo\/[\w-]+\?v=\d+)$/.test(photo)) photo = '';
  const data = str(f, 'photoData');
  if (data) {
    if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(data) || data.length > 420_000) return { error: 'Фото не принято: нужен JPEG до 300 КБ.' };
    const b64 = data.split(',')[1];
    if (!Buffer.from(b64, 'base64').subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return { error: 'Файл не похож на JPEG.' };
    try { await kvSet(`img:${id}`, b64); } catch { return { error: 'Не удалось сохранить фото.' }; }
    photo = `/api/photo/${id}?v=${Date.now()}`;
  } else if (f.get('removePhoto') === '1') photo = '';

  try { await saveTeacher({ id, name, specialization, shortBio, bio, photo, order, published }); } catch { return { error: 'Не удалось сохранить. Проверьте подключение хранилища.' }; }
  revalidatePath('/teachers'); revalidatePath('/');
  redirect('/admin/teachers?saved=1');
}

export async function deleteTeacherAction(f: FormData): Promise<void> {
  await requireAdmin();
  const id = str(f, 'id');
  if (/^[A-Za-z0-9-]{1,64}$/.test(id)) await removeTeacher(id);
  revalidatePath('/teachers'); revalidatePath('/');
  redirect('/admin/teachers?deleted=1');
}

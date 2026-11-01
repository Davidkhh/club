'use server';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-session';
import { removeCard, saveCard } from '@/lib/cards';
import { kvSet } from '@/lib/store';

export type FormState = { error?: string };
const str = (f: FormData, k: string) => (typeof f.get(k) === 'string' ? (f.get(k) as string).replace(/\r\n/g, '\n').trim() : '');

export async function saveCardAction(_p: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  const rawId = str(f, 'id');
  const id = rawId === 'new' ? randomUUID() : rawId;
  if (!/^[A-Za-z0-9-]{1,64}$/.test(id)) return { error: 'Некорректный идентификатор.' };
  const title = str(f, 'title'), meaning = str(f, 'meaning');
  const order = Number.parseInt(str(f, 'order') || '0', 10);
  if (title.length > 80) return { error: 'Название: не длиннее 80 символов.' };
  if (meaning.length < 2 || meaning.length > 1200) return { error: 'Текст карты: от 2 до 1200 символов.' };
  if (!Number.isInteger(order) || order < 0 || order > 999) return { error: 'Порядок: число от 0 до 999.' };
  const published = f.get('published') === 'on';

  let image = str(f, 'image');
  if (image && !/^\/api\/photo\/[\w-]+\?v=\d+$/.test(image)) image = '';
  const data = str(f, 'imageData');
  if (data) {
    if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(data) || data.length > 1_400_000) return { error: 'Картинка не принята: нужен JPEG до 1 МБ.' };
    const b64 = data.split(',')[1];
    if (!Buffer.from(b64, 'base64').subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return { error: 'Файл не похож на JPEG.' };
    try { await kvSet(`img:${id}`, b64); } catch { return { error: 'Не удалось сохранить картинку.' }; }
    image = `/api/photo/${id}?v=${Date.now()}`;
  } else if (f.get('removeImage') === '1') image = '';

  if (published && !image) return { error: 'Чтобы опубликовать карту, добавьте картинку.' };

  try { await saveCard({ id, title, meaning, image, order, published }); } catch { return { error: 'Не удалось сохранить. Проверьте подключение хранилища.' }; }
  revalidatePath('/cards');
  redirect('/admin/cards?saved=1');
}

export async function deleteCardAction(f: FormData): Promise<void> {
  await requireAdmin();
  const id = str(f, 'id');
  if (/^[A-Za-z0-9-]{1,64}$/.test(id)) await removeCard(id);
  revalidatePath('/cards');
  redirect('/admin/cards?deleted=1');
}

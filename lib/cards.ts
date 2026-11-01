// Метафорические карты. Хранятся в том же KV-слое, что и преподаватели (lib/store):
// список карт — JSON под ключом `cards`, изображение карты — base64 под `img:<id>`
// и отдаётся готовым роутом /api/photo/[id]. Постоянство — при подключённом Upstash Redis.
import { kvDel, kvGet, kvSet } from './store';

export type StoredCard = { id: string; title: string; meaning: string; image: string; order: number; published: boolean };
// То, что уходит на публичную страницу (без черновиков и служебных полей).
export type PublicCard = { id: string; title: string; meaning: string; image: string };

async function readJson<T>(key: string): Promise<T | null> {
  const raw = await kvGet(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function getAdminCards(): Promise<StoredCard[]> {
  const stored = await readJson<StoredCard[]>('cards');
  return (stored ?? []).slice().sort((a, b) => a.order - b.order);
}

export async function getPublicCards(): Promise<PublicCard[]> {
  const stored = await readJson<StoredCard[]>('cards').catch(() => null);
  if (!stored) return [];
  return stored
    .filter((c) => c.published && c.image)
    .sort((a, b) => a.order - b.order)
    .map((c) => ({ id: c.id, title: c.title, meaning: c.meaning, image: c.image }));
}

export async function saveCard(c: StoredCard): Promise<void> {
  const list = await getAdminCards();
  const i = list.findIndex((x) => x.id === c.id);
  if (i >= 0) list[i] = c; else list.push(c);
  await kvSet('cards', JSON.stringify(list));
}

export async function removeCard(id: string): Promise<void> {
  const list = await getAdminCards();
  await kvSet('cards', JSON.stringify(list.filter((x) => x.id !== id)));
  await kvDel(`img:${id}`);
}

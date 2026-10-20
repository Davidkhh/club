import { kvDel, kvGet, kvSet } from './store';
import { teachers as staticTeachers, type Teacher } from './teachers';
import { site } from './content';

export type StoredTeacher = { id: string; name: string; specialization: string; shortBio: string; bio: string; photo: string; order: number; published: boolean };
export type Settings = { contactEmail: string };

async function readJson<T>(key: string): Promise<T | null> {
  const raw = await kvGet(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

const fromStatic = (): StoredTeacher[] => staticTeachers.map((t, i) => ({ id: t.id, name: t.name, specialization: t.role ?? '', shortBio: '', bio: '', photo: t.photo ?? '', order: i, published: true }));

// Пока в хранилище нет списка, админка показывает текущие профили сайта; первое сохранение записывает их в хранилище.
export async function getAdminTeachers(): Promise<{ list: StoredTeacher[]; fromStatic: boolean }> {
  const stored = await readJson<StoredTeacher[]>('teachers');
  return stored ? { list: stored, fromStatic: false } : { list: fromStatic(), fromStatic: true };
}
export async function saveTeacher(t: StoredTeacher): Promise<void> {
  const { list } = await getAdminTeachers();
  const i = list.findIndex((x) => x.id === t.id);
  if (i >= 0) list[i] = t; else list.push(t);
  await kvSet('teachers', JSON.stringify(list));
}
export async function removeTeacher(id: string): Promise<void> {
  const { list } = await getAdminTeachers();
  await kvSet('teachers', JSON.stringify(list.filter((x) => x.id !== id)));
  await kvDel(`img:${id}`);
}

// Публичный список: опубликованные профили из хранилища; занятия подтягиваются из расписания по имени.
export async function getPublicTeachers(): Promise<Teacher[]> {
  const stored = await readJson<StoredTeacher[]>('teachers').catch(() => null);
  if (!stored) return staticTeachers;
  return stored.filter((t) => t.published).sort((a, b) => a.order - b.order).map((t) => {
    const base = staticTeachers.find((s) => s.name === t.name);
    return { id: t.id, name: t.name, photo: t.photo || undefined, photoAlt: `${t.name} — преподаватель Клуба Счастья`, role: t.specialization || base?.role, facts: base?.facts, sessions: base?.sessions ?? [], shortBio: t.shortBio, bio: t.bio };
  });
}

export async function getSettings(): Promise<Settings> {
  const s = await readJson<Settings>('settings').catch(() => null);
  return { contactEmail: s?.contactEmail || site.email };
}
export async function saveSettings(s: Settings): Promise<void> { await kvSet('settings', JSON.stringify(s)); }

import { practices, schedule } from './content';
import { teacherProfiles } from './programs';

export type TeacherSession = { title: string; href: string; when: string; description?: string };
export type Teacher = { id: string; name: string; photo?: string; photoAlt?: string; role?: string; facts?: string[]; shortBio?: string; bio?: string; sessions: TeacherSession[] };

// Данные собраны из расписания и описаний программ клуба (lib/programs.ts).
// Фото ведущих (кроме Ольги) пока нет — их можно загрузить в админке.
const byName = new Map<string, Teacher>();
for (const item of schedule) {
  const t = byName.get(item.teacher) ?? { id: `t-${byName.size + 1}`, name: item.teacher, sessions: [] };
  t.sessions.push({
    title: item.title,
    href: item.href,
    when: item.day === 'По анонсу' ? 'Дата объявляется в анонсе' : `${item.day}, ${item.time} по Москве`,
    description: practices.find((p) => p.href === item.href)?.text,
  });
  byName.set(item.teacher, t);
}
// Ольга: своя страница программы и фото; звание и факты — из teacherProfiles, как у остальных.
const olga = byName.get('Ольга');
if (olga) Object.assign(olga, {
  id: 'olga',
  photo: '/assets/olga.jpg',
  photoAlt: 'Ольга — преподаватель Клуба Счастья',
});
// Звание и факты из описаний программ клуба
for (const t of byName.values()) {
  const p = teacherProfiles[t.name];
  if (p && !t.facts) Object.assign(t, { role: p.title, facts: p.facts });
}
export const teachers: Teacher[] = [...byName.values()];

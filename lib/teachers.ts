import { practices, schedule } from './content';

export type TeacherSession = { title: string; href: string; when: string; description?: string };
export type Teacher = { id: string; name: string; photo?: string; photoAlt?: string; role?: string; facts?: string[]; shortBio?: string; bio?: string; sessions: TeacherSession[] };

// Данные собраны из расписания и практик сайта. Фото, биографии и квалификации
// отсутствуют в исходных материалах: добавлять только подтверждённые владельцем клуба.
const byName = new Map<string, Teacher>();
for (const item of schedule) {
  const t = byName.get(item.teacher) ?? { id: `t-${byName.size + 1}`, name: item.teacher, sessions: [] };
  t.sessions.push({
    title: item.title,
    href: item.href.endsWith('/useful_hit') ? '/useful-hit' : item.href,
    when: item.day === 'По анонсу' ? 'Дата объявляется в анонсе' : `${item.day}, ${item.time} по Москве`,
    description: practices.find((p) => p.href === item.href)?.text,
  });
  byName.set(item.teacher, t);
}
// Профиль Ольги: только то, что указано на сайте клуба (программа, время эфира).
// Биография, образование и стаж в источниках не найдены — не добавлять без подтверждения клуба.
const olga = byName.get('Ольга');
if (olga) Object.assign(olga, {
  id: 'olga',
  photo: '/assets/olga.jpg',
  photoAlt: 'Ольга — преподаватель Клуба Счастья',
  role: 'Ведущая программы «Полезные простукивания и массаж точек»',
  facts: ['Эфиры проходят по вторникам, 18:00–19:00 по Москве', 'Клуб описывает программу как практику для оздоровления, антистресса, восстановления и профилактики', 'Практика не заменяет медицинскую помощь'],
});
export const teachers: Teacher[] = [...byName.values()];

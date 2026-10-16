import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

// Ближайшее занятие в заданный день недели (0 = воскресенье) и час по Москве (UTC+3).
function nextSlot(dow: number, hourMsk: number): Date {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hourMsk - 3));
  d.setUTCDate(d.getUTCDate() + ((dow - d.getUTCDay() + 7) % 7));
  if (d <= now) d.setUTCDate(d.getUTCDate() + 7);
  return d;
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error('Задайте SEED_ADMIN_EMAIL и SEED_ADMIN_PASSWORD (не короче 12 символов) в .env');

  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Администратор', role: 'admin', passwordHash: await bcrypt.hash(password, 12) },
  });

  // Тарифы-заглушки для разработки: скрыты (isActive=false), цены условные. Реальные тарифы вносятся в админке.
  for (const p of [
    { title: 'Демо: 1 месяц', priceCents: 100000, durationDays: 30 },
    { title: 'Демо: 3 месяца', priceCents: 250000, durationDays: 90 },
  ]) {
    if (!(await db.plan.findFirst({ where: { title: p.title } }))) await db.plan.create({ data: { ...p, isActive: false } });
  }

  const names = ['Юлия', 'Сильвия', 'Ольга'];
  const ids: Record<string, string> = {};
  for (const name of names) {
    const found = await db.instructor.findFirst({ where: { name } });
    ids[name] = (found ?? (await db.instructor.create({ data: { name } }))).id;
  }

  // Расписание из описания клуба (время по Москве); дни и часы подтверждает клуб.
  const classes = [
    { title: 'Йога для начинающих', instructor: 'Юлия', dow: 3, hour: 7, level: 'beginner' as const },
    { title: 'Йогатерапия', instructor: 'Сильвия', dow: 1, hour: 7, level: 'all' as const },
    { title: 'Полезные простукивания и массаж точек', instructor: 'Ольга', dow: 2, hour: 18, level: 'all' as const },
  ];
  if ((await db.yogaClass.count()) === 0) {
    for (const c of classes) {
      await db.yogaClass.create({ data: { title: c.title, instructorId: ids[c.instructor], level: c.level, startsAt: nextSlot(c.dow, c.hour), durationMin: 60, isPublished: true } });
    }
  }

  if ((await db.testimonial.count()) === 0) {
    await db.testimonial.createMany({ data: [
      { authorName: 'Оксана, 46 лет, Иматра', text: 'Во время занятия силы не убывают, а, наоборот, увеличиваются. Тело как будто оживает. Особенно это актуально при сидячей работе или учёбе.', isPublished: true },
      { authorName: 'Ирина, 51 год, Москва', text: 'Для тела это нужная нагрузка и дофамин. После занятия настроение меняется: если не становится совсем плюсовым, то точно выравнивается. Получается настоящее путешествие к себе.', isPublished: true },
    ] });
  }
}

main().then(() => db.$disconnect()).catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });

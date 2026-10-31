import { NextResponse } from 'next/server';
import { addLead, type Access } from '@/lib/leads';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Регистрация: проверяем данные (имя, e-mail, телефон), сохраняем в локальную базу
// (data/registrations.db: имя, почта, телефон, тип доступа, IP) и, если задан
// SUBSCRIBE_WEBHOOK_URL, дополнительно отправляем их в CRM/рассылку (best-effort).
export async function POST(req: Request) {
  let body: { name?: unknown; email?: unknown; phone?: unknown; consent?: unknown; company?: unknown; intent?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  if (typeof body.company === 'string' && body.company.trim()) return NextResponse.json({ ok: true }); // ловушка для ботов

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 80) return NextResponse.json({ error: 'invalid_name' }, { status: 400 });

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });

  const phoneRaw = typeof body.phone === 'string' ? body.phone.trim() : '';
  const digits = phoneRaw.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15 || !/^\+?[\d\s()-]+$/.test(phoneRaw)) return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
  // нормализуем: ведущая «8» для России → «+7», иначе добавляем «+» к международному номеру
  const phone = phoneRaw.startsWith('+') ? `+${digits}` : digits.length === 11 && digits.startsWith('8') ? `+7${digits.slice(1)}` : `+${digits}`;

  if (body.consent !== true) return NextResponse.json({ error: 'consent_required' }, { status: 400 });

  // Тип доступа: заявка на вступление — платный, пробный урок — бесплатный.
  const access: Access = body.intent === 'club' ? 'paid' : 'free';
  // IP: берём первый адрес из X-Forwarded-For (его ставит прокси/Vercel), иначе X-Real-IP.
  const ip = (req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? '').trim() || null;

  // Сохраняем заявку в базу (Postgres/Neon в проде, иначе локальный SQLite) — основное хранилище.
  try {
    await addLead({ name, email, phone, access, ip, source: body.intent === 'club' ? 'club-site-membership' : 'club-site-trial' });
  } catch {
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  // Если настроен внешний сервис (CRM/рассылка) — досылаем туда, но не валим заявку, если он недоступен.
  const url = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, access, source: body.intent === 'club' ? 'club-site-membership' : 'club-site-trial', consent: true, at: new Date().toISOString() }),
        signal: AbortSignal.timeout(8000),
      });
    } catch { /* заявка уже сохранена в базе; ошибку внешнего сервиса игнорируем */ }
  }

  return NextResponse.json({ ok: true });
}

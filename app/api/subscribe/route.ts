import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Подписка: проверяем данные и передаём их сервису рассылки по SUBSCRIBE_WEBHOOK_URL.
// Если адрес не настроен, честно отвечаем 503: ложного «успеха» не будет.
// Формат запроса под ваш сервис рассылки меняется только здесь.
export async function POST(req: Request) {
  let body: { email?: unknown; consent?: unknown; company?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }); }

  if (typeof body.company === 'string' && body.company.trim()) return NextResponse.json({ ok: true }); // ловушка для ботов
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ error: 'consent_required' }, { status: 400 });

  const url = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (!url) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'club-site-join', consent: true, at: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json({ error: 'provider_error' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'provider_unreachable' }, { status: 502 });
  }
}

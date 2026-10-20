import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Временная серверная сессия администратора без базы данных.
// Учётные данные и секрет подписи берутся только из переменных окружения сервера.
// Не использовать в production без отдельного аудита: нет ролей, истории входов и распределённого лимита попыток.

const COOKIE = process.env.NODE_ENV === 'production' ? '__Host-admin_session' : 'admin_session';
const MAX_AGE_S = 60 * 60 * 8;

function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && secret());
}

const digest = (v: string) => createHash('sha256').update(v).digest();
const sign = (payload: string, key: string) => createHmac('sha256', key).update(payload).digest('base64url');
const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

export function checkCredentials(username: string, password: string): boolean {
  const okUser = safeEqual(username, process.env.ADMIN_USERNAME ?? '');
  const okPass = safeEqual(password, process.env.ADMIN_PASSWORD ?? '');
  return okUser && okPass;
}

export async function startSession(username: string): Promise<void> {
  const key = secret();
  if (!key) throw new Error('ADMIN_SESSION_SECRET не задан');
  const payload = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + MAX_AGE_S * 1000 })).toString('base64url');
  (await cookies()).set(COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_S,
  });
}

export async function getSession(): Promise<{ username: string } | null> {
  const key = secret();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!key || !token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload, key))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { u?: string; exp?: number };
    if (typeof data.u !== 'string' || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    if (data.u !== process.env.ADMIN_USERNAME) return null; // смена логина в окружении закрывает старые сессии
    return { username: data.u };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ username: string }> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

// Ограничение попыток входа: хранится в памяти экземпляра сервера. На Vercel экземпляры недолговечны,
// поэтому это лишь базовая защита; для production нужен общий счётчик (например, Upstash Redis).
const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const fails = new Map<string, { n: number; reset: number }>();

export function isBlocked(key: string): boolean {
  const e = fails.get(key);
  if (!e) return false;
  if (Date.now() > e.reset) { fails.delete(key); return false; }
  return e.n >= MAX_FAILS;
}
export function recordFailure(key: string): void {
  const now = Date.now();
  const e = fails.get(key);
  if (!e || now > e.reset) fails.set(key, { n: 1, reset: now + WINDOW_MS });
  else e.n += 1;
  if (fails.size > 5000) for (const [k, v] of fails) if (now > v.reset) fails.delete(k);
}
export function clearFailures(key: string): void { fails.delete(key); }

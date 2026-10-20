// Слой хранения: Upstash Redis по REST (без зависимостей) либо временная память для локальной разработки.
// Память НЕ постоянна: на Vercel каждый экземпляр сервера имеет свою копию, данные пропадают. Для production задайте Redis (см. README).
const URL_ = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const mem = ((globalThis as unknown as { __memStore?: Map<string, string> }).__memStore ??= new Map<string, string>());

export function storeInfo() {
  return { persistent: Boolean(URL_ && TOKEN), backend: URL_ && TOKEN ? 'Upstash Redis' : 'Память сервера (временно)' };
}

async function redis(cmd: (string | number)[]): Promise<unknown> {
  const res = await fetch(URL_!, { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd), cache: 'no-store' });
  if (!res.ok) throw new Error(`store ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error('store error');
  return data.result;
}

export async function kvGet(key: string): Promise<string | null> {
  if (!storeInfo().persistent) return mem.get(key) ?? null;
  return ((await redis(['GET', key])) as string | null) ?? null;
}
export async function kvSet(key: string, value: string): Promise<void> {
  if (!storeInfo().persistent) { mem.set(key, value); return; }
  await redis(['SET', key, value]);
}
export async function kvDel(key: string): Promise<void> {
  if (!storeInfo().persistent) { mem.delete(key); return; }
  await redis(['DEL', key]);
}

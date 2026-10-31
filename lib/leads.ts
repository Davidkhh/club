// База регистраций. В продакшене — Postgres (Neon) через Prisma, если задан DATABASE_URL.
// Локально без него — встроенный SQLite (data/registrations.db), чтобы разработка работала без облака.
// node:sqlite и Prisma подключаются динамически: в прод-режиме SQLite не загружается вовсе, и наоборот.

export type Access = 'free' | 'paid';
export type Lead = { id: string | number; name: string; email: string; phone: string; access: Access; ip: string | null; created_at: string };
export type LeadInput = { name: string; email: string; phone: string; access: Access; ip: string | null; source?: string | null };

const usePg = Boolean(process.env.DATABASE_URL);
export function leadsBackend() { return usePg ? 'Postgres (Neon)' : 'SQLite (локальный файл)'; }

export async function addLead(l: LeadInput): Promise<void> {
  if (usePg) {
    const { db } = await import('./db');
    await db.lead.create({ data: { name: l.name, email: l.email, phone: l.phone, access: l.access, ip: l.ip, source: l.source ?? null } });
    return;
  }
  const d = await sqlite();
  d.prepare('INSERT INTO registrations (name, email, phone, access, ip, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(l.name, l.email, l.phone, l.access, l.ip, new Date().toISOString());
}

export async function listLeads(limit = 1000): Promise<Lead[]> {
  if (usePg) {
    const { db } = await import('./db');
    const rows = await db.lead.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
    return rows.map((r) => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, access: r.access as Access, ip: r.ip, created_at: r.createdAt.toISOString() }));
  }
  const d = await sqlite();
  return d.prepare('SELECT * FROM registrations ORDER BY id DESC LIMIT ?').all(limit) as unknown as Lead[];
}

export async function countLeads(): Promise<{ total: number; free: number; paid: number }> {
  if (usePg) {
    const { db } = await import('./db');
    const [total, free, paid] = await Promise.all([db.lead.count(), db.lead.count({ where: { access: 'free' } }), db.lead.count({ where: { access: 'paid' } })]);
    return { total, free, paid };
  }
  const d = await sqlite();
  const r = d.prepare("SELECT COUNT(*) total, SUM(access = 'free') free, SUM(access = 'paid') paid FROM registrations").get() as { total: number; free: number | null; paid: number | null };
  return { total: r.total, free: r.free ?? 0, paid: r.paid ?? 0 };
}

// ---- локальный SQLite (запасной путь для разработки) ----
type SqliteDb = {
  exec(sql: string): void;
  prepare(sql: string): { run(...a: unknown[]): { lastInsertRowid: number | bigint }; get(...a: unknown[]): unknown; all(...a: unknown[]): unknown[] };
};
const g = globalThis as unknown as { __leadsDb?: SqliteDb };

async function sqlite(): Promise<SqliteDb> {
  if (g.__leadsDb) return g.__leadsDb;
  const { DatabaseSync } = await import('node:sqlite');
  const { mkdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const dir = join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  const d = new DatabaseSync(join(dir, 'registrations.db')) as unknown as SqliteDb;
  d.exec(`CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    access TEXT NOT NULL CHECK (access IN ('free','paid')),
    ip TEXT, created_at TEXT NOT NULL
  )`);
  g.__leadsDb = d;
  return d;
}

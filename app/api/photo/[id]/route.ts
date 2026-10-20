import { kvGet } from '@/lib/store';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[A-Za-z0-9-]{1,64}$/.test(id)) return new Response('Not found', { status: 404 });
  const data = await kvGet(`img:${id}`);
  if (!data) return new Response('Not found', { status: 404 });
  return new Response(Buffer.from(data, 'base64'), { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
}

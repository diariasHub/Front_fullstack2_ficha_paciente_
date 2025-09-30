import { pool, ensureSchema } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!pool) return res.status(500).json({ error: 'DATABASE_URL not configured' });
  await ensureSchema();
  const usados = req.body || [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { id, cantidad } of usados) {
      await client.query('UPDATE insumos SET cantidad = GREATEST(0, cantidad - $1) WHERE id = $2', [Number(cantidad) || 0, id]);
    }
    await client.query('COMMIT');
    res.status(200).json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  } finally {
    client.release();
  }
}

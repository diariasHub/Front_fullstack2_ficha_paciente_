import { pool, ensureSchema } from '../../../lib/db';

export default async function handler(req, res) {
  if (!pool) return res.status(500).json({ error: 'DATABASE_URL not configured' });
  await ensureSchema();
  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT id, nombre, cantidad FROM insumos ORDER BY id ASC');
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const { nombre, cantidad } = req.body || {};
      const { rows } = await pool.query('INSERT INTO insumos (nombre, cantidad) VALUES ($1, $2) RETURNING id, nombre, cantidad', [nombre, Number(cantidad) || 0]);
      return res.status(201).json(rows[0]);
    }
    return res.status(405).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

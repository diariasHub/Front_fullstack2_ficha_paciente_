import { pool, ensureSchema } from '../../../lib/db';

export default async function handler(req, res) {
  if (!pool) return res.status(500).json({ error: 'DATABASE_URL not configured' });
  await ensureSchema();
  const { id } = req.query;
  try {
    if (req.method === 'PUT') {
      const { nombre, cantidad } = req.body || {};
      const { rows } = await pool.query(
        'UPDATE insumos SET nombre = $1, cantidad = $2 WHERE id = $3 RETURNING id, nombre, cantidad',
        [nombre, Number(cantidad) || 0, id]
      );
      return rows[0] ? res.json(rows[0]) : res.status(404).end();
    }
    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM insumos WHERE id = $1', [id]);
      return res.status(204).end();
    }
    return res.status(405).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

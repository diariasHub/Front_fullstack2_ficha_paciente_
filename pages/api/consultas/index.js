import { pool, ensureSchema } from '../../../lib/db';

export default async function handler(req, res) {
  if (!pool) return res.status(500).json({ error: 'DATABASE_URL not configured' });
  await ensureSchema();
  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM consultas ORDER BY created_at DESC');
      return res.json(rows);
    }
    if (req.method === 'POST') {
      const c = req.body || {};
      const { rows } = await pool.query(
        `INSERT INTO consultas (nombre, edad, rut, carrera, telefono, motivo, tratamiento, fecha, hora, usuario, vitales, insumos)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         RETURNING *`,
        [c.nombre, c.edad || null, c.rut, c.carrera, c.telefono, c.motivo, c.tratamiento, c.fecha, c.hora, c.usuario, JSON.stringify(c.vitales || []), JSON.stringify(c.insumos || [])]
      );
      return res.status(201).json(rows[0]);
    }
    return res.status(405).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
}

// Validate API handlers without HTTP by invoking Next.js API route functions directly
// Usage: node scripts/test-endpoints.js

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function createMockRes() {
  const res = {
    _status: 200,
    _body: null,
    status(code) { this._status = code; return this; },
    json(data) { this._body = data; this._done && this._done(); return this; },
    end() { this._done && this._done(); return this; },
  };
  return res;
}

async function runHandler(modPath, { method='GET', body=null, query={} } = {}) {
  const mod = await import(modPath);
  const handler = mod.default;
  const req = { method, body, query };
  const res = createMockRes();
  await new Promise((resolve, reject) => {
    res._done = resolve;
    Promise.resolve(handler(req, res)).catch(reject);
  });
  return { status: res._status, body: res._body };
}

async function main() {
  const base = path.resolve(process.cwd(), 'pages', 'api');

  console.log('--- GET /api/insumos (initial)');
  let r = await runHandler(path.join(base, 'insumos', 'index.js'), { method: 'GET' });
  console.log('Status:', r.status, 'Body:', r.body);

  console.log('--- POST /api/insumos');
  r = await runHandler(path.join(base, 'insumos', 'index.js'), { method: 'POST', body: { nombre: 'Guantes', cantidad: 10 } });
  console.log('Status:', r.status, 'Body:', r.body);

  console.log('--- GET /api/insumos (after insert)');
  r = await runHandler(path.join(base, 'insumos', 'index.js'), { method: 'GET' });
  console.log('Status:', r.status, 'Count:', Array.isArray(r.body) ? r.body.length : 'n/a');

  console.log('--- POST /api/consultas');
  r = await runHandler(path.join(base, 'consultas', 'index.js'), { method: 'POST', body: { nombre: 'Paciente Test', motivo: 'Control', fecha: '2025-09-30', hora: '12:00', usuario: 'admin', vitales: [], insumos: [] } });
  console.log('Status:', r.status, 'Body:', r.body && r.body.id ? { id: r.body.id } : r.body);

  console.log('--- GET /api/consultas');
  r = await runHandler(path.join(base, 'consultas', 'index.js'), { method: 'GET' });
  console.log('Status:', r.status, 'Count:', Array.isArray(r.body) ? r.body.length : 'n/a');

  console.log('All endpoint checks finished.');
}

main().catch((e) => { console.error('Endpoint test failed:', e); process.exit(1); });

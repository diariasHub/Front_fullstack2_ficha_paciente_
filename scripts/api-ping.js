const http = require('http');

const url = 'http://localhost:3000/api/insumos';
http.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data.slice(0, 200));
  });
}).on('error', (err) => {
  console.error('API ping error:', err.message);
  process.exit(1);
});

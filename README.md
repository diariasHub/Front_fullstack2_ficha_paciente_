# Fichas Paciente - Frontend (Next.js)

Aplicación Next.js con Bootstrap y Tailwind para gestionar fichas de pacientes, consultas y stock de insumos.

## Requisitos
- Node.js 18+

## Ejecutar en desarrollo
```powershell
Set-Location -Path "c:\Users\Usuario\Desktop\fichas_paciente_prog\Front_fullstack2_ficha_paciente_"
cmd /c npm install
cmd /c npm run dev
```
Abrir http://localhost:3000

Credenciales demo: admin / admin

## Persistencia local
- Insumos y Consultas se guardan en localStorage (archivos en `services/insumoService.js` y `services/consultaService.js`).
- Fácil de migrar a una API: reemplazar funciones por llamadas HTTP.

## Próximos pasos (integración a base de datos)
Este proyecto ya incluye endpoints API con PostgreSQL usando `pg` y un flag para activar su uso.

### Variables de entorno (.env.local)
```
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
PGSSLMODE=require
NEXT_PUBLIC_USE_API=true
```

### Pasos para AWS RDS (PostgreSQL)
1. Crear una instancia RDS PostgreSQL (o usar Aurora PostgreSQL).
2. Permitir acceso desde tu IP o VPC (security group inbound rules).
3. Colocar la cadena en `DATABASE_URL` (formato arriba). Usar SSL: `PGSSLMODE=require`.
4. Ejecutar la app con `NEXT_PUBLIC_USE_API=true`. La app creará tablas si no existen.

Endpoints:
- GET/POST `/api/insumos`
- PUT/DELETE `/api/insumos/[id]`
- POST `/api/insumos/descontar`
- GET/POST `/api/consultas`

## Scripts
- `npm run dev` - servidor de desarrollo
- `npm run build` - build de producción
- `npm run start` - iniciar producción

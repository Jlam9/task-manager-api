# Task Manager API

API REST para gestion de tareas multiusuario con NestJS, TypeORM y JWT.

Nota: No hay registro publico; usar usuario seeded.

## Requisitos

- Node.js 20+
- PostgreSQL

## Variables de entorno

Crea un archivo `.env` con:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=task_manager
JWT_SECRET=super-secret
JWT_EXPIRES_IN=1d
```

## Instalacion

```
npm install
```

## Migrations

```
# Generar migracion (si deseas nuevas)
# npx typeorm-ts-node-commonjs migration:generate src/database/migrations/NuevaMigracion -d src/database/data-source.ts

# Ejecutar migraciones
npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts
```

## Seed

```
# Ejecutar seed
npx ts-node src/database/seeds/run-seed.ts
```

Usuarios demo (seed):
- Admin: `admin@test.com` / `Admin123!`
- Test: `user@test.com` / `User123!`

## Ejecutar en desarrollo

```
npm run start:dev
```

## Swagger

Disponible en `http://localhost:3000/docs`.

## Endpoints principales

- `POST /sessions`
- `GET /users/:uuid`
- `GET /tasks`
- `GET /tasks/:uuid`
- `POST /tasks`
- `PATCH /tasks/:uuid`
- `DELETE /tasks/:uuid`

## Convenciones REST

- Recursos: `sessions`, `users`, `tasks`.
- JSON como formato de intercambio.
- Autenticación: `Authorization: Bearer <TOKEN>`.
- Códigos: `201` al crear, `200` al consultar/actualizar, `204` al eliminar.
- Errores: `401` sin token, `403` sin permiso, `404` no encontrado, `422` validación.

## Esquemas (resumen)

Login request:
```json
{ "email": "admin@test.com", "password": "Admin123!" }
```

Login response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "uuid": "550e8400-e29b-41d4-a716-446655440000", "email": "admin@test.com", "nombre": "Admin" }
}
```

Task (detail):
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Preparar reporte mensual",
  "descripcion": "Consolidar datos y enviar a finanzas.",
  "completada": false,
  "fechaEntrega": "2026-02-01T10:00:00.000Z",
  "comentarios": "Revisar con el equipo",
  "responsable": "Andrea",
  "tags": ["finanzas", "mensual"],
  "fechaCreacion": "2026-01-20T10:00:00.000Z",
  "fechaActualizacion": "2026-01-21T10:00:00.000Z"
}
```

## Endpoints detallados

Crear sesión (login):
```
POST /sessions
Body: { email, password }
201: { accessToken, user }
```

Consultar usuario:
```
GET /users/:uuid
Headers: Authorization: Bearer <TOKEN>
200: { uuid, email, nombre }
```

Listar tareas:
```
GET /tasks
Headers: Authorization: Bearer <TOKEN>
200: TaskBrief[]
```

Detalle de tarea:
```
GET /tasks/:uuid
Headers: Authorization: Bearer <TOKEN>
200: TaskDetail
```

Crear tarea:
```
POST /tasks
Headers: Authorization: Bearer <TOKEN>
Body: { titulo, descripcion, completada, fechaEntrega, comentarios?, responsable?, tags? }
201: TaskDetail
```

Actualizar tarea (parcial):
```
PATCH /tasks/:uuid
Headers: Authorization: Bearer <TOKEN>
Body: { titulo?, descripcion?, completada?, fechaEntrega?, comentarios?, responsable?, tags? }
200: TaskDetail
```

Eliminar tarea:
```
DELETE /tasks/:uuid
Headers: Authorization: Bearer <TOKEN>
204: (sin body)
```

## Ejemplos curl

Login:

```
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'
```

Crear tarea:

```
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Preparar reporte","descripcion":"Detalle","completada":false,"fechaEntrega":"2026-02-01T10:00:00.000Z","tags":["demo"]}'
```

Listar tareas:

```
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer <TOKEN>"
```

Detalle tarea:

```
curl -X GET http://localhost:3000/tasks/<UUID> \
  -H "Authorization: Bearer <TOKEN>"
```

Actualizar tarea:

```
curl -X PATCH http://localhost:3000/tasks/<UUID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"completada":true}'
```

Eliminar tarea:

```
curl -X DELETE http://localhost:3000/tasks/<UUID> \
  -H "Authorization: Bearer <TOKEN>"
```

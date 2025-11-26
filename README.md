# Aplicación Web con Docker - CRUD de Usuarios

Aplicación web con 3 contenedores Docker que implementa una API REST para gestionar usuarios.

## 🏗️ Arquitectura

- **nginx-gateway**: Recibe peticiones del navegador (Puerto 80)
- **api-service**: Procesa datos (Node.js + Express, Puerto 3000)
- **postgres-db**: Guarda información de usuarios (PostgreSQL, Puerto 5432)

## 📋 Requisitos

- Docker Desktop instalado
- Docker Compose v2 o superior

## 🚀 Instalación y Ejecución

### 1. Clonar o descargar el proyecto

```bash
cd "tercer parcial"
```

### 2. Construir y levantar los contenedores

```bash
docker compose up --build
```

O en modo detached (segundo plano):

```bash
docker compose up --build -d
```

### 3. Verificar que los servicios estén corriendo

```bash
docker compose ps
```

Deberías ver 3 servicios en estado "Up":
- nginx-gateway
- api-service
- postgres-db

## 📡 Endpoints de la API

Base URL: `http://localhost/api/users`

### GET - Obtener todos los usuarios
```
GET http://localhost/api/users
```

### GET - Obtener usuario por ID
```
GET http://localhost/api/users/:id
```

### POST - Crear usuario
```
POST http://localhost/api/users
Content-Type: application/json

{
  "nombre": "Juan",
  "correo": "juan@mail.com"
}
```

### PUT - Actualizar usuario
```
PUT http://localhost/api/users/:id
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@mail.com"
}
```

### DELETE - Eliminar usuario
```
DELETE http://localhost/api/users/:id
```

## 🧪 Probar la API

### Con PowerShell

```powershell
# GET todos los usuarios
Invoke-WebRequest -Uri http://localhost/api/users -UseBasicParsing

# POST crear usuario
Invoke-WebRequest -Uri http://localhost/api/users -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"nombre": "Juan", "correo": "juan@mail.com"}'
```

### Con Postman o curl

Ver el archivo `GUIA_API.md` para ejemplos detallados.

## 🛑 Detener los servicios

```bash
docker compose down
```

## 📁 Estructura del Proyecto

```
tercer parcial/
├── docker-compose.yml          # Configuración de servicios
├── API-SERVICE/
│   ├── Dockerfile              # Imagen del API service
│   ├── package.json            # Dependencias Node.js
│   └── server.js               # Servidor Express
├── nginx/
│   ├── Dockerfile              # Imagen de nginx
│   └── nginx.conf              # Configuración del proxy
└── README.md                   # Este archivo
```

## 🔧 Configuración

### Variables de entorno

Las variables están configuradas en `docker-compose.yml`:

- **DB_HOST**: postgres-db (para api-service)
- **POSTGRES_DB**: crud_db
- **POSTGRES_USER**: postgres
- **POSTGRES_PASSWORD**: postgres

### Puertos

- **80**: nginx-gateway (acceso desde el navegador)
- **3000**: api-service (interno, no expuesto)
- **5432**: postgres-db (interno, no expuesto)

## 📚 Documentación Adicional

- `GUIA_API.md`: Guía completa de uso de la API con ejemplos

## ⚠️ Notas

- La base de datos se crea automáticamente al iniciar el contenedor
- La tabla `users` se crea automáticamente al iniciar el api-service
- Los datos se pierden al eliminar los contenedores (no hay volúmenes persistentes)

## 🐛 Solución de Problemas

### Los contenedores no inician

```bash
docker compose logs
```

### Error de conexión a la base de datos

Verifica que postgres-db esté en estado "healthy":
```bash
docker compose ps
```

### Puerto 80 ya en uso

Modifica el puerto en `docker-compose.yml`:
```yaml
ports: ['8080:80']  # Cambia 80 por 8080
```

## 📝 Autor

Proyecto desarrollado para el tercer parcial.


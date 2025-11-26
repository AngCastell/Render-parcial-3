# Guía de Uso de la API - CRUD de Usuarios

## 🌐 Base URL
```
http://localhost/api/users
```

---

## 📋 Endpoints Disponibles

### 1. GET - Obtener todos los usuarios

**Endpoint:** `GET http://localhost/api/users`

**PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost/api/users -UseBasicParsing | Select-Object -ExpandProperty Content
```

**curl (si está instalado):**
```bash
curl http://localhost/api/users
```

**Respuesta:**
```json
[
  {"id": 1, "nombre": "Juan", "correo": "juan@mail.com"},
  {"id": 2, "nombre": "María", "correo": "maria@mail.com"}
]
```

---

### 2. GET - Obtener un usuario por ID

**Endpoint:** `GET http://localhost/api/users/:id`

**Ejemplo:** Obtener usuario con ID 1

**PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost/api/users/1 -UseBasicParsing | Select-Object -ExpandProperty Content
```

**curl:**
```bash
curl http://localhost/api/users/1
```

**Respuesta:**
```json
{"id": 1, "nombre": "Juan", "correo": "juan@mail.com"}
```

---

### 3. POST - Crear un nuevo usuario

**Endpoint:** `POST http://localhost/api/users`

**Body (JSON):**
```json
{
  "nombre": "Juan",
  "correo": "juan@mail.com"
}
```

**PowerShell:**
```powershell
$body = @{
    nombre = "Juan"
    correo = "juan@mail.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost/api/users -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body `
  -UseBasicParsing | Select-Object StatusCode, Content
```

**O de forma más simple:**
```powershell
Invoke-WebRequest -Uri http://localhost/api/users -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"nombre": "Juan", "correo": "juan@mail.com"}' `
  -UseBasicParsing | Select-Object StatusCode, Content
```

**curl:**
```bash
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan", "correo": "juan@mail.com"}'
```

**Respuesta (201 Created):**
```json
{"id": 1, "nombre": "Juan", "correo": "juan@mail.com"}
```

---

### 4. PUT - Actualizar un usuario existente

**Endpoint:** `PUT http://localhost/api/users/:id`

**Ejemplo:** Actualizar usuario con ID 1

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@mail.com"
}
```

**PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost/api/users/1 -Method PUT `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"nombre": "Juan Pérez", "correo": "juan.perez@mail.com"}' `
  -UseBasicParsing | Select-Object StatusCode, Content
```

**curl:**
```bash
curl -X PUT http://localhost/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Pérez", "correo": "juan.perez@mail.com"}'
```

**Respuesta (200 OK):**
```json
{"id": 1, "nombre": "Juan Pérez", "correo": "juan.perez@mail.com"}
```

---

### 5. DELETE - Eliminar un usuario

**Endpoint:** `DELETE http://localhost/api/users/:id`

**Ejemplo:** Eliminar usuario con ID 1

**PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost/api/users/1 -Method DELETE `
  -UseBasicParsing | Select-Object StatusCode, Content
```

**curl:**
```bash
curl -X DELETE http://localhost/api/users/1
```

**Respuesta (200 OK):**
```json
{"message": "Usuario eliminado"}
```

---

## 📝 Ejemplos Completos en PowerShell

### Script completo para probar todos los endpoints:

```powershell
# 1. GET - Obtener todos los usuarios
Write-Host "=== GET Todos los usuarios ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri http://localhost/api/users -UseBasicParsing
$response.Content | ConvertFrom-Json | Format-Table

# 2. POST - Crear un nuevo usuario
Write-Host "`n=== POST Crear usuario ===" -ForegroundColor Green
$newUser = @{
    nombre = "Pedro"
    correo = "pedro@mail.com"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost/api/users -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $newUser `
  -UseBasicParsing
$createdUser = $response.Content | ConvertFrom-Json
Write-Host "Usuario creado:" -ForegroundColor Yellow
$createdUser | Format-List

# 3. GET - Obtener usuario por ID
Write-Host "`n=== GET Usuario por ID ===" -ForegroundColor Green
$userId = $createdUser.id
$response = Invoke-WebRequest -Uri "http://localhost/api/users/$userId" -UseBasicParsing
$user = $response.Content | ConvertFrom-Json
$user | Format-List

# 4. PUT - Actualizar usuario
Write-Host "`n=== PUT Actualizar usuario ===" -ForegroundColor Green
$updateData = @{
    nombre = "Pedro García"
    correo = "pedro.garcia@mail.com"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost/api/users/$userId" -Method PUT `
  -Headers @{"Content-Type"="application/json"} `
  -Body $updateData `
  -UseBasicParsing
$updatedUser = $response.Content | ConvertFrom-Json
Write-Host "Usuario actualizado:" -ForegroundColor Yellow
$updatedUser | Format-List

# 5. DELETE - Eliminar usuario
Write-Host "`n=== DELETE Eliminar usuario ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri "http://localhost/api/users/$userId" -Method DELETE `
  -UseBasicParsing
Write-Host $response.Content -ForegroundColor Yellow

# 6. Verificar que fue eliminado
Write-Host "`n=== Verificar eliminación ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri http://localhost/api/users -UseBasicParsing
$users = $response.Content | ConvertFrom-Json
Write-Host "Usuarios restantes:" -ForegroundColor Yellow
$users | Format-Table
```

---

## 🧪 Usando Postman

### Configuración en Postman:

1. **GET Todos los usuarios:**
   - Método: `GET`
   - URL: `http://localhost/api/users`
   - Headers: (ninguno necesario)

2. **GET Usuario por ID:**
   - Método: `GET`
   - URL: `http://localhost/api/users/1`
   - Headers: (ninguno necesario)

3. **POST Crear usuario:**
   - Método: `POST`
   - URL: `http://localhost/api/users`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "nombre": "Juan",
       "correo": "juan@mail.com"
     }
     ```

4. **PUT Actualizar usuario:**
   - Método: `PUT`
   - URL: `http://localhost/api/users/1`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "nombre": "Juan Pérez",
       "correo": "juan.perez@mail.com"
     }
     ```

5. **DELETE Eliminar usuario:**
   - Método: `DELETE`
   - URL: `http://localhost/api/users/1`
   - Headers: (ninguno necesario)

---

## 🔍 Códigos de Estado HTTP

- **200 OK**: Operación exitosa (GET, PUT, DELETE)
- **201 Created**: Recurso creado exitosamente (POST)
- **404 Not Found**: Usuario no encontrado
- **500 Internal Server Error**: Error del servidor

---

## ⚠️ Notas Importantes

1. **Todos los endpoints requieren que el servidor esté corriendo:**
   ```powershell
   docker compose -f "C:\Users\Angel Castellano\Documents\tercer parcial\docker-compose.yml" ps
   ```

2. **El campo `id` se genera automáticamente** al crear un usuario (no lo incluyas en el POST)

3. **Para PUT y DELETE necesitas el ID del usuario** que quieres modificar/eliminar

4. **El campo `correo` debe ser un email válido** (aunque la API no valida el formato actualmente)


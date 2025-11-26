# Guía de Despliegue en Render.com

## 📋 Requisitos Previos
- ✅ Código subido a GitHub: `https://github.com/AngCastell/Render-parcial-3`
- ✅ Cuenta en Render.com

---

## PASO 1: Crear Base de Datos PostgreSQL

### 1.1 Crear cuenta en Render.com
1. Ve a https://render.com
2. Crea una cuenta o inicia sesión con GitHub

### 1.2 Crear base de datos PostgreSQL
1. En el dashboard, haz clic en **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configuración:
   - **Name**: `crud-db`
   - **Database**: `crud_db` (o déjalo por defecto)
   - **User**: Se genera automáticamente
   - **Region**: Elige la más cercana
   - **Plan**: Free (o el que prefieras)
4. Haz clic en **"Create Database"**
5. Espera a que se cree (1-2 minutos)

### 1.3 Copiar Internal Database URL
1. En la página de la base de datos, ve a la pestaña **"Connections"**
2. Copia la **"Internal Database URL"** (formato: `postgres://user:password@host:port/database`)
3. **Guárdala**, la usarás en el siguiente paso

### 1.4 Crear tabla (Opcional - el código ya la crea automáticamente)
El código ya crea la tabla automáticamente, pero si quieres crearla manualmente:
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    correo TEXT
);
```

---

## PASO 2: Desplegar el API Service

### 2.1 Crear Web Service para api-service
1. En el dashboard, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. **Conectar repositorio:**
   - Conecta tu cuenta de GitHub si no lo has hecho
   - Selecciona el repositorio: `AngCastell/Render-parcial-3`
4. **Configuración del servicio:**
   - **Name**: `api-service`
   - **Region**: La misma que la base de datos
   - **Branch**: `main`
   - **Root Directory**: `API-SERVICE` ⚠️ **IMPORTANTE**
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile` (está en la raíz de API-SERVICE)
5. **Variables de entorno:**
   - Haz clic en **"Advanced"**
   - Agrega la variable:
     - **Key**: `DATABASE_URL`
     - **Value**: Pega la "Internal Database URL" que copiaste antes
6. **Plan**: Free (o el que prefieras)
7. Haz clic en **"Create Web Service"**
8. Espera a que se despliegue (5-10 minutos)

### 2.2 Obtener la URL del api-service
1. Una vez desplegado, copia la **URL del servicio** (ej: `https://api-service-xxxx.onrender.com`)
2. **Guárdala** para el siguiente paso

---

## PASO 3: Desplegar el Nginx Gateway

### 3.1 Crear Web Service para nginx-gateway
1. En el dashboard, haz clic en **"New +"**
2. Selecciona **"Web Service"**
3. **Conectar repositorio:**
   - Selecciona el mismo repositorio: `AngCastell/Render-parcial-3`
4. **Configuración del servicio:**
   - **Name**: `nginx-gateway`
   - **Region**: La misma que los otros servicios
   - **Branch**: `main`
   - **Root Directory**: `nginx` ⚠️ **IMPORTANTE**
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile` (está en la raíz de nginx)
5. **Variables de entorno:**
   - Haz clic en **"Advanced"**
   - Agrega la variable:
     - **Key**: `API_SERVICE_URL`
     - **Value**: La URL del api-service que copiaste (ej: `https://api-service-xxxx.onrender.com`)
6. **Plan**: Free (o el que prefieras)
7. Haz clic en **"Create Web Service"**
8. Espera a que se despliegue (5-10 minutos)

---

## PASO 4: Verificar el Despliegue

### 4.1 Probar la API
Una vez desplegado, obtén la URL del nginx-gateway (ej: `https://nginx-gateway-xxxx.onrender.com`)

#### Con PowerShell:
```powershell
# GET todos los usuarios
Invoke-WebRequest -Uri https://nginx-gateway-xxxx.onrender.com/api/users -UseBasicParsing

# POST crear usuario
Invoke-WebRequest -Uri https://nginx-gateway-xxxx.onrender.com/api/users -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"nombre": "Juan", "correo": "juan@mail.com"}'

# GET usuario por ID
Invoke-WebRequest -Uri https://nginx-gateway-xxxx.onrender.com/api/users/1 -UseBasicParsing
```

#### Con curl:
```bash
# GET todos los usuarios
curl https://nginx-gateway-xxxx.onrender.com/api/users

# POST crear usuario
curl -X POST https://nginx-gateway-xxxx.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan", "correo": "juan@mail.com"}'

# GET usuario por ID
curl https://nginx-gateway-xxxx.onrender.com/api/users/1
```

---

## 📝 Resumen de Configuración

| Servicio | Root Directory | Environment | Variables de Entorno |
|----------|---------------|-------------|---------------------|
| **crud-db** | - | PostgreSQL | - |
| **api-service** | `API-SERVICE` | Docker | `DATABASE_URL` = Internal Database URL |
| **nginx-gateway** | `nginx` | Docker | `API_SERVICE_URL` = URL del api-service |

---

## ⚠️ Notas Importantes

1. **Root Directory**: Debe ser la carpeta específica (`API-SERVICE` o `nginx`), NO la raíz del repositorio.

2. **Internal Database URL**: Usa la URL **interna** para conectar desde api-service a la base de datos (más rápida y segura).

3. **API_SERVICE_URL**: Usa la URL **pública** del api-service (con `https://`).

4. **Tiempo de despliegue**: Cada servicio puede tardar 5-10 minutos en desplegarse.

5. **Plan Free**: Los servicios pueden "dormir" después de 15 minutos de inactividad y tardar unos segundos en "despertar".

6. **Logs**: Puedes ver los logs de cada servicio en su página de Render para diagnosticar problemas.

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de usar la **Internal Database URL**, no la externa

### Error: "502 Bad Gateway" en nginx
- Verifica que `API_SERVICE_URL` esté configurada correctamente
- Asegúrate de que el api-service esté desplegado y funcionando
- Revisa los logs del api-service en Render

### El servicio no inicia
- Revisa los logs en la página del servicio en Render
- Verifica que el Root Directory sea correcto
- Asegúrate de que el Dockerfile esté en la ubicación correcta

---

## ✅ Checklist Final

- [ ] Base de datos PostgreSQL creada
- [ ] Internal Database URL copiada
- [ ] API Service desplegado con `DATABASE_URL` configurada
- [ ] URL del API Service copiada
- [ ] Nginx Gateway desplegado con `API_SERVICE_URL` configurada
- [ ] API probada y funcionando

---

¡Listo! Tu aplicación debería estar funcionando en Render.com 🚀


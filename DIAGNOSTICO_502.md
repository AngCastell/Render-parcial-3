# 🔍 Diagnóstico del Error 502 Bad Gateway

## ¿Qué significa el error 502?

El error **502 Bad Gateway** significa que nginx (el gateway) no puede conectarse al api-service (el backend). Esto puede deberse a varias razones.

## Pasos de Diagnóstico

### 1. Verificar que el api-service esté funcionando ✅

**En Render Dashboard:**
1. Ve al servicio `api-service`
2. Verifica que el estado sea **"Live"** (no "Sleeping" o "Failed")
3. Ve a la pestaña **"Logs"**
4. Busca errores o mensajes de conexión a la base de datos

**Prueba directa del api-service:**
```powershell
# Reemplaza con la URL real de tu api-service
# La URL debería ser algo como: https://api-service-xxxx.onrender.com
Invoke-WebRequest -Uri https://api-service-xxxx.onrender.com/api/users -UseBasicParsing
```

**Si esto funciona:** El api-service está bien, el problema está en nginx.
**Si esto NO funciona:** El problema está en el api-service (ver paso 2).

### 2. Verificar la variable de entorno API_SERVICE_URL 🔧

**En Render Dashboard:**
1. Ve al servicio `nginx-gateway`
2. Ve a la pestaña **"Environment"** o **"Environment Variables"**
3. Verifica que exista:
   - **Key**: `API_SERVICE_URL`
   - **Value**: Debe ser la URL completa del api-service
     - ✅ Correcto: `https://api-service-xxxx.onrender.com`
     - ❌ Incorrecto: `http://api-service:3000` (solo funciona en Docker local)
     - ❌ Incorrecto: `api-service-xxxx.onrender.com` (falta https://)

### 3. Verificar los logs de nginx-gateway 📋

**En Render Dashboard:**
1. Ve al servicio `nginx-gateway`
2. Ve a la pestaña **"Logs"**
3. Busca estos mensajes al inicio (cuando se despliega):
   - ✅ `Configurado backend URL: https://...` → El script funcionó
   - ✅ `Configurado SSL hostname: ...` → SSL configurado correctamente
   - ❌ `API_SERVICE_URL no configurada` → La variable no está configurada
   - ❌ Errores de conexión o SSL

### 4. Verificar que ambos servicios estén en la misma región 🌍

**En Render Dashboard:**
1. Verifica la región de `api-service`
2. Verifica la región de `nginx-gateway`
3. **Deben estar en la misma región** para mejor rendimiento

### 5. Redesplegar ambos servicios 🔄

**api-service:**
1. Ve al servicio `api-service`
2. Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**
3. Espera a que termine (5-10 minutos)

**nginx-gateway:**
1. Ve al servicio `nginx-gateway`
2. Haz clic en **"Manual Deploy"** → **"Deploy latest commit"**
3. Espera a que termine (5-10 minutos)

## Soluciones Comunes

### Problema: API_SERVICE_URL no está configurada

**Solución:**
1. Ve a `nginx-gateway` → **"Environment"**
2. Agrega la variable:
   - **Key**: `API_SERVICE_URL`
   - **Value**: `https://api-service-xxxx.onrender.com` (tu URL real)
3. Guarda y redesplega

### Problema: El api-service no responde

**Solución:**
1. Verifica los logs del `api-service`
2. Verifica que `DATABASE_URL` esté configurada
3. Verifica que la base de datos esté funcionando
4. Prueba acceder directamente al api-service

### Problema: Error de SSL handshake

**Solución:**
Ya está configurado `proxy_ssl_verify off`, pero verifica:
1. Que el script `start.sh` esté actualizando `proxy_ssl_name` correctamente
2. Revisa los logs para ver si aparece "Configurado SSL hostname"

### Problema: El servicio está "Sleeping"

**Solución:**
1. En Render, haz clic en el servicio para "despertarlo"
2. Espera 10-30 segundos para que se active
3. Prueba de nuevo

## Comandos de Prueba

### 1. Probar api-service directamente:
```powershell
# GET usuarios
Invoke-WebRequest -Uri https://api-service-xxxx.onrender.com/api/users -UseBasicParsing

# POST crear usuario
Invoke-WebRequest -Uri https://api-service-xxxx.onrender.com/api/users -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"nombre": "Test", "correo": "test@test.com"}'
```

### 2. Probar nginx-gateway:
```powershell
# GET usuarios
Invoke-WebRequest -Uri https://nginx-gateway-xxxx.onrender.com/api/users -UseBasicParsing

# POST crear usuario
Invoke-WebRequest -Uri https://nginx-gateway-xxxx.onrender.com/api/users -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"nombre": "Test", "correo": "test@test.com"}'
```

## Checklist de Verificación

- [ ] api-service está en estado "Live"
- [ ] api-service responde directamente en su URL
- [ ] `DATABASE_URL` está configurada en api-service
- [ ] `API_SERVICE_URL` está configurada en nginx-gateway
- [ ] `API_SERVICE_URL` tiene la URL completa con `https://`
- [ ] Los logs de nginx-gateway muestran "Configurado backend URL"
- [ ] Ambos servicios están en la misma región
- [ ] Se hizo un despliegue manual reciente

## Si Nada Funciona

1. **Verifica la URL exacta del api-service:**
   - Copia la URL desde el dashboard de Render
   - Asegúrate de que sea la URL pública (no interna)
   - Verifica que no tenga trailing slash al final

2. **Prueba con Docker localmente:**
   ```powershell
   docker compose up
   # Luego prueba en http://localhost/api/users
   ```
   Si funciona localmente, el problema está en la configuración de Render.

3. **Revisa los logs en tiempo real:**
   - Abre los logs de nginx-gateway
   - Haz una petición
   - Observa qué errores aparecen


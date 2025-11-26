# Solución: Problema con Git en Windows

## 🔴 Problema Detectado
Git no está instalado en tu sistema Windows, por eso aparece el error:
```
git: El término 'git' no se reconoce como nombre de un cmdlet...
```

## ✅ Solución Paso a Paso

### Paso 1: Instalar Git

#### Opción A: Descargar desde el sitio oficial (Recomendado)

1. **Abre tu navegador** y ve a: https://git-scm.com/download/win
2. **Descarga** el instalador (se descargará automáticamente la versión más reciente)
3. **Ejecuta** el instalador descargado
4. **Durante la instalación:**
   - Acepta las opciones por defecto (Next, Next, Next...)
   - **IMPORTANTE**: En la pantalla "Choosing the default editor", puedes dejar "Nano" o cambiar a "Visual Studio Code" si prefieres
   - En "Adjusting your PATH environment", selecciona **"Git from the command line and also from 3rd-party software"** (recomendado)
   - Completa la instalación

#### Opción B: Instalar usando winget (si está disponible)

Abre PowerShell como Administrador y ejecuta:
```powershell
winget install --id Git.Git -e --source winget
```

#### Opción C: Instalar usando Chocolatey (si lo tienes instalado)

```powershell
choco install git
```

---

### Paso 2: Verificar la Instalación

Después de instalar Git, **cierra y vuelve a abrir** VS Code y la terminal.

Luego, en la terminal de VS Code, ejecuta:
```powershell
git --version
```

Deberías ver algo como: `git version 2.xx.x.windows.x`

---

### Paso 3: Configurar tu Identidad en Git

Una vez que Git esté instalado, necesitas configurar tu nombre y email:

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

**Ejemplo:**
```powershell
git config --global user.name "Angel Castellano"
git config --global user.email "angel@ejemplo.com"
```

---

### Paso 4: Verificar la Configuración

Para verificar que todo está configurado correctamente:

```powershell
git config --global --list
```

Deberías ver tus configuraciones de `user.name` y `user.email`.

---

## 🎯 Después de la Instalación

Una vez completados estos pasos:

1. **Cierra VS Code completamente**
2. **Vuelve a abrir VS Code**
3. El diálogo de configuración de Git debería desaparecer
4. Podrás hacer commits normalmente desde el panel de Source Control

---

## 📝 Notas Adicionales

- Si después de instalar Git, el comando aún no funciona, **reinicia tu computadora** para que los cambios en el PATH surtan efecto
- Si prefieres no usar Git, puedes cerrar el diálogo de VS Code haciendo clic en "Cancel", pero no podrás usar las funciones de control de versiones

---

## ❓ ¿Necesitas Ayuda?

Si después de seguir estos pasos aún tienes problemas:
1. Verifica que Git esté en el PATH ejecutando: `$env:PATH -split ';' | Select-String git`
2. Reinicia tu computadora
3. Verifica que la instalación fue exitosa ejecutando: `where.exe git`


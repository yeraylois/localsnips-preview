# LocalSnips — Vista previa

<p align="center">
  <img src="logo.png" alt="Logo de LocalSnips" width="120" height="120">
</p>

<p align="center">
  <strong>Vista previa en el navegador, de alta fidelidad, del UI/UX de LocalSnips</strong><br/>
  <sub>Este repositorio contiene solo artefactos de compilación (HTML/CSS/JS). No se incluye el código fuente.</sub>
</p>

<p align="center">
  <a href="https://yeraylois.github.io/localsnips-preview/"><strong>▶ Ver demo en vivo</strong></a>
</p>

---

## Qué es este repositorio

Este repo contiene **únicamente la salida del export estático** de LocalSnips (la UI web compilada).  
Existe exclusivamente para ofrecer una **vista previa pública y sin configuración** de la experiencia del producto.

✅ Incluye:

- Artefactos estáticos (HTML/CSS/JS) del sitio de vista previa
- Flujos e interacciones de UI/UX diseñados para mostrar la app

❌ No incluye:

- El código fuente de LocalSnips
- Servicios backend, stack Docker, base de datos ni lógica de workers
- Datos privados ni configuración de producción

> La demo usa **datos simulados** y se ejecuta completamente **en el cliente**.

---

## Vista previa adaptada a móvil (nuevo)

Esta vista previa incluye ahora un **responsive mínimo** para que **no se rompa en móviles/tablets** (p. ej., iPhone 11+).  
Aun así, LocalSnips es un producto **pensado primero para macOS**, por lo que en móvil está simplificado.

En móvil puedes esperar:

- Un flujo simplificado en una sola columna (Menú / Lista / Detalle)
- Un banner/mensaje indicando que la experiencia está optimizada para macOS

> Nota: al ser una vista previa estática y una capa móvil intencionalmente mínima, puede haber pequeños fallos visuales o casos límite de maquetación. Si algo se ve raro, prueba a recargar o abrirlo en escritorio.

---

## Demo en vivo

- **URL de la vista previa:** https://yeraylois.github.io/localsnips-preview/
- **Contacto (licencias / acceso a la app completa en macOS):** yerayloissanchez@gmail.com

---

## Qué puedes probar en la vista previa

### 🧠 Exploración del conocimiento

- Navegar por snippets, colecciones y etiquetas
- Recorrer la UI e inspeccionar las vistas de detalle de un snippet

### 🔎 Búsqueda y filtrado

- Búsqueda en cliente sobre los items de demo
- Filtros por colecciones/etiquetas y vistas tipo “recientes”

### 🎨 Temas dinámicos

- Probar modos Claro / Oscuro / Sistema
- Probar el modo **Custom** para previsualizar controles de paleta y “tint”

### 🛠️ Service Manager (simulación)

Recreación de alta fidelidad del panel nativo de macOS usado para gestionar el stack local en la app real (estados y transiciones están simulados en la vista previa).

---

## Pistas de navegación

- **Dashboard:** hub principal de snippets y actividad reciente
- **Graph View:** exploración interactiva del grafo de conocimiento (dataset demo)
- **Service Manager:** simulación del panel de control de infraestructura

---

## Limitaciones (importante)

Como es un build estático de vista previa:

- No hay almacenamiento persistente (al recargar puede resetear el estado demo)
- No hay procesamiento real de IA ni indexado en segundo plano
- No hay interacción real con Docker / PostgreSQL / Redis
- No hay autenticación / cuentas de usuario

Si quieres evaluar la app completa en macOS (wrapper nativo + servicios locales), solicita acceso por email.

---

## Propiedad y licencia

**Copyright © 2025 Yeray Lois Sánchez. Todos los derechos reservados.**

Este repositorio es **propietario**.  
**No se concede ninguna licencia** para usar, copiar, modificar, distribuir, sublicenciar o crear obras derivadas a partir de este repositorio o su contenido.

Si quieres una licencia comercial, partnership o acceso de evaluación al producto completo, contacta con:

- **yerayloissanchez@gmail.com**

---

## Aviso de marca

“LocalSnips” y los nombres asociados, el diseño de UI/UX y los assets forman parte de la identidad del proyecto LocalSnips.  
No se permite el uso no autorizado de la marca ni la creación de trabajos derivados.

---

<p align="center">
  <sub>LocalSnips © 2025 Yeray Lois Sánchez — Build de vista previa propietario. Todos los derechos reservados.</sub>
</p>

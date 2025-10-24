# 🎃 Dulce Juerga - Landing Page

Landing page para el evento de Halloween "Dulce Juerga" - Una experiencia web terrorífica y optimizada para conversión.

## 📋 Descripción

Sitio web estático desarrollado con Next.js 13 para promocionar el evento de Halloween "Dulce Juerga". Presenta un diseño terrorífico con efectos visuales impactantes, integración con WhatsApp para venta de entradas, y optimización para conversión mediante técnicas de neuromarketing.

**Evento:** 31 de Octubre, 2024
**Ubicación:** Tinkuy Eventos - Lotización Columbia, Cajamarca 06001
**Aforo:** 150 personas

## ✨ Características

- 🎨 Diseño terrorífico con paleta de colores rojo y negro
- 📱 Diseño responsive mobile-first
- ⚡ Sitio estático optimizado (exportación estática de Next.js)
- 💬 Integración directa con WhatsApp para compra de entradas
- 🎯 Técnicas de neuromarketing y FOMO (Fear of Missing Out)
- 🏆 Sistema de concursos con premios cronológicos
- 🎭 Animaciones CSS personalizadas (float, glow-pulse, blood-drip, flicker)
- 🌙 Modo oscuro forzado para mantener estética terrorífica

## 🛠️ Tecnologías

- **Framework:** Next.js 13.5.4 (App Router)
- **Lenguaje:** TypeScript 5.2.2
- **Estilos:** Tailwind CSS 3.3.3
- **Componentes UI:** shadcn/ui (Radix UI)
- **Iconos:** Lucide React
- **Tipografías:** Creepster, Nosifer (Google Fonts)

## 🚀 Instalación

### Prerrequisitos

- Node.js 18.x o superior
- npm o yarn

### Pasos

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd dulce-juerga-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## 📦 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Genera build de producción (exportación estática)
npm start            # Inicia servidor de producción
npm run lint         # Ejecuta ESLint
npm run typecheck:layout    # Verifica tipos de TypeScript en layout
npm run typecheck:page      # Verifica tipos de TypeScript en página
```

## 📁 Estructura del Proyecto

```
dulce-juerga-app/
├── app/
│   ├── layout.tsx          # Layout principal con metadata SEO
│   ├── page.tsx            # Página principal (landing page)
│   ├── globals.css         # Estilos globales y animaciones
│   └── favicon.ico
├── components/
│   └── ui/                 # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       └── badge.tsx
├── lib/
│   └── utils.ts           # Utilidades (cn para classnames)
├── public/
│   └── hero-background.webp  # Imagen de fondo del Hero
├── CLAUDE.md              # Documentación para Claude Code
└── README.md              # Este archivo
```

## 🎨 Secciones de la Landing Page

### 1. Hero Section
- Título principal con tipografías terroríficas
- Imagen de fondo con overlay oscuro
- Badge con fecha del evento
- CTA principal para ver entradas
- Efectos de partículas flotantes

### 2. About Section
- Descripción del evento
- Información de ubicación con enlace a Google Maps
- Detalles de horario y aforo

### 3. Tipos de Entrada
- **Entrada Libre:** Gratis hasta medianoche, S/20 después
- **JUERGÓN VIP:** S/15 con entrada garantizada + S/10 en crédito + shot gratis
- Comparación de valor y beneficios
- CTA con WhatsApp para cada tipo

### 4. Ofertas Especiales
- Descuentos progresivos en bebidas (10% hasta 11PM, 20% después)
- Código promocional
- Destacado visual con efectos de glow

### 5. Premios
4 concursos cronológicos:
- 🎃 **11:30 PM** - Mejor disfraz (S/50)
- 👻 **12:30 AM** - Shot más rápido (S/80)
- 💃 **1:30 AM** - Batalla de baile (S/100)
- 🍾 **2:30 AM** - Gran sorteo final (S/400)

### 6. CTA Final
- Llamado a la acción urgente
- Recordatorio de aforo limitado

### 7. Footer
- Información de copyright
- Enlaces rápidos a secciones

## 🎨 Personalización

### Cambiar Imagen de Fondo del Hero

Reemplaza el archivo `public/hero-background.webp` con tu propia imagen. Mantén el mismo nombre de archivo o actualiza la referencia en `app/page.tsx` línea 36.

### Modificar Colores

Los colores principales están definidos en `app/globals.css`:
- Rojo principal: `rgb(220 38 38)` (red-600)
- Negro: `rgb(0 0 0)`
- Naranja: `rgb(249 115 22)` (orange-600)

### Actualizar Número de WhatsApp

Busca y reemplaza `51927040637` en `app/page.tsx` con tu número (incluye código de país sin +).

### Cambiar Información del Evento

Edita los siguientes valores en `app/page.tsx`:
- Fecha del evento (Badge con fecha)
- Ubicación (enlace de Google Maps)
- Precios de entradas
- Horarios de concursos

## 🔧 Configuración

### Next.js

El proyecto está configurado para exportación estática:

```typescript
// next.config.js
const nextConfig = {
  output: 'export',
}
```

### TypeScript

Modo estricto habilitado en `tsconfig.json`.

### Tailwind CSS

Configuración personalizada en `tailwind.config.ts`:
- Variables CSS para modo oscuro
- Animaciones personalizadas
- Breakpoints responsivos: sm (640px), md (768px), lg (1024px)

## 📱 Responsive Design

El sitio está optimizado para todos los dispositivos:
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

Todos los componentes utilizan clases responsive de Tailwind (sm:, md:, lg:) para adaptarse perfectamente a cualquier pantalla.

## 🚀 Deployment

### Exportación Estática

```bash
npm run build
```

Genera la carpeta `out/` con archivos estáticos listos para deployment.

### Opciones de Hosting

- **Vercel:** Deployment automático (recomendado para Next.js)
- **Netlify:** Drag & drop de la carpeta `out/`
- **GitHub Pages:** Hosting gratuito de sitios estáticos
- **Servidor web tradicional:** Subir contenido de `out/` vía FTP

## 📄 Licencia

Este proyecto es privado y pertenece al evento "Dulce Juerga".

## 👥 Contacto

Para adquirir entradas: [WhatsApp +51 927040637](https://wa.me/51927040637)

---

🎃 **Dulce Juerga 2024** - La fiesta de Halloween más terrorífica del año

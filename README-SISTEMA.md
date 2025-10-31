# 🎃 Halloween Party - Sistema Completo de Gestión

Sistema integral de gestión de eventos que incluye landing page pública + dashboard administrativo completo con módulos de inventario, ventas, DJ requests, carta digital y estadísticas.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: MySQL 8.0+ con Prisma ORM
- **Autenticación**: NextAuth.js v5
- **UI**: Tailwind CSS + shadcn/ui
- **Almacenamiento**: AWS S3
- **Validación**: Zod + React Hook Form
- **Gráficos**: Recharts

## 📋 Requisitos Previos

- Node.js 18+ y pnpm
- MySQL 8.0+
- Cuenta de AWS con bucket S3 configurado

## 🔧 Instalación

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/halloween_party"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-de-minimo-32-caracteres"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_S3_BUCKET_NAME="tu-bucket-name"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configurar Base de Datos

```bash
# Crear la base de datos MySQL
mysql -u root -p
CREATE DATABASE halloween_party;
EXIT;

# Generar Prisma Client
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev --name init

# Poblar con datos de prueba
pnpm prisma db seed
```

### 4. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 👤 Credenciales de Prueba

Después de ejecutar el seed:

- **Admin**: `admin@halloween.com` / `admin123`
- **Bartender 1**: `carlos@halloween.com` / `bartender123`
- **Bartender 2**: `maria@halloween.com` / `bartender123`
- **Cajero**: `cajero@halloween.com` / `bartender123`

## 📁 Estructura del Proyecto

```
halloween-party/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   │   └── login/
│   ├── (dashboard)/       # Rutas protegidas del dashboard
│   │   └── dashboard/
│   │       ├── inventario/
│   │       ├── ventas/
│   │       ├── canciones/
│   │       └── config/
│   ├── (public)/          # Rutas públicas
│   │   ├── carta/
│   │   └── dj-requests/
│   └── api/               # API Routes
│       ├── auth/
│       ├── products/
│       ├── sales/
│       ├── songs/
│       └── config/
├── components/            # Componentes React
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Componentes del dashboard
│   └── public/           # Componentes públicos
├── src/
│   ├── lib/              # Utilidades
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── s3.ts
│   │   └── validations.ts
│   ├── types/            # TypeScript types
│   └── hooks/            # Custom React hooks
├── prisma/
│   ├── schema.prisma     # Modelo de datos
│   └── seed.ts           # Datos de prueba
└── public/               # Archivos estáticos
```

## 🎯 Módulos del Sistema

### ✅ Módulo 0: Configuración Base
- Next.js 14 con App Router
- TypeScript configurado
- Prisma ORM con MySQL
- AWS S3 configurado
- shadcn/ui con 47+ componentes

### ✅ Módulo 1: Autenticación
- NextAuth.js v5
- Login con email y contraseña
- 3 roles: Admin, Bartender, Cajero
- Protección de rutas con middleware
- Sesiones con JWT

### 🚧 Módulo 2: Gestión de Inventario (Siguiente)
- CRUD de productos
- Upload de imágenes a S3
- Control de stock
- Alertas de stock bajo
- Filtros y búsqueda

### 📋 Módulo 3: Punto de Venta
- Carrito de venta
- 5 métodos de pago (Efectivo, Yape, Plin, Tarjeta, Pulsera)
- Cálculo de descuentos automático
- Validación de stock
- Historial de ventas

### 🎵 Módulo 4: DJ Requests
- 3 tipos de solicitudes (Libre, Prioritaria, VIP)
- Sistema de votos para canciones libres
- Aprobación de admin para solicitudes pagadas
- Cola de reproducción ordenada por prioridad

### 📱 Módulo 5: Carta Digital Pública
- Menú responsive con precios actualizados
- Calculadora de división de gastos
- Compartir resumen por WhatsApp
- Descuentos aplicados en tiempo real

### ⚙️ Módulo 6: Configuración del Sistema
- Descuentos por horario
- Precios de DJ requests
- Cuentas de pago (Yape/Plin/Transferencia)
- Datos del evento

### 📊 Módulo 7: Dashboard de Estadísticas
- KPIs en tiempo real
- Gráficos de ventas por hora
- Productos más vendidos
- Ventas por método de pago
- Export de reportes a PDF

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Iniciar servidor de desarrollo
pnpm build                  # Build de producción
pnpm start                  # Iniciar servidor de producción
pnpm lint                   # Ejecutar linter
pnpm typecheck              # Verificar tipos de TypeScript

# Prisma
pnpm prisma studio          # Abrir Prisma Studio (GUI para DB)
pnpm prisma generate        # Generar Prisma Client
pnpm prisma migrate dev     # Crear migración
pnpm prisma db push         # Push schema sin migración
pnpm prisma db seed         # Ejecutar seed
pnpm prisma migrate reset   # Reset DB y ejecutar seed
```

## 🔒 Configuración de AWS S3

1. Crear un bucket en AWS S3
2. Configurar permisos de lectura pública para objetos
3. Configurar CORS:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": []
  }
]
```

4. Crear usuario IAM con política S3FullAccess
5. Obtener Access Key ID y Secret Access Key

## 🔄 Estado Actual del Desarrollo

✅ **Completado:**
- Configuración base de Next.js 14
- Schema de Prisma con todos los modelos
- Sistema de autenticación con NextAuth.js v5
- Middleware de protección de rutas
- Utilidades base (S3, validaciones, types)
- Seed data con usuarios y productos de prueba

🚧 **En Desarrollo:**
- API Routes para todos los módulos
- Componentes del dashboard
- Interfaz de usuario completa

📋 **Pendiente:**
- Sistema completo de inventario
- Punto de venta (POS)
- DJ Requests
- Carta digital pública
- Configuración del sistema
- Dashboard de estadísticas

## 📝 Próximos Pasos de Desarrollo

1. Crear API Routes para autenticación (`/api/auth/*`)
2. Implementar API de productos (`/api/products/*`)
3. Crear componentes del dashboard de inventario
4. Implementar sistema de ventas con POS
5. Desarrollar módulo de DJ Requests
6. Crear carta digital pública con calculadora
7. Implementar sistema de configuración global
8. Desarrollar dashboard de estadísticas y reportes

## 🆘 Problemas Comunes

### Error: "Cannot find module '@prisma/client'"
```bash
pnpm prisma generate
```

### Error de conexión a MySQL
- Verificar que MySQL esté corriendo
- Verificar credenciales en DATABASE_URL
- Verificar que la base de datos exista

### Error de NextAuth
- Verificar que NEXTAUTH_SECRET esté configurado (mínimo 32 caracteres)
- Verificar que NEXTAUTH_URL sea correcto

### Error de AWS S3
- Verificar credenciales de AWS
- Verificar que el bucket exista
- Verificar permisos de lectura/escritura

## 📄 Documentación Adicional

- Ver [README.md](./README.md) para información sobre la landing page
- Ver [CLAUDE.md](./CLAUDE.md) para guía de Claude Code
- Ver `.claude/requisitos-0-4.md` y `.claude/requisitos-5-7.md` para especificaciones detalladas

## 📄 Licencia

Este proyecto es privado y confidencial.

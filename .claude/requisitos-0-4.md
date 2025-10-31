# 📋 ESPECIFICACIÓN DE REQUISITOS POR MÓDULOS

## **STACK TECNOLÓGICO**

```javascript
const TechStack = {
  framework: "Next.js 14 (App Router)",
  language: "TypeScript",
  database: "MySQL 8.0+",
  orm: "Prisma ORM",
  auth: "NextAuth.js v5 (Auth.js)",
  ui: "Tailwind CSS + shadcn/ui",
  fileUpload: "AWS S3",
  stateManagement: "Zustand",
  forms: "React Hook Form + Zod",
  realtime: "Server-Sent Events (SSE) o Pusher",
  deployment: "Vercel (frontend) + AWS RDS (database)"
};
```

---

## **MÓDULO 0: SETUP INICIAL Y CONFIGURACIÓN BASE**

### **REQUISITOS FUNCIONALES**

**RF-0.1** El sistema debe configurar Next.js 14 con App Router y TypeScript
**RF-0.2** El sistema debe configurar Prisma con MySQL como base de datos
**RF-0.3** El sistema debe configurar AWS S3 para almacenamiento de archivos
**RF-0.4** El sistema debe configurar shadcn/ui y Tailwind CSS
**RF-0.5** El sistema debe crear la estructura de carpetas del proyecto
**RF-0.6** El sistema debe configurar variables de entorno

### **REQUISITOS NO FUNCIONALES**

**RNF-0.1** El proyecto debe usar TypeScript estricto
**RNF-0.2** Debe incluir ESLint y Prettier configurados
**RNF-0.3** Debe usar convenciones de nombres consistentes
**RNF-0.4** Debe incluir manejo de errores global
**RNF-0.5** Debe tener .gitignore apropiado

### **ESTRUCTURA DE CARPETAS**

```
halloween-party/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── inventario/
│   │   │   │   ├── ventas/
│   │   │   │   ├── canciones/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── carta/
│   │   │   ├── dj-requests/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   ├── songs/
│   │   │   ├── config/
│   │   │   └── upload/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── dashboard/
│   │   ├── public/
│   │   └── shared/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── s3.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── hooks/
│   ├── store/
│   ├── types/
│   └── constants/
├── public/
├── .env
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### **DEPENDENCIAS**

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.14.0",
    "next-auth": "^5.0.0-beta",
    "bcryptjs": "^2.4.3",
    "zod": "^3.23.0",
    "react-hook-form": "@hookform/resolvers",
    "zustand": "^4.5.0",
    "@aws-sdk/client-s3": "^3.600.0",
    "@aws-sdk/s3-request-presigner": "^3.600.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.395.0",
    "sharp": "^0.33.0",
    "sonner": "^1.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5",
    "prisma": "^5.14.0",
    "eslint": "^8",
    "eslint-config-next": "^14.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8",
    "autoprefixer": "^10.4.0"
  }
}
```

### **VARIABLES DE ENTORNO (.env.example)**

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/halloween_party"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="halloween-party-uploads"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Proyecto Next.js 14 funcionando en desarrollo
- ✅ Prisma conectado a MySQL
- ✅ AWS S3 configurado y probado
- ✅ shadcn/ui instalado con componentes base
- ✅ Variables de entorno documentadas
- ✅ README.md con instrucciones de setup

### **INSTRUCCIONES PARA IA**

```
TAREA: Setup inicial del proyecto Next.js 14 con todas las configuraciones base

STACK:
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM + MySQL
- AWS S3
- shadcn/ui + Tailwind CSS

PASOS:
1. Crear proyecto Next.js 14 con TypeScript
2. Instalar dependencias listadas arriba
3. Configurar Prisma con MySQL
4. Crear estructura de carpetas especificada
5. Configurar AWS S3 client
6. Instalar y configurar shadcn/ui con Tailwind
7. Crear archivo .env.example
8. Crear lib/prisma.ts para cliente de Prisma
9. Crear lib/s3.ts para funciones de upload
10. Configurar next.config.js para imágenes de S3
11. Crear README.md con instrucciones

ARCHIVOS CRÍTICOS A CREAR:
- prisma/schema.prisma (vacío por ahora, se llenará en siguientes módulos)
- src/lib/prisma.ts
- src/lib/s3.ts
- src/lib/utils.ts
- .env.example
- README.md

NO IMPLEMENTAR AÚN:
- Modelos de Prisma (siguiente módulo)
- Autenticación (siguiente módulo)
- Componentes de UI específicos
```

---

## **MÓDULO 1: AUTENTICACIÓN Y GESTIÓN DE USUARIOS**

### **REQUISITOS FUNCIONALES**

**RF-1.1** El sistema debe permitir login con email y contraseña
**RF-1.2** El sistema debe validar credenciales contra la base de datos
**RF-1.3** El sistema debe crear sesiones seguras con JWT
**RF-1.4** El sistema debe distinguir 3 roles: admin, bartender, cajero
**RF-1.5** El sistema debe proteger rutas según rol del usuario
**RF-1.6** El sistema debe permitir logout
**RF-1.7** El sistema debe mostrar información del usuario logueado
**RF-1.8** El sistema debe redirigir a login si no está autenticado

### **REQUISITOS NO FUNCIONALES**

**RNF-1.1** Las contraseñas deben hashearse con bcrypt (10 rounds)
**RNF-1.2** Los tokens JWT deben expirar en 7 días
**RNF-1.3** Las rutas de API deben validar autenticación en middleware
**RNF-1.4** La sesión debe persistir en cookies httpOnly
**RNF-1.5** Debe implementar CSRF protection

### **SCHEMA DE PRISMA**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  BARTENDER
  CAJERO
}

model User {
  id        String   @id @default(cuid())
  nombre    String
  email     String   @unique
  password  String
  rol       Role     @default(BARTENDER)
  barra     String?  // "barra_1", "barra_2", null
  activo    Boolean  @default(true)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  ventas    Sale[]
  canciones Song[]

  @@index([email])
  @@index([activo])
  @@map("users")
}
```

### **API ENDPOINTS**

```typescript
// src/app/api/auth/login/route.ts
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, token: string }

// src/app/api/auth/logout/route.ts
POST /api/auth/logout
Response: { message: string }

// src/app/api/auth/me/route.ts
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user: User }

// src/app/api/auth/register/route.ts (solo para admin)
POST /api/auth/register
Headers: Authorization: Bearer <token>
Body: { nombre, email, password, rol, barra? }
Response: { user: User }
```

### **COMPONENTES UI**

```typescript
// Componentes a crear:
- src/app/(auth)/login/page.tsx          // Página de login
- src/components/auth/LoginForm.tsx      // Formulario de login
- src/components/auth/ProtectedRoute.tsx // HOC para rutas protegidas
- src/components/shared/UserMenu.tsx     // Menú de usuario en navbar
```

### **HOOKS Y UTILIDADES**

```typescript
// src/hooks/useAuth.ts
- getCurrentUser()
- login(email, password)
- logout()
- isAuthenticated
- user

// src/lib/auth.ts
- hashPassword(password: string)
- comparePassword(password: string, hash: string)
- generateToken(user: User)
- verifyToken(token: string)

// src/middleware.ts (Next.js middleware)
- Proteger rutas /dashboard/*
- Validar token en cookies
- Redirigir a /login si no autenticado
```

### **VALIDACIONES (Zod)**

```typescript
// src/lib/validations/auth.ts

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

export const registerSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  rol: z.enum(['ADMIN', 'BARTENDER', 'CAJERO']),
  barra: z.string().nullable().optional()
});
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Usuario puede hacer login con email y contraseña
- ✅ Contraseña incorrecta muestra error apropiado
- ✅ Al login exitoso, redirige a /dashboard
- ✅ Token JWT se guarda en cookie httpOnly
- ✅ Middleware protege rutas /dashboard/*
- ✅ Usuario no autenticado es redirigido a /login
- ✅ Logout limpia sesión y redirige a /login
- ✅ Navbar muestra nombre y rol del usuario
- ✅ Admin puede crear nuevos usuarios

### **DATOS DE SEED**

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Usuario admin
  await prisma.user.create({
    data: {
      nombre: 'Admin',
      email: 'admin@halloween.com',
      password: await bcrypt.hash('admin123', 10),
      rol: 'ADMIN'
    }
  });

  // Bartenders
  await prisma.user.createMany({
    data: [
      {
        nombre: 'Carlos López',
        email: 'carlos@halloween.com',
        password: await bcrypt.hash('bartender123', 10),
        rol: 'BARTENDER',
        barra: 'barra_1'
      },
      {
        nombre: 'María García',
        email: 'maria@halloween.com',
        password: await bcrypt.hash('bartender123', 10),
        rol: 'BARTENDER',
        barra: 'barra_2'
      }
    ]
  });
}

main();
```

### **INSTRUCCIONES PARA IA**

```
TAREA: Implementar sistema de autenticación completo con NextAuth.js v5

DEPENDENCIAS A USAR:
- next-auth v5 (beta)
- bcryptjs
- zod

PASOS:
1. Crear modelo User en schema.prisma
2. Ejecutar migración: npx prisma migrate dev --name add_users
3. Configurar NextAuth en src/lib/auth.ts
4. Crear API routes de autenticación
5. Crear middleware.ts para proteger rutas
6. Crear página de login en src/app/(auth)/login/page.tsx
7. Crear componente LoginForm
8. Crear hook useAuth
9. Crear seed para usuarios de prueba
10. Probar flujo completo de login/logout

VALIDACIONES:
- Email debe ser válido
- Password mínimo 6 caracteres
- Mostrar errores en formulario

SEGURIDAD:
- Hashear passwords con bcrypt (10 rounds)
- Usar cookies httpOnly para tokens
- Implementar CSRF protection
- Validar token en cada request protegido

TESTING MANUAL:
1. Intentar acceder a /dashboard sin login → redirige a /login
2. Login con credenciales incorrectas → muestra error
3. Login con admin@halloween.com / admin123 → redirige a /dashboard
4. Navbar muestra "Admin"
5. Logout → redirige a /login y limpia sesión

CREDENCIALES DE PRUEBA:
- Admin: admin@halloween.com / admin123
- Bartender: carlos@halloween.com / bartender123
```

---

## **MÓDULO 2: GESTIÓN DE INVENTARIO (PRODUCTOS)**

### **REQUISITOS FUNCIONALES**

**RF-2.1** El sistema debe permitir crear productos con imagen
**RF-2.2** El sistema debe listar todos los productos con paginación
**RF-2.3** El sistema debe permitir buscar productos por nombre
**RF-2.4** El sistema debe permitir filtrar por categoría
**RF-2.5** El sistema debe permitir editar productos
**RF-2.6** El sistema debe permitir eliminar productos (soft delete)
**RF-2.7** El sistema debe calcular margen de ganancia automáticamente
**RF-2.8** El sistema debe alertar cuando stock < 20% del inicial
**RF-2.9** El sistema debe subir imágenes a AWS S3
**RF-2.10** El sistema debe mostrar stock actual vs inicial
**RF-2.11** El sistema debe permitir marcar productos como disponibles/no disponibles

### **REQUISITOS NO FUNCIONALES**

**RNF-2.1** Máximo 20 productos por página
**RNF-2.2** Imágenes máximo 5MB
**RNF-2.3** Formatos aceptados: JPG, PNG, WEBP
**RNF-2.4** Búsqueda debe ser case-insensitive
**RNF-2.5** Carga de listado < 1 segundo
**RNF-2.6** Upload de imagen < 5 segundos
**RNF-2.7** Nombres de S3: `productos/{timestamp}-{random}.{ext}`

### **SCHEMA DE PRISMA**

```prisma
enum Categoria {
  CERVEZA
  TRAGO
  SHOT
  SIN_ALCOHOL
  OTRO
}

enum UnidadMedida {
  UNIDAD
  BOTELLA
  LITRO
  ML
}

model Product {
  id              String        @id @default(cuid())
  nombre          String
  descripcion     String?       @db.Text
  categoria       Categoria
  precioBase      Float         @map("precio_base")
  costoUnitario   Float         @map("costo_unitario")
  imagenUrl       String?       @map("imagen_url")
  imagenKey       String?       @map("imagen_key") // S3 key para eliminar
  stockInicial    Int           @map("stock_inicial")
  stockActual     Int           @map("stock_actual")
  unidadMedida    UnidadMedida  @default(UNIDAD) @map("unidad_medida")
  disponible      Boolean       @default(true)
  badges          String?       // JSON array: ["popular", "nuevo"]
  opciones        String?       @db.Text // JSON: [{nombre, precioExtra}]
  activo          Boolean       @default(true)
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  // Relaciones
  saleItems       SaleItem[]

  @@index([categoria, disponible])
  @@index([activo])
  @@fulltext([nombre, descripcion])
  @@map("products")
}
```

### **API ENDPOINTS**

```typescript
// GET /api/products
// Query params: ?page=1&limit=20&categoria=CERVEZA&buscar=pilsen&disponible=true
Response: {
  productos: Product[],
  total: number,
  page: number,
  totalPages: number,
  hasMore: boolean
}

// GET /api/products/[id]
Response: Product

// POST /api/products
// FormData con imagen
Body: {
  nombre: string,
  descripcion?: string,
  categoria: Categoria,
  precioBase: number,
  costoUnitario: number,
  stockInicial: number,
  stockActual: number,
  unidadMedida: UnidadMedida,
  imagen: File
}
Response: { producto: Product }

// PUT /api/products/[id]
// FormData opcional con nueva imagen
Body: { ...campos a actualizar }
Response: { producto: Product }

// DELETE /api/products/[id]
// Soft delete (activo = false)
Response: { message: string }

// PATCH /api/products/[id]/stock
Body: { cantidad: number, motivo: 'venta' | 'ajuste' | 'devolucion' }
Response: { producto: Product, nuevoStock: number }

// GET /api/products/publico
// Para carta digital (solo activos y disponibles)
Query: ?categoria=CERVEZA
Response: {
  productos: Product[] // con descuento aplicado según hora
}

// POST /api/upload
// Upload genérico para imágenes
Body: FormData con archivo
Response: { url: string, key: string }
```

### **COMPONENTES UI**

```typescript
// src/app/(dashboard)/dashboard/inventario/page.tsx
- Layout principal del inventario
- Barra de búsqueda
- Filtros (categoría, disponible)
- Grid de productos
- Paginación
- Botón "Nuevo Producto"

// src/components/dashboard/ProductCard.tsx
- Card con imagen del producto
- Nombre, categoría, precio
- Stock con indicador de estado
- Botones Editar/Eliminar
- Badge si stock < 20%

// src/components/dashboard/ProductForm.tsx
- Modal para crear/editar
- Upload de imagen con preview
- Campos del formulario
- Validación con React Hook Form + Zod
- Cálculo automático de margen

// src/components/dashboard/ProductFilters.tsx
- Select de categoría
- Toggle disponible/todos
- Búsqueda por nombre

// src/components/dashboard/ImageUpload.tsx
- Zona de drag & drop
- Preview de imagen
- Progreso de upload
- Validación de tamaño/formato
```

### **HOOKS**

```typescript
// src/hooks/useProducts.ts
export function useProducts() {
  return {
    products: Product[],
    loading: boolean,
    error: string | null,
    fetchProducts: (params) => Promise<void>,
    createProduct: (data) => Promise<Product>,
    updateProduct: (id, data) => Promise<Product>,
    deleteProduct: (id) => Promise<void>,
    updateStock: (id, cantidad, motivo) => Promise<void>
  }
}

// src/hooks/useImageUpload.ts
export function useImageUpload() {
  return {
    upload: (file: File) => Promise<{url: string, key: string}>,
    uploading: boolean,
    progress: number,
    error: string | null
  }
}
```

### **UTILIDADES S3**

```typescript
// src/lib/s3.ts

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function uploadToS3(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const key = `productos/${Date.now()}-${Math.random().toString(36).substring(7)}.${filename.split('.').pop()}`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read'
  }));

  const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  
  return { url, key };
}

export async function deleteFromS3(key: string): Promise<void> {
  await s3Client.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key
  }));
}
```

### **VALIDACIONES**

```typescript
// src/lib/validations/product.ts

import { z } from 'zod';

export const productSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  descripcion: z.string().max(500).optional(),
  categoria: z.enum(['CERVEZA', 'TRAGO', 'SHOT', 'SIN_ALCOHOL', 'OTRO']),
  precioBase: z.number().positive('Debe ser mayor a 0'),
  costoUnitario: z.number().positive('Debe ser mayor a 0'),
  stockInicial: z.number().int().nonnegative(),
  stockActual: z.number().int().nonnegative(),
  unidadMedida: z.enum(['UNIDAD', 'BOTELLA', 'LITRO', 'ML']).default('UNIDAD'),
  disponible: z.boolean().default(true)
}).refine(data => data.precioBase > data.costoUnitario, {
  message: 'El precio de venta debe ser mayor al costo',
  path: ['precioBase']
});

export const stockUpdateSchema = z.object({
  cantidad: z.number().int(),
  motivo: z.enum(['venta', 'ajuste', 'devolucion'])
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, 'Máximo 5MB')
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Solo JPG, PNG, WEBP')
});
```

### **DATOS DE SEED**

```typescript
// prisma/seed.ts (agregar a la función main)

const productos = [
  {
    nombre: 'Cerveza Pilsen',
    descripcion: '330ml bien helada',
    categoria: 'CERVEZA',
    precioBase: 8,
    costoUnitario: 3,
    stockInicial: 100,
    stockActual: 100,
    unidadMedida: 'UNIDAD',
    disponible: true
  },
  {
    nombre: 'Ron con Coca Cola',
    descripcion: '2oz ron + Coca Cola + hielo + limón',
    categoria: 'TRAGO',
    precioBase: 10,
    costoUnitario: 2.5,
    stockInicial: 60,
    stockActual: 60,
    unidadMedida: 'UNIDAD',
    disponible: true,
    opciones: JSON.stringify([
      { nombre: 'Ron Cartavio', precioExtra: 0 },
      { nombre: 'Ron Flor de Caña', precioExtra: 2 }
    ])
  },
  {
    nombre: 'Shot Tequila',
    descripcion: 'Shot de tequila con sal y limón',
    categoria: 'SHOT',
    precioBase: 7,
    costoUnitario: 2,
    stockInicial: 80,
    stockActual: 80,
    unidadMedida: 'UNIDAD',
    disponible: true
  },
  {
    nombre: 'Agua San Luis',
    descripcion: '625ml',
    categoria: 'SIN_ALCOHOL',
    precioBase: 3,
    costoUnitario: 1,
    stockInicial: 50,
    stockActual: 50,
    unidadMedida: 'UNIDAD',
    disponible: true
  }
];

await prisma.product.createMany({ data: productos });
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Admin puede ver listado de productos paginado
- ✅ Puede buscar productos por nombre
- ✅ Puede filtrar por categoría
- ✅ Puede crear producto con imagen (sube a S3)
- ✅ Imagen se visualiza correctamente desde S3
- ✅ Puede editar producto y cambiar imagen
- ✅ Imagen anterior se elimina de S3
- ✅ Puede eliminar producto (soft delete)
- ✅ Stock < 20% muestra badge de alerta
- ✅ Margen de ganancia se calcula automáticamente
- ✅ Validaciones funcionan correctamente
- ✅ Solo admin y cajero pueden acceder

### **INSTRUCCIONES PARA IA**

```
TAREA: Implementar módulo completo de gestión de inventario

IMPORTANTE:
- Usar Prisma con MySQL
- Subir imágenes a AWS S3 (NO filesystem)
- Implementar paginación eficiente
- Soft delete (no borrar físicamente)

PASOS:
1. Agregar modelo Product a schema.prisma
2. Ejecutar migración
3. Crear funciones de S3 en lib/s3.ts
4. Crear API endpoints en app/api/products/
5. Implementar upload endpoint en app/api/upload/route.ts
6. Crear página de inventario en app/(dashboard)/dashboard/inventario/page.tsx
7. Crear componentes: ProductCard, ProductForm, ImageUpload, ProductFilters
8. Crear hook useProducts
9. Crear validaciones con Zod
10. Agregar seed de productos
11. Probar flujo completo CRUD

CONFIGURACIÓN S3:
- Crear bucket público para lectura
- Configurar CORS
- Guardar key en DB para poder eliminar

VALIDACIONES:
- Imagen máximo 5MB
- Solo JPG, PNG, WEBP
- Precio > Costo
- Stock >= 0
- Nombre único por categoría

CÁLCULOS:
- Margen % = ((precioBase - costo) / costo) * 100
- Stock bajo = stockActual < (stockInicial * 0.2)

UI/UX:
- Grid responsive (1-2-3-4 columnas)
- Preview de imagen antes de subir
- Loading states durante upload
- Confirmación antes de eliminar
- Toast notifications (usando sonner)
- Skeleton loaders

TESTING MANUAL:
1. Crear producto con imagen → verifica en S3
2. Editar producto → imagen anterior se elimina de S3
3. Buscar "pilsen" → filtra correctamente
4. Filtrar por CERVEZA → solo muestra cervezas
5. Stock = 15/100 → muestra badge de alerta
6. Eliminar producto → activo=false, no se muestra
```

---

## **MÓDULO 3: GESTIÓN DE VENTAS (PUNTO DE VENTA)**

### **REQUISITOS FUNCIONALES**

**RF-3.1** El sistema debe permitir agregar productos al carrito de venta
**RF-3.2** El sistema debe calcular descuento según hora actual
**RF-3.3** El sistema debe permitir 5 métodos de pago: efectivo, yape, plin, tarjeta, pulsera
**RF-3.4** El sistema debe validar stock antes de completar venta
**RF-3.5** El sistema debe descontar stock automáticamente al vender
**RF-3.6** El sistema debe registrar bartender y barra en cada venta
**RF-3.7** El sistema debe generar código único por venta (VTA-YYYYMMDD-XXXX)
**RF-3.8** El sistema debe permitir anular ventas (solo admin)
**RF-3.9** El sistema debe mostrar ventas del turno actual
**RF-3.10** El sistema debe calcular totales por método de pago
**RF-3.11** El sistema debe permitir subir comprobante de Yape/Plin
**RF-3.12** El sistema debe mostrar estadísticas en tiempo real

### **REQUISITOS NO FUNCIONALES**

**RNF-3.1** Proceso de venta completo < 10 segundos
**RNF-3.2** Validación de stock en transacción atómica
**RNF-3.3** Cálculo de descuento desde tabla Config
**RNF-3.4** Almacenar comprobantes en S3
**RNF-3.5** Actualizar estadísticas cada 5 segundos
**RNF-3.6** Máximo 50 ventas por página
**RNF-3.7** Backup de caja cada hora

### **SCHEMA DE PRISMA**

```prisma
enum MetodoPago {
  EFECTIVO
  YAPE
  PLIN
  TARJETA
  PULSERA
}

enum EstadoVenta {
  COMPLETADA
  PENDIENTE
  ANULADA
}

model Sale {
  id                   String         @id @default(cuid())
  codigo               String         @unique
  
  // Usuario y barra
  userId               String         @map("user_id")
  user                 User           @relation(fields: [userId], references: [id])
  barra                String         // "barra_1" | "barra_2"
  
  // Items
  items                SaleItem[]
  
  // Cálculos
  subtotal             Float
  descuentoPorcentaje  Float          @default(0) @map("descuento_porcentaje")
  descuentoMonto       Float          @default(0) @map("descuento_monto")
  total                Float
  
  // Método de pago
  metodoPago           MetodoPago     @map("metodo_pago")
  
  // Detalles de pago (JSON)
  pagoDetalles         String?        @db.Text @map("pago_detalles")
  // {
  //   // Yape/Plin
  //   numeroOperacion?: string
  //   telefono?: string
  //   comprobanteUrl?: string
  //   comprobanteKey?: string
  //   
  //   // Efectivo
  //   montoRecibido?: number
  //   cambio?: number
  //   
  //   // Pulsera
  //   pulseraId?: string
  //   creditoUsado?: number
  //   
  //   // Tarjeta
  //   transaccionId?: string
  //   ultimos4Digitos?: string
  // }
  
  // Estado
  estado               EstadoVenta    @default(COMPLETADA)
  anuladaPor           String?        @map("anulada_por")
  razonAnulacion       String?        @db.Text @map("razon_anulacion")
  fechaAnulacion       DateTime?      @map("fecha_anulacion")
  
  // Metadata
  notas                String?        @db.Text
  ipCliente            String?        @map("ip_cliente")
  deviceInfo           String?        @map("device_info")
  
  createdAt            DateTime       @default(now()) @map("created_at")
  updatedAt            DateTime       @updatedAt @map("updated_at")

  @@index([userId, createdAt])
  @@index([barra, createdAt])
  @@index([metodoPago])
  @@index([estado])
  @@index([createdAt])
  @@map("sales")
}

model SaleItem {
  id              String   @id @default(cuid())
  saleId          String   @map("sale_id")
  sale            Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  productId       String   @map("product_id")
  product         Product  @relation(fields: [productId], references: [id])
  
  nombreProducto  String   @map("nombre_producto") // Backup
  cantidad        Int
  precioUnitario  Float    @map("precio_unitario")
  subtotal        Float

  @@index([saleId])
  @@index([productId])
  @@map("sale_items")
}
```

### **API ENDPOINTS**

```typescript
// POST /api/sales
Body: {
  items: [
    { productId: string, cantidad: number, precioUnitario: number }
  ],
  descuentoPorcentaje: number,
  metodoPago: MetodoPago,
  pagoDetalles: object,
  barra: string,
  notas?: string
}
Response: {
  venta: Sale,
  codigo: string,
  total: number
}

// GET /api/sales
Query: ?page=1&limit=50&fechaInicio=...&fechaFin=...&barra=...&metodoPago=...&estado=...
Response: {
  ventas: Sale[],
  total: number,
  page: number,
  totalPages: number,
  estadisticas: {
    totalVentas: number,
    totalEfectivo: number,
    totalYape: number,
    totalPlin: number,
    totalTarjeta: number,
    cantidadVentas: number
  }
}

// GET /api/sales/[id]
Response: Sale (con items y producto completo)

// PATCH /api/sales/[id]/anular
Body: { razonAnulacion: string }
Response: { venta: Sale }

// GET /api/sales/estadisticas/tiempo-real
Response: {
  ventasHoy: number,
  ventasUltimaHora: number,
  productosMasVendidos: [
    { producto: string, cantidad: number, total: number }
  ],
  ventasPorHora: [
    { hora: string, cantidad: number, monto: number }
  ],
  ventasPorBarra: {
    barra_1: number,
    barra_2: number
  }
}

// GET /api/sales/turno-actual
Query: ?userId=...&barra=...
Response: {
  ventas: Sale[],
  totalEfectivo: number,
  totalDigital: number,
  cantidadVentas: number,
  inicioTurno: DateTime
}
```

### **COMPONENTES UI**

```typescript
// src/app/(dashboard)/dashboard/ventas/page.tsx
- Layout principal del POS
- Dos columnas: Productos | Carrito
- Área de productos con búsqueda
- Carrito de venta actual
- Panel de métodos de pago
- Estadísticas rápidas

// src/components/dashboard/ProductSelector.tsx
- Grid de productos disponibles
- Búsqueda rápida
- Filtro por categoría
- Click para agregar al carrito
- Muestra precio con descuento

// src/components/dashboard/SaleCart.tsx
- Lista de items en carrito
- Cantidad editable
- Eliminar item
- Subtotal por item
- Total con descuento aplicado
- Botón Limpiar
- Botón Cobrar

// src/components/dashboard/PaymentMethodSelector.tsx
- 5 botones para métodos de pago
- Modal específico por método
- Validación según método

// src/components/dashboard/PaymentModals/
- EfectivoModal.tsx → Input monto recibido, calcula cambio
- YapePlinModal.tsx → QR de la barra, input nro operación, upload comprobante
- TarjetaModal.tsx → Input últimos 4 dígitos, ID transacción
- PulseraModal.tsx → Escanear/buscar pulsera, verificar crédito

// src/components/dashboard/SalesHistory.tsx
- Tabla de ventas con filtros
- Paginación
- Detalle de venta en modal
- Botón anular (solo admin)

// src/components/dashboard/SalesStats.tsx
- Cards con estadísticas
- Gráfico de ventas por hora
- Top productos
- Distribución por método de pago
```

### **HOOKS**

```typescript
// src/hooks/useSales.ts
export function useSales() {
  return {
    sales: Sale[],
    loading: boolean,
    error: string | null,
    fetchSales: (params) => Promise<void>,
    createSale: (data) => Promise<Sale>,
    getSaleById: (id) => Promise<Sale>,
    cancelSale: (id, razon) => Promise<void>,
    getRealtimeStats: () => Promise<Stats>
  }
}

// src/hooks/useCart.ts
export function useCart() {
  return {
    items: CartItem[],
    addItem: (product, cantidad) => void,
    updateQuantity: (productId, cantidad) => void,
    removeItem: (productId) => void,
    clearCart: () => void,
    subtotal: number,
    descuentoPorcentaje: number,
    descuentoMonto: number,
    total: number
  }
}

// src/hooks/useDiscount.ts
export function useDiscount() {
  return {
    currentDiscount: number,
    descripcion: string,
    tiempoRestante: number, // minutos
    nextDiscount: { porcentaje: number, hora: string } | null
  }
}
```

### **UTILIDADES**

```typescript
// src/lib/utils/sales.ts

export function generateSaleCode(): string {
  const fecha = new Date();
  const yyyymmdd = format(fecha, 'yyyyMMdd');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `VTA-${yyyymmdd}-${random}`;
}

export function calculateDiscount(
  subtotal: number,
  porcentaje: number
): { descuentoMonto: number; total: number } {
  const descuentoMonto = subtotal * (porcentaje / 100);
  const total = subtotal - descuentoMonto;
  return { descuentoMonto, total };
}

export async function validateStock(
  items: { productId: string; cantidad: number }[]
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  for (const item of items) {
    const producto = await prisma.product.findUnique({
      where: { id: item.productId }
    });
    
    if (!producto) {
      errors.push(`Producto ${item.productId} no encontrado`);
      continue;
    }
    
    if (!producto.disponible) {
      errors.push(`${producto.nombre} no está disponible`);
      continue;
    }
    
    if (producto.stockActual < item.cantidad) {
      errors.push(`Stock insuficiente de ${producto.nombre}. Disponible: ${producto.stockActual}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### **VALIDACIONES**

```typescript
// src/lib/validations/sale.ts

import { z } from 'zod';

export const saleItemSchema = z.object({
  productId: z.string().cuid(),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().positive()
});

export const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'Debe tener al menos 1 producto'),
  descuentoPorcentaje: z.number().min(0).max(100),
  metodoPago: z.enum(['EFECTIVO', 'YAPE', 'PLIN', 'TARJETA', 'PULSERA']),
  pagoDetalles: z.object({}).passthrough(),
  barra: z.enum(['barra_1', 'barra_2']),
  notas: z.string().max(500).optional()
});

export const pagoEfectivoSchema = z.object({
  montoRecibido: z.number().positive('Monto debe ser positivo'),
  cambio: z.number().nonnegative()
}).refine(data => data.cambio >= 0, {
  message: 'El monto recibido debe ser mayor o igual al total',
  path: ['montoRecibido']
});

export const pagoYapePlinSchema = z.object({
  numeroOperacion: z.string().min(6, 'Número de operación inválido'),
  telefono: z.string().regex(/^9\d{8}$/, 'Teléfono inválido'),
  comprobante: z.instanceof(File).optional()
});

export const cancelSaleSchema = z.object({
  razonAnulacion: z.string().min(10, 'Debe explicar el motivo (mínimo 10 caracteres)')
});
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Bartender puede ver productos disponibles
- ✅ Puede agregar productos al carrito
- ✅ Stock se valida antes de agregar
- ✅ Descuento se aplica automáticamente según hora
- ✅ Puede completar venta con efectivo (calcula cambio)
- ✅ Puede completar venta con Yape (sube comprobante)
- ✅ Stock se descuenta automáticamente
- ✅ Se genera código VTA-YYYYMMDD-XXXX
- ✅ Historial muestra ventas del día
- ✅ Estadísticas se actualizan en tiempo real
- ✅ Admin puede anular ventas
- ✅ Ventas anuladas devuelven stock
- ✅ Bartender solo ve ventas de su barra

### **INSTRUCCIONES PARA IA**

```
TAREA: Implementar módulo completo de Punto de Venta (POS)

IMPORTANTE:
- Validar stock en transacción (usar Prisma.$transaction)
- Generar código único por venta
- Aplicar descuento desde Config (próximo módulo)
- Subir comprobantes a S3

PASOS:
1. Agregar modelos Sale y SaleItem a schema.prisma
2. Ejecutar migración
3. Crear API endpoints en app/api/sales/
4. Crear página de ventas en app/(dashboard)/dashboard/ventas/page.tsx
5. Crear componente ProductSelector (lista productos)
6. Crear componente SaleCart (carrito)
7. Crear componente PaymentMethodSelector
8. Crear modales para cada método de pago
9. Crear hook useCart para gestión de carrito
10. Crear hook useSales para operaciones de venta
11. Implementar validación de stock
12. Implementar generación de código
13. Implementar descuento automático
14. Crear página de historial de ventas
15. Crear componente de estadísticas

FLUJO DE VENTA:
1. Bartender selecciona productos
2. Se agregan a carrito (valida stock)
3. Sistema calcula descuento según hora
4. Bartender selecciona método de pago
5. Completa datos según método
6. Sistema valida stock nuevamente
7. Crea venta en transacción:
   - Inserta Sale
   - Inserta SaleItems
   - Decrementa stock de productos
8. Retorna código de venta
9. Limpia carrito

TRANSACCIÓN ATÓMICA:
await prisma.$transaction(async (tx) => {
  // 1. Validar stock
  // 2. Crear Sale
  // 3. Crear SaleItems
  // 4. Actualizar stock productos
});

DESCUENTO:
- Obtener de tabla Config (hardcodear 30% por ahora)
- Aplicar automáticamente en carrito
- Mostrar countdown de tiempo restante

MÉTODOS DE PAGO:
Efectivo: Solo monto recibido, calcular cambio
Yape/Plin: Número operación + teléfono + upload comprobante
Tarjeta: ID transacción + últimos 4 dígitos
Pulsera: ID pulsera + crédito usado (próximo módulo)

UI/UX:
- Layout dos columnas (productos | carrito)
- Búsqueda rápida de productos
- Agregar producto con un click
- Total grande y visible
- Cambio grande si es efectivo
- Confirmación antes de completar
- Toast de éxito con código de venta
- Limpiar carrito después de venta

ESTADÍSTICAS:
- Total ventas hoy
- Ventas última hora
- Productos más vendidos
- Ventas por método de pago
- Gráfico de ventas por hora
- Actualizar cada 5 segundos

TESTING MANUAL:
1. Agregar 2 cervezas al carrito
2. Verificar que descuento se aplica
3. Intentar agregar más de stock disponible → error
4. Completar venta con efectivo
5. Verificar código VTA-...
6. Verificar que stock disminuyó
7. Verificar en historial
8. Anular venta → stock regresa
```

---

## **MÓDULO 4: GESTIÓN DE CANCIONES (DJ REQUESTS)**

### **REQUISITOS FUNCIONALES**

**RF-4.1** El sistema debe permitir 3 tipos de solicitud: libre, prioritaria, vip
**RF-4.2** Solicitudes libres son anónimas y gratuitas
**RF-4.3** Solicitudes prioritarias cuestan S/5 y requieren login
**RF-4.4** Solicitudes VIP cuestan S/8, requieren login y tienen dedicatoria
**RF-4.5** Admin debe aprobar solicitudes prioritarias/vip tras validar comprobante
**RF-4.6** El sistema debe ordenar canciones por tipo y por orden de llegada
**RF-4.7** El sistema debe permitir votar canciones libres (1 voto por dispositivo)
**RF-4.8** El sistema debe mostrar cola en 3 columnas: Libres | Prioritarias | VIP
**RF-4.9** El sistema debe permitir marcar canción como reproduciendo/reproducida
**RF-4.10** El sistema debe mostrar "ahora sonando"
**RF-4.11** El sistema debe calcular posición en cola y tiempo estimado
**RF-4.12** El sistema debe subir comprobantes a S3

### **REQUISITOS NO FUNCIONALES**

**RNF-4.1** Listado de canciones actualiza cada 10 segundos
**RNF-4.2** Votos limitados por IP/device (cookie)
**RNF-4.3** Comprobantes máximo 5MB
**RNF-4.4** Tiempo promedio por canción: 3 minutos
**RNF-4.5** Máximo 100 canciones libres en cola
**RNF-4.6** Prioritarias y VIP sin límite de cola

### **SCHEMA DE PRISMA**

```prisma
enum TipoCancion {
  LIBRE
  PRIORITARIA
  VIP
}

enum EstadoCancion {
  PENDIENTE
  EN_COLA
  REPRODUCIENDO
  REPRODUCIDA
  RECHAZADA
}

model Song {
  id                  String         @id @default(cuid())
  titulo              String
  artista             String
  tipo                TipoCancion
  
  // Dedicatoria (solo VIP)
  dedicatoriaDe       String?        @map("dedicatoria_de")
  dedicatoriaPara     String?        @map("dedicatoria_para")
  dedicatoriaMensaje  String?        @db.Text @map("dedicatoria_mensaje")
  
  // Pago (prioritaria y VIP)
  pagado              Boolean        @default(false)
  monto               Float          @default(0)
  comprobanteUrl      String?        @map("comprobante_url")
  comprobanteKey      String?        @map("comprobante_key")
  
  // Usuario (si está logueado)
  userId              String?        @map("user_id")
  user                User?          @relation(fields: [userId], references: [id])
  
  // Solicitudes anónimas (libres)
  solicitanteNombre   String         @default("Anónimo") @map("solicitante_nombre")
  
  // Estado
  estado              EstadoCancion  @default(PENDIENTE)
  
  // Votos (solo libres)
  votos               Int            @default(0)
  votosIps            String?        @db.Text // JSON array de IPs/device IDs
  
  // Orden
  orden               Int            @default(0)
  
  // Timestamps
  fechaReproduccion   DateTime?      @map("fecha_reproduccion")
  tiempoEsperaMinutos Int?           @map("tiempo_espera_minutos")
  
  // Notas
  notasDj             String?        @db.Text @map("notas_dj")
  ipSolicitante       String?        @map("ip_solicitante")
  
  createdAt           DateTime       @default(now()) @map("created_at")
  updatedAt           DateTime       @updatedAt @map("updated_at")

  @@index([tipo, estado, orden])
  @@index([estado, createdAt])
  @@map("songs")
}
```

### **API ENDPOINTS**

```typescript
// POST /api/songs (libre - pública)
Body: {
  titulo: string,
  artista: string,
  solicitanteNombre?: string
}
Response: {
  cancion: Song,
  posicionEnCola: number,
  tiempoEstimado: number // minutos
}

// POST /api/songs/prioritaria (requiere auth)
Body: {
  titulo: string,
  artista: string,
  comprobante: File
}
Response: {
  cancion: Song,
  estado: 'pendiente_aprobacion'
}

// POST /api/songs/vip (requiere auth)
Body: {
  titulo: string,
  artista: string,
  dedicatoriaDe: string,
  dedicatoriaPara: string,
  dedicatoriaMensaje: string,
  comprobante: File
}
Response: {
  cancion: Song,
  estado: 'pendiente_aprobacion'
}

// GET /api/songs
// Solo admin/DJ
Query: ?tipo=LIBRE&estado=PENDIENTE&page=1&limit=50
Response: {
  canciones: Song[],
  total: number,
  porTipo: {
    libres: number,
    prioritarias: number,
    vips: number
  }
}

// GET /api/songs/publico
// Para página pública
Response: {
  ahoraSonando: Song | null,
  libres: Song[], // top 20 por votos
  prioritarias: Song[], // en cola
  vips: Song[], // en cola
  siguientes: Song[] // próximas 3
}

// PATCH /api/songs/[id]/votar
Body: { deviceId: string }
Response: {
  votos: number,
  yaVoto: boolean
}

// PATCH /api/songs/[id]/estado (admin/DJ)
Body: {
  estado: EstadoCancion,
  notasDj?: string
}
Response: { cancion: Song }

// PATCH /api/songs/[id]/aprobar (admin)
Body: { aprobado: boolean }
Response: { cancion: Song }

// DELETE /api/songs/[id] (admin)
Response: { message: string }

// GET /api/songs/estadisticas
Response: {
  totalRecaudado: number,
  totalPrioritarias: number,
  totalVips: number,
  promedioEspera: number
}
```

### **COMPONENTES UI - DASHBOARD**

```typescript
// src/app/(dashboard)/dashboard/canciones/page.tsx
- Layout con 3 columnas
- Ahora sonando (destacado)
- Tabs o columnas: Libres | Prioritarias | VIP
- Botón actualizar manual
- Estadísticas de recaudación

// src/components/dashboard/SongCard.tsx
- Título y artista
- Solicitante
- Estado (badge)
- Votos (si es libre)
- Dedicatoria (si es VIP)
- Comprobante (link para ver)
- Botones de acción según estado
- Tiempo en cola

// src/components/dashboard/SongQueue.tsx
- Lista de canciones por tipo
- Ordenadas por prioridad/votos
- Drag & drop para reordenar (opcional)

// src/components/dashboard/SongActions.tsx
- Botón Reproducir
- Botón Marcar como Reproducida
- Botón Aprobar/Rechazar (pendientes)
- Botón Eliminar
- Input para notas del DJ

// src/components/dashboard/NowPlaying.tsx
- Card grande destacado
- Título, artista
- Tipo de solicitud
- Si es VIP: dedicatoria
- Progreso simulado
- Botón "Siguiente"
```

### **COMPONENTES UI - PÚBLICO**

```typescript
// src/app/(public)/dj-requests/page.tsx
- Ahora sonando (destacado)
- Tabs: Solicitar | Cola
- Formulario de solicitud libre
- Enlaces a solicitud prioritaria/VIP
- Visualización de colas

// src/components/public/SongRequestForm.tsx
- Campos: título, artista, tu nombre
- Búsqueda de canciones (opcional)
- Preview de posición estimada
- Submit button

// src/components/public/SongQueue.tsx
- 3 secciones: Libres | Prioritarias | VIP
- Muestra top 20 libres (con votos)
- Botón votar por canción libre
- Badge "Ya votaste"
- Tiempo estimado de reproducción

// src/components/public/NowPlaying.tsx
- Canción actual
- Artista
- Tipo de solicitud
- Si VIP: dedicatoria
- Barra de progreso simulada

// src/components/public/RequestPaidModal.tsx
- Formulario para prioritaria/VIP
- Upload de comprobante
- QR de pago
- Instrucciones de Yape/Plin
```

### **HOOKS**

```typescript
// src/hooks/useSongs.ts
export function useSongs() {
  return {
    songs: Song[],
    loading: boolean,
    error: string | null,
    fetchSongs: (params) => Promise<void>,
    createSong: (data) => Promise<Song>,
    createPrioritaria: (data) => Promise<Song>,
    createVip: (data) => Promise<Song>,
    updateStatus: (id, estado) => Promise<void>,
    approveSong: (id, aprobado) => Promise<void>,
    deleteSong: (id) => Promise<void>,
    voteSong: (id) => Promise<void>
  }
}

// src/hooks/useNowPlaying.ts
export function useNowPlaying() {
  return {
    nowPlaying: Song | null,
    nextSongs: Song[],
    markAsPlayed: () => Promise<void>,
    playNext: () => Promise<void>
  }
}

// src/hooks/useVoting.ts
export function useVoting() {
  const [deviceId, setDeviceId] = useState<string>('');
  
  useEffect(() => {
    // Obtener o crear device ID en cookie
    let id = getCookie('device_id');
    if (!id) {
      id = generateDeviceId();
      setCookie('device_id', id);
    }
    setDeviceId(id);
  }, []);
  
  return {
    deviceId,
    canVote: (songId: string) => boolean,
    vote: (songId: string) => Promise<void>
  }
}
```

### **UTILIDADES**

```typescript
// src/lib/utils/songs.ts

export function calculateQueuePosition(
  tipo: TipoCancion,
  currentSongs: Song[]
): number {
  const enCola = currentSongs.filter(s => 
    s.tipo === tipo && 
    ['PENDIENTE', 'EN_COLA'].includes(s.estado)
  );
  return enCola.length + 1;
}

export function estimateWaitTime(
  posicion: number,
  tipo: TipoCancion
): number {
  const TIEMPO_POR_CANCION = 3; // minutos
  
  let prioridad = 0;
  if (tipo === 'PRIORITARIA') prioridad = 1;
  if (tipo === 'VIP') prioridad = 2;
  
  // VIPs y prioritarias tienen menos espera
  const factor = tipo === 'LIBRE' ? 1 : 0.5;
  
  return Math.ceil(posicion * TIEMPO_POR_CANCION * factor);
}

export function sortSongsByPriority(songs: Song[]): Song[] {
  const prioridades = {
    VIP: 3,
    PRIORITARIA: 2,
    LIBRE: 1
  };
  
  return songs.sort((a, b) => {
    // Primero por tipo (VIP > Prioritaria > Libre)
    const prioDiff = prioridades[b.tipo] - prioridades[a.tipo];
    if (prioDiff !== 0) return prioDiff;
    
    // Libres: por votos
    if (a.tipo === 'LIBRE') {
      return b.votos - a.votos;
    }
    
    // Prioritarias y VIP: por orden de llegada
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

export function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
```

### **VALIDACIONES**

```typescript
// src/lib/validations/song.ts

import { z } from 'zod';

export const songLibreSchema = z.object({
  titulo: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  artista: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  solicitanteNombre: z.string().max(50).optional()
});

export const songPrioritariaSchema = z.object({
  titulo: z.string().min(2).max(100),
  artista: z.string().min(2).max(100),
  comprobante: z.instanceof(File)
    .refine(f => f.size <= 5 * 1024 * 1024, 'Máximo 5MB')
    .refine(f => f.type.startsWith('image/'), 'Solo imágenes')
});

export const songVipSchema = z.object({
  titulo: z.string().min(2).max(100),
  artista: z.string().min(2).max(100),
  dedicatoriaDe: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  dedicatoriaPara: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  dedicatoriaMensaje: z.string().min(10, 'Mínimo 10 caracteres').max(200),
  comprobante: z.instanceof(File)
    .refine(f => f.size <= 5 * 1024 * 1024, 'Máximo 5MB')
    .refine(f => f.type.startsWith('image/'), 'Solo imágenes')
});

export const updateSongStatusSchema = z.object({
  estado: z.enum(['PENDIENTE', 'EN_COLA', 'REPRODUCIENDO', 'REPRODUCIDA', 'RECHAZADA']),
  notasDj: z.string().max(500).optional()
});
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Usuario anónimo puede solicitar canción libre
- ✅ Usuario logueado puede solicitar prioritaria (S/5)
- ✅ Usuario logueado puede solicitar VIP (S/8) con dedicatoria
- ✅ Comprobante se sube a S3
- ✅ Admin ve solicitudes pendientes de aprobación
- ✅ Admin puede aprobar/rechazar tras validar comprobante
- ✅ Canciones aprobadas aparecen en cola
- ✅ DJ puede marcar canción como reproduciendo
- ✅ "Ahora sonando" se actualiza automáticamente
- ✅ Usuarios pueden votar canciones libres (1 voto por device)
- ✅ Cola se ordena: VIP > Prioritaria > Libre (por votos)
- ✅ Se muestra tiempo estimado de espera
- ✅ Página pública muestra colas sin necesidad de login

### **INSTRUCCIONES PARA IA**

```
TAREA: Implementar sistema completo de DJ Requests con 3 tipos de solicitud

TIPOS DE SOLICITUD:
1. LIBRE: Anónima, gratis, ordenada por votos
2. PRIORITARIA: S/5, requiere login, aprobación de admin
3. VIP: S/8, requiere login, con dedicatoria, aprobación de admin

PASOS:
1. Agregar modelo Song a schema.prisma
2. Ejecutar migración
3. Crear API endpoints en app/api/songs/
4. Crear página dashboard en app/(dashboard)/dashboard/canciones/page.tsx
5. Crear página pública en app/(public)/dj-requests/page.tsx
6. Crear componente SongCard (dashboard)
7. Crear componente SongRequestForm (público)
8. Crear componente SongQueue (ambos)
9. Crear componente NowPlaying (ambos)
10. Crear modales para solicitud prioritaria/VIP
11. Implementar sistema de votos con device ID
12. Implementar aprobación de admin
13. Implementar cambio de estado (reproduciendo, reproducida)

FLUJO SOLICITUD LIBRE:
1. Usuario llena formulario (título, artista, nombre opcional)
2. Sistema crea Song con tipo LIBRE, estado EN_COLA
3. Calcula posición y tiempo estimado
4. Retorna confirmación

FLUJO SOLICITUD PRIORITARIA/VIP:
1. Usuario debe estar logueado (sino, redirige a login)
2. Llena formulario + sube comprobante de pago
3. Sistema crea Song con estado PENDIENTE
4. Admin ve en dashboard para aprobar
5. Admin valida comprobante
6. Admin aprueba → estado EN_COLA
7. Admin rechaza → estado RECHAZADA (notifica usuario)

SISTEMA DE VOTOS:
- Generar device ID único en cookie
- 1 voto por canción por device
- Guardar IPs/devices que votaron en JSON
- Validar en backend antes de incrementar

ORDENAMIENTO DE COLA:
1. VIP aprobadas (por orden de llegada)
2. Prioritarias aprobadas (por orden de llegada)
3. Libres (por votos, luego por orden de llegada)

ACTUALIZACIÓN AUTOMÁTICA:
- Polling cada 10 segundos en página pública
- SSE o WebSocket opcional para tiempo real

AHORA SONANDO:
- Botón "Reproducir" marca canción como REPRODUCIENDO
- Solo 1 canción puede estar REPRODUCIENDO
- Botón "Siguiente" marca actual como REPRODUCIDA y reproduce siguiente

ESTIMACIÓN DE TIEMPO:
- 3 minutos promedio por canción
- VIP/Prioritaria: factor 0.5
- Libre: factor 1.0
- Cálculo: posición × 3 × factor

UI/UX DASHBOARD:
- 3 columnas visuales
- Ahora sonando destacado arriba
- Badge de cantidad por tipo
- Filtros por estado
- Comprobante como modal lightbox
- Confirmación antes de rechazar

UI/UX PÚBLICO:
- Hero con ahora sonando
- Tabs: Solicitar | Ver Cola
- Formulario simple y rápido
- Mostrar precios de prioritaria/VIP
- QR de pago para Yape/Plin
- Top 20 canciones libres con votos

TESTING MANUAL:
1. Solicitar canción libre → aparece en cola
2. Votar canción → incrementa votos
3. Intentar votar de nuevo → "Ya votaste"
4. Login como user → solicitar prioritaria
5. Subir comprobante → estado pendiente
6. Login como admin → ver pendientes
7. Aprobar → aparece en cola
8. Marcar como reproduciendo → mueve a "ahora sonando"
9. Siguiente → marca como reproducida, siguiente en cola
```

---
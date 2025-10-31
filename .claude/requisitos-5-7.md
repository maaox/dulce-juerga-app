## **MÓDULO 5: CARTA DIGITAL PÚBLICA**

### **REQUISITOS FUNCIONALES**

**RF-5.1** El sistema debe mostrar menú público con todos los productos disponibles
**RF-5.2** El sistema debe aplicar descuento según hora actual
**RF-5.3** El sistema debe mostrar precio original tachado y precio con descuento
**RF-5.4** El sistema debe permitir filtrar por categoría
**RF-5.5** El sistema debe permitir buscar productos por nombre
**RF-5.6** El sistema debe mostrar badge de descuento activo
**RF-5.7** El sistema debe incluir calculadora para dividir gastos
**RF-5.8** La calculadora debe permitir agregar productos a un "carrito temporal"
**RF-5.9** La calculadora debe permitir ingresar número de personas
**RF-5.10** La calculadora debe mostrar total por persona
**RF-5.11** La calculadora debe permitir compartir resumen por WhatsApp
**RF-5.12** El sistema NO debe guardar datos de la calculadora (solo sesión)
**RF-5.13** El sistema debe ser responsive (mobile-first)
**RF-5.14** El sistema debe mostrar imágenes de productos desde S3

### **REQUISITOS NO FUNCIONALES**

**RNF-5.1** Página debe cargar en < 2 segundos
**RNF-5.2** Imágenes optimizadas y lazy loading
**RNF-5.3** Descuento actualiza cada minuto
**RNF-5.4** Calculadora solo en memoria (no DB, no localStorage)
**RNF-5.5** Design mobile-first, responsive hasta 4K
**RNF-5.6** Compatible con todos los navegadores modernos
**RNF-5.7** Accesible (WCAG 2.1 AA)

### **SCHEMA DE PRISMA**

```prisma
// Este módulo usa el modelo Config que crearemos en el siguiente módulo
// No requiere nuevas tablas, solo consultas a Product y Config
```

### **API ENDPOINTS**

```typescript
// GET /api/menu/publico
// Endpoint público sin autenticación
Response: {
  productos: [
    {
      id: string,
      nombre: string,
      descripcion: string,
      categoria: Categoria,
      imagenUrl: string,
      precioBase: number,
      precioActual: number, // con descuento aplicado
      descuentoPorcentaje: number,
      disponible: boolean,
      opciones?: [
        { nombre: string, precioExtra: number }
      ]
    }
  ],
  descuentoActual: {
    porcentaje: number,
    descripcion: string,
    horaInicio: string,
    horaFin: string,
    tiempoRestanteMinutos: number
  }
}

// GET /api/menu/descuento-actual
// Obtiene solo info del descuento actual
Response: {
  porcentaje: number,
  descripcion: string,
  activo: boolean,
  tiempoRestante: number,
  proximoDescuento: {
    porcentaje: number,
    horaInicio: string
  } | null
}
```

### **COMPONENTES UI**

```typescript
// src/app/(public)/carta/page.tsx
/**
 * Página principal de la carta digital
 * Layout:
 * - Header sticky con logo y descuento actual
 * - Barra de búsqueda
 * - Filtros de categoría
 * - Grid de productos
 * - Botón flotante "Dividir gastos" (bottom-right)
 * - Footer con info del evento
 */

// src/components/public/ProductGrid.tsx
/**
 * Grid responsive de productos
 * - 1 columna en mobile
 * - 2 columnas en tablet
 * - 3-4 columnas en desktop
 * - Lazy loading de imágenes
 */

// src/components/public/ProductCardPublic.tsx
/**
 * Card de producto para carta pública
 * Props: product, onAddToCalculator
 * 
 * Contenido:
 * - Imagen optimizada
 * - Badge de categoría
 * - Nombre del producto
 * - Descripción corta
 * - Precio original tachado
 * - Precio actual grande y destacado
 * - Badge de descuento (ej: "30% OFF")
 * - Badge "Disponible" o "Agotado"
 * - Botón "Agregar a calculadora"
 * - Opciones (si tiene)
 */

// src/components/public/DiscountBanner.tsx
/**
 * Banner sticky en top
 * Muestra descuento actual con countdown
 * 
 * Ejemplo:
 * "🔥 HAPPY HOUR: 30% OFF en todo - Termina en 23:45 ⏰"
 */

// src/components/public/CategoryFilter.tsx
/**
 * Chips/botones de categorías
 * - "Todas"
 * - "Cervezas"
 * - "Tragos"
 * - "Shots"
 * - "Sin Alcohol"
 * 
 * Scroll horizontal en mobile
 */

// src/components/public/SearchBar.tsx
/**
 * Barra de búsqueda con debounce
 * - Input con ícono de lupa
 * - Búsqueda en tiempo real
 * - Resalta coincidencias
 */

// src/components/public/SplitBillCalculator.tsx
/**
 * Modal/Sheet para dividir gastos
 * 
 * Estructura:
 * ┌────────────────────────────────────┐
 * │ 💰 DIVIDIR GASTOS                 │
 * ├────────────────────────────────────┤
 * │ Personas: [-] 4 [+]               │
 * ├────────────────────────────────────┤
 * │ PRODUCTOS SELECCIONADOS:          │
 * │                                   │
 * │ • 2x Cerveza Pilsen    S/11.20   │
 * │   [- 2 +] [❌]                    │
 * │                                   │
 * │ • 1x Ron con Coca      S/7.00    │
 * │   [- 1 +] [❌]                    │
 * │                                   │
 * │ • 3x Shot Tequila      S/14.70   │
 * │   [- 3 +] [❌]                    │
 * │                                   │
 * ├────────────────────────────────────┤
 * │ SUBTOTAL:              S/32.90   │
 * │ Descuento 30%:        -S/9.87    │
 * │ ─────────────────────────────     │
 * │ TOTAL:                 S/23.03   │
 * │                                   │
 * │ Por persona (÷4):      S/5.76    │
 * │                                   │
 * ├────────────────────────────────────┤
 * │ [📱 Compartir WhatsApp]           │
 * │ [🔄 Nueva cuenta]                 │
 * │ [❌ Cerrar]                       │
 * └────────────────────────────────────┘
 */

// src/components/public/CalculatorItem.tsx
/**
 * Item individual en la calculadora
 * - Nombre del producto
 * - Cantidad con +/-
 * - Subtotal
 * - Botón eliminar
 */
```

### **HOOKS Y STATE**

```typescript
// src/hooks/usePublicMenu.ts
export function usePublicMenu() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [descuento, setDescuento] = useState<Descuento | null>(null);
  const [categoria, setCategoria] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchMenu();
    // Actualizar descuento cada minuto
    const interval = setInterval(fetchDescuento, 60000);
    return () => clearInterval(interval);
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchCategoria = categoria === 'todas' || p.categoria === categoria;
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return matchCategoria && matchBusqueda && p.disponible;
    });
  }, [productos, categoria, busqueda]);

  return {
    productos: productosFiltrados,
    loading,
    descuento,
    categoria,
    setCategoria,
    busqueda,
    setBusqueda
  };
}

// src/hooks/useCalculator.ts
interface CalculatorItem {
  producto: Product;
  cantidad: number;
}

export function useCalculator() {
  const [items, setItems] = useState<CalculatorItem[]>([]);
  const [numPersonas, setNumPersonas] = useState(1);

  const addItem = (producto: Product, cantidad: number = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.producto.id === producto.id);
      if (existing) {
        return prev.map(i => 
          i.producto.id === producto.id 
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { producto, cantidad }];
    });
  };

  const updateQuantity = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(productoId);
      return;
    }
    setItems(prev => 
      prev.map(i => 
        i.producto.id === productoId 
          ? { ...i, cantidad }
          : i
      )
    );
  };

  const removeItem = (productoId: string) => {
    setItems(prev => prev.filter(i => i.producto.id !== productoId));
  };

  const clearCalculator = () => {
    setItems([]);
    setNumPersonas(1);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + (item.producto.precioActual * item.cantidad);
    }, 0);
  }, [items]);

  const totalPorPersona = useMemo(() => {
    return subtotal / numPersonas;
  }, [subtotal, numPersonas]);

  const generateWhatsAppMessage = () => {
    const lineas = items.map(i => 
      `• ${i.cantidad}x ${i.producto.nombre} - S/${(i.producto.precioActual * i.cantidad).toFixed(2)}`
    );
    
    return `🎃 *Halloween Party - División de cuenta*\n\n${lineas.join('\n')}\n\n*Total:* S/${subtotal.toFixed(2)}\n*Personas:* ${numPersonas}\n*Por persona:* S/${totalPorPersona.toFixed(2)}`;
  };

  const shareWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return {
    items,
    numPersonas,
    setNumPersonas,
    addItem,
    updateQuantity,
    removeItem,
    clearCalculator,
    subtotal,
    totalPorPersona,
    shareWhatsApp
  };
}
```

### **UTILIDADES**

```typescript
// src/lib/utils/pricing.ts

export function applyDiscount(
  precioBase: number,
  descuentoPorcentaje: number
): number {
  return precioBase * (1 - descuentoPorcentaje / 100);
}

export function calculateRemainingTime(
  horaFin: string
): number {
  const now = new Date();
  const [hours, minutes] = horaFin.split(':').map(Number);
  const finTime = new Date(now);
  finTime.setHours(hours, minutes, 0, 0);
  
  const diff = finTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60))); // minutos
}

export function formatPrice(price: number): string {
  return `S/${price.toFixed(2)}`;
}

export function optimizeImageUrl(
  s3Url: string,
  width?: number
): string {
  // Si usas Next.js Image, esto se maneja automáticamente
  // Si no, podrías usar un servicio como Cloudinary
  return s3Url;
}
```

### **ESTILOS Y ANIMACIONES**

```typescript
// Componentes de shadcn/ui a usar:
- Card (para ProductCard)
- Badge (para categorías, descuentos)
- Button (para acciones)
- Input (para búsqueda)
- Sheet o Dialog (para calculadora)
- Separator (para divisiones)
- ScrollArea (para lista de productos en calculadora)

// Animaciones con Tailwind:
- Fade in para productos (animate-fadeIn)
- Slide up para calculadora (animate-slideUp)
- Pulse para badge de descuento
- Smooth scroll entre secciones
```

### **RESPONSIVE BREAKPOINTS**

```css
/* Mobile first approach */

/* Mobile: < 640px */
- 1 columna de productos
- Botón calculadora flotante bottom-right
- Categorías en scroll horizontal
- Imágenes más pequeñas

/* Tablet: 640px - 1024px */
- 2 columnas de productos
- Categorías en grid 2x3
- Imágenes medianas

/* Desktop: 1024px - 1536px */
- 3 columnas de productos
- Categorías en fila horizontal
- Imágenes grandes

/* Large Desktop: > 1536px */
- 4 columnas de productos
- Layout más espacioso
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Página carga en < 2 segundos
- ✅ Productos se muestran con imágenes de S3
- ✅ Descuento se aplica y muestra correctamente
- ✅ Búsqueda filtra en tiempo real
- ✅ Filtros de categoría funcionan
- ✅ Puede agregar productos a calculadora
- ✅ Calculadora calcula total por persona correctamente
- ✅ Puede cambiar cantidad en calculadora
- ✅ Puede eliminar items de calculadora
- ✅ Botón compartir WhatsApp abre con mensaje correcto
- ✅ Nueva cuenta limpia calculadora
- ✅ Responsive en mobile, tablet, desktop
- ✅ Imágenes con lazy loading
- ✅ Calculadora no guarda datos (solo sesión)

### **INSTRUCCIONES PARA IA**

```
TAREA: Implementar carta digital pública con calculadora de división de gastos

IMPORTANTE:
- Mobile-first design
- NO guardar datos de calculadora (solo useState)
- Imágenes desde S3 con lazy loading
- Actualizar descuento cada minuto

PASOS:
1. Crear página en app/(public)/carta/page.tsx
2. Crear API endpoint GET /api/menu/publico
3. Crear componente ProductGrid
4. Crear componente ProductCardPublic
5. Crear componente DiscountBanner con countdown
6. Crear componente CategoryFilter
7. Crear componente SearchBar con debounce
8. Crear componente SplitBillCalculator (modal/sheet)
9. Crear componente CalculatorItem
10. Crear hook usePublicMenu
11. Crear hook useCalculator
12. Implementar share WhatsApp
13. Optimizar imágenes con Next.js Image
14. Hacer responsive todos los componentes

CALCULADORA:
- State solo en memoria (useState)
- No localStorage, no cookies, no DB
- Al cerrar modal, mantiene estado
- Al "Nueva cuenta", limpia todo
- WhatsApp comparte resumen de cuenta

DESCUENTO:
- Obtener de API cada minuto
- Mostrar countdown en tiempo real
- Aplicar a todos los precios
- Mostrar precio original tachado

BÚSQUEDA:
- Debounce de 300ms
- Case insensitive
- Busca en nombre y descripción
- Resalta coincidencias (opcional)

FILTROS:
- Botones de categoría
- "Todas" seleccionado por defecto
- Cuenta de productos por categoría
- Transición suave al filtrar

UI/UX:
- Banner de descuento sticky en top
- Botón calculadora flotante (bottom-right)
- Grid responsive (1-2-3-4 columnas)
- Cards con hover effect
- Imágenes con aspect ratio 1:1
- Skeleton loaders mientras carga
- Empty state si no hay productos
- Smooth scroll
- Animaciones sutiles

OPTIMIZACIONES:
- Next.js Image para optimización automática
- Lazy loading de imágenes
- Prefetch de imágenes visibles
- Memoizar cálculos costosos
- Debounce en búsqueda
- Virtual scrolling si > 100 productos

WHATSAPP SHARE:
Formato del mensaje:
```
🎃 *Halloween Party - División de cuenta*

• 2x Cerveza Pilsen - S/11.20
• 1x Ron con Coca - S/7.00
• 3x Shot Tequila - S/14.70

*Total:* S/32.90
*Personas:* 4
*Por persona:* S/8.23
```

TESTING MANUAL:
1. Abrir /carta en mobile → responsive OK
2. Ver banner de descuento → muestra 30% OFF
3. Filtrar por "Cervezas" → solo cervezas
4. Buscar "pilsen" → filtra correctamente
5. Click botón calculadora → abre modal
6. Agregar 2 cervezas → suma correctamente
7. Cambiar a 4 personas → divide bien
8. Click WhatsApp → abre con mensaje correcto
9. Click "Nueva cuenta" → limpia todo
10. Cerrar modal → datos se mantienen
11. Recargar página → calculadora vacía (OK)
```

---

## **MÓDULO 6: CONFIGURACIÓN DEL SISTEMA**

### **REQUISITOS FUNCIONALES**

**RF-6.1** El sistema debe permitir configurar franjas horarias de descuento
**RF-6.2** El sistema debe permitir habilitar/deshabilitar descuentos
**RF-6.3** El sistema debe permitir configurar precios de DJ requests
**RF-6.4** El sistema debe permitar configurar cuentas de pago (Yape, Plin, Transferencia)
**RF-6.5** El sistema debe permitir subir QR de Yape/Plin
**RF-6.6** El sistema debe permitir configurar datos del evento
**RF-6.7** El sistema debe permitir configurar emails de notificación
**RF-6.8** El sistema debe obtener descuento actual basado en hora del servidor
**RF-6.9** Solo admin debe poder modificar configuración
**RF-6.10** Cambios deben aplicarse inmediatamente

### **REQUISITOS NO FUNCIONALES**

**RNF-6.1** Solo 1 registro Config en DB (singleton)
**RNF-6.2** Cambios se persisten inmediatamente
**RNF-6.3** Cache de config en servidor (revalidar cada minuto)
**RNF-6.4** QRs de pago en S3
**RNF-6.5** Validar franjas horarias sin solapamiento

### **SCHEMA DE PRISMA**

```prisma
model Config {
  id        String   @id @default("singleton") // Solo 1 registro
  
  // Descuentos por hora
  descuentosEnabled Boolean  @default(true) @map("descuentos_enabled")
  descuentos        Json?    // Array de franjas
  // [
  //   {
  //     horaInicio: "21:00",
  //     horaFin: "22:00",
  //     porcentaje: 30,
  //     descripcion: "Happy Hour Extremo"
  //   },
  //   ...
  // ]
  
  // Precios DJ Requests
  precioLibre       Float    @default(0) @map("precio_libre")
  precioPrioritaria Float    @default(5) @map("precio_prioritaria")
  precioVip         Float    @default(8) @map("precio_vip")
  
  // Cuentas de pago
  cuentasPago       Json?    @map("cuentas_pago")
  // {
  //   yape: {
  //     numero: "987654321",
  //     nombre: "Halloween Party",
  //     qrUrl: "https://s3...",
  //     qrKey: "pagos/yape-qr.jpg"
  //   },
  //   plin: { ... },
  //   transferencia: {
  //     banco: "BCP",
  //     numeroCuenta: "123-456-789",
  //     cci: "00123456789",
  //     titular: "Organizador"
  //   }
  // }
  
  // Datos del evento
  eventoNombre      String   @default("Halloween Party 2024") @map("evento_nombre")
  eventoFecha       DateTime @map("evento_fecha")
  eventoHoraInicio  String   @default("21:00") @map("evento_hora_inicio")
  eventoHoraFin     String   @default("04:00") @map("evento_hora_fin")
  eventoAforoMaximo Int      @default(150) @map("evento_aforo_maximo")
  eventoEstado      String   @default("preparacion") @map("evento_estado")
  // "preparacion" | "activo" | "finalizado"
  
  // Notificaciones
  emailNotificaciones String? @map("email_notificaciones")
  whatsappNotificaciones String? @map("whatsapp_notificaciones")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("config")
}
```

### **API ENDPOINTS**

```typescript
// GET /api/config
// Admin obtiene toda la config
Headers: Authorization: Bearer <token>
Response: Config

// PUT /api/config
// Admin actualiza config
Headers: Authorization: Bearer <token>
Body: Partial<Config>
Response: { config: Config }

// PATCH /api/config/descuentos
// Admin actualiza solo descuentos
Body: {
  enabled: boolean,
  descuentos: [
    {
      horaInicio: string,
      horaFin: string,
      porcentaje: number,
      descripcion: string
    }
  ]
}
Response: { config: Config }

// PATCH /api/config/cuentas-pago
// Admin actualiza cuentas de pago
Body: FormData con posibles QR
Response: { config: Config }

// GET /api/config/descuento-actual
// Público - obtiene descuento según hora actual
Response: {
  activo: boolean,
  porcentaje: number,
  descripcion: string,
  horaInicio: string,
  horaFin: string,
  tiempoRestanteMinutos: number,
  proximoDescuento: {
    porcentaje: number,
    horaInicio: string
  } | null
}

// GET /api/config/precios-canciones
// Público - obtiene precios de DJ requests
Response: {
  libre: number,
  prioritaria: number,
  vip: number
}

// GET /api/config/cuentas-pago
// Público - obtiene info de pago (sin datos sensibles)
Response: {
  yape: { numero, nombre, qrUrl },
  plin: { numero, nombre, qrUrl },
  transferencia: { banco, numeroCuenta, cci, titular }
}
```

### **COMPONENTES UI**

```typescript
// src/app/(dashboard)/dashboard/config/page.tsx
/**
 * Página de configuración
 * Tabs:
 * - Descuentos
 * - Precios DJ
 * - Cuentas de Pago
 * - Evento
 * - Notificaciones
 */

// src/components/dashboard/config/DiscountConfig.tsx
/**
 * Configuración de descuentos
 * 
 * ┌────────────────────────────────────┐
 * │ ⚙️  DESCUENTOS POR HORA            │
 * ├────────────────────────────────────┤
 * │ ☑️ Descuentos habilitados         │
 * │                                   │
 * │ FRANJAS HORARIAS:                 │
 * │                                   │
 * │ 1. Happy Hour Extremo             │
 * │    ⏰ 21:00 - 22:00               │
 * │    💰 30% OFF                     │
 * │    [✏️ Editar] [🗑️ Eliminar]      │
 * │                                   │
 * │ 2. Happy Hour                     │
 * │    ⏰ 22:00 - 23:00               │
 * │    💰 20% OFF                     │
 * │    [✏️ Editar] [🗑️ Eliminar]      │
 * │                                   │
 * │ [+ Agregar franja]                │
 * │                                   │
 * │ [Guardar cambios]                 │
 * └────────────────────────────────────┘
 */

// src/components/dashboard/config/DiscountFormModal.tsx
/**
 * Modal para crear/editar franja de descuento
 * Campos:
 * - Descripción
 * - Hora inicio (time picker)
 * - Hora fin (time picker)
 * - Porcentaje (slider 0-50%)
 * 
 * Validación:
 * - Hora fin > Hora inicio
 * - No solapamiento con otras franjas
 */

// src/components/dashboard/config/PricesConfig.tsx
/**
 * Configuración precios DJ
 * 
 * ┌────────────────────────────────────┐
 * │ 🎵 PRECIOS DJ REQUESTS             │
 * ├────────────────────────────────────┤
 * │ Solicitud Libre:                  │
 * │ S/ [0.00] (Gratis)                │
 * │                                   │
 * │ Solicitud Prioritaria:            │
 * │ S/ [5.00]                         │
 * │                                   │
 * │ Solicitud VIP con Dedicatoria:    │
 * │ S/ [8.00]                         │
 * │                                   │
 * │ [Guardar cambios]                 │
 * └────────────────────────────────────┘
 */

// src/components/dashboard/config/PaymentAccountsConfig.tsx
/**
 * Configuración de cuentas de pago
 * 
 * Secciones:
 * 1. Yape:
 *    - Número (987654321)
 *    - Nombre titular
 *    - Upload QR
 *    - Preview QR
 * 
 * 2. Plin:
 *    - Número
 *    - Nombre titular
 *    - Upload QR
 *    - Preview QR
 * 
 * 3. Transferencia:
 *    - Banco
 *    - Número de cuenta
 *    - CCI
 *    - Titular
 */

// src/components/dashboard/config/EventConfig.tsx
/**
 * Configuración del evento
 * 
 * Campos:
 * - Nombre del evento
 * - Fecha (date picker)
 * - Hora inicio (time picker)
 * - Hora fin (time picker)
 * - Aforo máximo (number)
 * - Estado (select: preparacion, activo, finalizado)
 */

// src/components/dashboard/config/NotificationsConfig.tsx
/**
 * Configuración de notificaciones
 * 
 * Campos:
 * - Email para notificaciones
 * - WhatsApp para notificaciones
 * - Telegram chat ID (opcional)
 */
```

### **HOOKS**

```typescript
// src/hooks/useConfig.ts
export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<Config>) => {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      setConfig(data.config);
      return data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    updateConfig,
    refetch: fetchConfig
  };
}

// src/hooks/useCurrentDiscount.ts
export function useCurrentDiscount() {
  const [discount, setDiscount] = useState<Discount | null>(null);

  const fetchDiscount = async () => {
    const res = await fetch('/api/config/descuento-actual');
    const data = await res.json();
    setDiscount(data);
  };

  useEffect(() => {
    fetchDiscount();
    // Actualizar cada minuto
    const interval = setInterval(fetchDiscount, 60000);
    return () => clearInterval(interval);
  }, []);

  return discount;
}
```

### **UTILIDADES**

```typescript
// src/lib/utils/config.ts

export function getCurrentDiscount(
  descuentos: DescuentoFranja[],
  enabled: boolean
): Discount | null {
  if (!enabled || !descuentos) return null;

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const active = descuentos.find(d => {
    return currentTime >= d.horaInicio && currentTime < d.horaFin;
  });

  if (!active) return null;

  const [finHours, finMinutes] = active.horaFin.split(':').map(Number);
  const finTime = new Date(now);
  finTime.setHours(finHours, finMinutes, 0, 0);
  
  const tiempoRestante = Math.max(0, Math.floor((finTime.getTime() - now.getTime()) / (1000 * 60)));

  // Buscar próximo descuento
  const proximoDescuento = descuentos.find(d => d.horaInicio > currentTime);

  return {
    activo: true,
    porcentaje: active.porcentaje,
    descripcion: active.descripcion,
    horaInicio: active.horaInicio,
    horaFin: active.horaFin,
    tiempoRestanteMinutos: tiempoRestante,
    proximoDescuento: proximoDescuento ? {
      porcentaje: proximoDescuento.porcentaje,
      horaInicio: proximoDescuento.horaInicio
    } : null
  };
}

export function validateDiscountFranjas(
  franjas: DescuentoFranja[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar cada franja
  for (let i = 0; i < franjas.length; i++) {
    const franja = franjas[i];
    
    // Hora fin debe ser mayor que hora inicio
    if (franja.horaFin <= franja.horaInicio) {
      errors.push(`Franja ${i + 1}: Hora fin debe ser mayor a hora inicio`);
    }

    // Porcentaje válido
    if (franja.porcentaje < 0 || franja.porcentaje > 100) {
      errors.push(`Franja ${i + 1}: Porcentaje debe estar entre 0 y 100`);
    }

    // Verificar solapamiento con otras franjas
    for (let j = i + 1; j < franjas.length; j++) {
      const otra = franjas[j];
      
      const overlap = (
        (franja.horaInicio >= otra.horaInicio && franja.horaInicio < otra.horaFin) ||
        (franja.horaFin > otra.horaInicio && franja.horaFin <= otra.horaFin) ||
        (franja.horaInicio <= otra.horaInicio && franja.horaFin >= otra.horaFin)
      );

      if (overlap) {
        errors.push(`Franjas ${i + 1} y ${j + 1} se solapan`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function ensureConfigExists(): Promise<void> {
  const config = await prisma.config.findUnique({
    where: { id: 'singleton' }
  });

  if (!config) {
    await prisma.config.create({
      data: {
        id: 'singleton',
        eventoFecha: new Date('2024-10-31'),
        descuentos: JSON.stringify([
          {
            horaInicio: '21:00',
            horaFin: '22:00',
            porcentaje: 30,
            descripcion: 'Happy Hour Extremo'
          },
          {
            horaInicio: '22:00',
            horaFin: '23:00',
            porcentaje: 20,
            descripcion: 'Happy Hour'
          },
          {
            horaInicio: '23:00',
            horaFin: '00:00',
            porcentaje: 10,
            descripcion: 'Última Hora'
          }
        ])
      }
    });
  }
}
```

### **VALIDACIONES**

```typescript
// src/lib/validations/config.ts

import { z } from 'zod';

export const descuentoFranjaSchema = z.object({
  horaInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  horaFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  porcentaje: z.number().min(0).max(100),
  descripcion: z.string().min(3).max(100)
}).refine(data => data.horaFin > data.horaInicio, {
  message: 'Hora fin debe ser mayor a hora inicio',
  path: ['horaFin']
});

export const descuentosConfigSchema = z.object({
  enabled: z.boolean(),
  descuentos: z.array(descuentoFranjaSchema)
});

export const preciosCancionesSchema = z.object({
  precioLibre: z.number().min(0),
  precioPrioritaria: z.number().min(0),
  precioVip: z.number().min(0)
});

export const cuentaPagoSchema = z.object({
  numero: z.string().optional(),
  nombre: z.string().optional(),
  qrUrl: z.string().url().optional(),
  qrKey: z.string().optional()
});

export const transferenciaSchema = z.object({
  banco: z.string().optional(),
  numeroCuenta: z.string().optional(),
  cci: z.string().optional(),
  titular: z.string().optional()
});

export const eventoConfigSchema = z.object({
  eventoNombre: z.string().min(3),
  eventoFecha: z.date(),
  eventoHoraInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  eventoHoraFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  eventoAforoMaximo: z.number().int().positive(),
  eventoEstado: z.enum(['preparacion', 'activo', 'finalizado'])
});
```

### **SEED DATA**

```typescript
// prisma/seed.ts (agregar)

import { ensureConfigExists } from '../src/lib/utils/config';

async function main() {
  // ... otros seeds ...
  
  // Config
  await ensureConfigExists();
  
  console.log('✅ Config creada');
}
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Admin puede ver configuración actual
- ✅ Admin puede crear/editar/eliminar franjas de descuento
- ✅ Sistema valida que franjas no se solapen
- ✅ Admin puede habilitar/deshabilitar descuentos
- ✅ Admin puede cambiar precios de DJ requests
- ✅ Admin puede actualizar cuentas de pago
- ✅ Admin puede subir QRs de Yape/Plin (S3)
- ✅ Admin puede configurar datos del evento
- ✅ API pública retorna descuento actual según hora
- ✅ Cambios aplican inmediatamente en toda la app
- ✅ Solo admin puede acceder a configuración

### **INSTRUCCIONES PARA IA**

```
TAREA: Implementar sistema de configuración global

IMPORTANTE:
- Solo 1 registro Config en DB (singleton pattern)
- Validar franjas horarias sin solapamiento
- Cache de config con revalidación
- QRs de pago en S3

PASOS:
1. Agregar modelo Config a schema.prisma
2. Ejecutar migración
3. Crear función ensureConfigExists()
4. Agregar a seed.ts
5. Crear API endpoints en app/api/config/
6. Crear página en app/(dashboard)/dashboard/config/page.tsx
7. Crear componentes de configuración por sección
8. Crear hook useConfig
9. Crear hook useCurrentDiscount
10. Implementar validación de franjas
11. Implementar getCurrentDiscount()
12. Integrar en módulos existentes

SINGLETON PATTERN:
- ID siempre es "singleton"
- Usar upsert para actualizar
- Crear en seed si no existe

DESCUENTOS:
- Array de objetos en JSON
- Validar no solapamiento
- getCurrentDiscount() según hora actual
- Cache por 1 minuto

INTEGRACIÓN:
1. En módulo Ventas:
   - Obtener descuento actual
   - Aplicar a carrito
   
2. En Carta Pública:
   - Mostrar descuento actual
   - Actualizar cada minuto
   
3. En DJ Requests:
   - Obtener precios desde Config
   - Mostrar en formularios

UI/UX:
- Tabs para secciones
- Vista previa de QRs subidos
- Validación en tiempo real
- Confirmación antes de guardar
- Toast de éxito/error
- Loading states

TESTING MANUAL:
1. Crear franja 21:00-22:00 30%
2. Crear franja 22:00-23:00 20%
3. Intentar crear franja solapada → error
4. Guardar → éxito
5. Probar API /api/config/descuento-actual a las 21:30 → retorna 30%
6. Probar API a las 22:30 → retorna 20%
7. Deshabilitar descuentos → API retorna null
8. Subir QR Yape → guarda en S3
9. Ver carta pública → muestra descuento correcto
```

---

## **MÓDULO 7: DASHBOARD DE ESTADÍSTICAS Y REPORTES**

### **REQUISITOS FUNCIONALES**

**RF-7.1** El sistema debe mostrar dashboard con KPIs en tiempo real
**RF-7.2** El sistema debe mostrar total de ventas del día
**RF-7.3** El sistema debe mostrar ventas por método de pago
**RF-7.4** El sistema debe mostrar productos más vendidos
**RF-7.5** El sistema debe mostrar ventas por hora (gráfico)
**RF-7.6** El sistema debe mostrar ventas por barra
**RF-7.7** El sistema debe mostrar stock crítico (< 20%)
**RF-7.8** El sistema debe mostrar estadísticas de canciones
**RF-7.9** El sistema debe permitir exportar reporte a PDF
**RF-7.10** El sistema debe permitir filtrar por rango de fechas
**RF-7.11** El sistema debe actualizar estadísticas cada 10 segundos
**RF-7.12** El sistema debe calcular utilidad neta

### **REQUISITOS NO FUNCIONALES**

**RNF-7.1** Dashboard debe cargar en < 2 segundos
**RNF-7.2** Actualización en tiempo real sin refresh completo
**RNF-7.3** Gráficos responsive
**RNF-7.4** Export PDF < 5 segundos
**RNF-7.5** Máximo 1 año de histórico en gráficos

### **API ENDPOINTS**

```typescript
// GET /api/dashboard/stats
// Estadísticas generales
Query: ?fechaInicio=...&fechaFin=...
Response: {
  ventas: {
    total: number,
    cantidad: number,
    promedio: number,
    porMetodoPago: {
      efectivo: number,
      yape: number,
      plin: number,
      tarjeta: number,
      pulsera: number
    },
    porBarra: {
      barra_1: number,
      barra_2: number
    }
  },
  productos: {
    totalVendidos: number,
    masVendidos: [
      {
        productoId: string,
        nombre: string,
        cantidad: number,
        total: number,
        imagenUrl: string
      }
    ],
    stockCritico: [
      {
        productoId: string,
        nombre: string,
        stockActual: number,
        stockInicial: number,
        porcentaje: number
      }
    ]
  },
  canciones: {
    totalSolicitudes: number,
    porTipo: {
      libres: number,
      prioritarias: number,
      vips: number
    },
    totalRecaudado: number,
    promedioEspera: number
  },
  utilidad: {
    ingresos: number,
    costos: number,
    utilidadNeta: number,
    margenPorcentaje: number
  }
}

// GET /api/dashboard/ventas-por-hora
Query: ?fecha=YYYY-MM-DD
Response: {
  ventasPorHora: [
    {
      hora: string, // "21:00"
      cantidad: number,
      monto: number
    }
  ]
}

// GET /api/dashboard/reporte-completo
// Genera reporte PDF
Query: ?fechaInicio=...&fechaFin=...
Response: PDF file

// GET /api/dashboard/real-time
// Server-Sent Events para actualizaciones en tiempo real
Response: Stream de eventos
```

### **COMPONENTES UI**

```typescript
// src/app/(dashboard)/dashboard/page.tsx
/**
 * Dashboard principal
 * Layout en grid:
 * - Fila 1: 4 KPI cards
 * - Fila 2: Gráfico ventas por hora + Top productos
 * - Fila 3: Ventas por método + Stock crítico
 */

// src/components/dashboard/KPICard.tsx
/**
 * Card de KPI
 * Props: title, value, icon, trend, color
 * 
 * Ejemplo:
 * ┌──────────────────────┐
 * │ 💰 VENTAS TOTALES   │
 * │ S/4,250.00          │
 * │ ↗ +15% vs ayer      │
 * └──────────────────────┘
 */

// src/components/dashboard/SalesChart.tsx
/**
 * Gráfico de ventas por hora
 * Usa recharts
 * Line chart con área
 * Tooltip con detalles
 */

// src/components/dashboard/TopProductsTable.tsx
/**
 * Tabla de productos más vendidos
 * Columnas:
 * - Imagen
 * - Nombre
 * - Cantidad vendida
 * - Total
 * - % del total
 */

// src/components/dashboard/PaymentMethodsChart.tsx
/**
 * Gráfico de distribución por método de pago
 * Pie chart o bar chart
 */

// src/components/dashboard/StockAlerts.tsx
/**
 * Lista de productos con stock crítico
 * Card con badge de alerta
 * Botón para reabastecer
 */

// src/components/dashboard/SalesPerBarChart.tsx
/**
 * Comparativa de ventas por barra
 * Bar chart horizontal
 */

// src/components/dashboard/ExportReportButton.tsx
/**
 * Botón para exportar reporte
 * Modal con opciones:
 * - Rango de fechas
 * - Incluir gráficos
 * - Formato (PDF/Excel)
 */
```

### **HOOKS**

```typescript
// src/hooks/useDashboardStats.ts
export function useDashboardStats(
  fechaInicio?: Date,
  fechaFin?: Date
) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.set('fechaInicio', fechaInicio.toISOString());
      if (fechaFin) params.set('fechaFin', fechaFin.toISOString());

      const res = await fetch(`/api/dashboard/stats?${params}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Actualizar cada 10 segundos
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fechaInicio, fechaFin]);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
}

// src/hooks/useRealtimeUpdates.ts
export function useRealtimeUpdates() {
  const [lastUpdate, setLastUpdate] = useState<any>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/dashboard/real-time');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastUpdate(data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return lastUpdate;
}
```

### **UTILIDADES**

```typescript
// src/lib/utils/reports.ts

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generatePDFReport(
  stats: DashboardStats,
  fechaInicio: Date,
  fechaFin: Date
): Promise<Blob> {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text('Reporte de Ventas - Halloween Party', 14, 20);
  
  // Período
  doc.setFontSize(12);
  doc.text(
    `Período: ${format(fechaInicio, 'dd/MM/yyyy')} - ${format(fechaFin, 'dd/MM/yyyy')}`,
    14,
    30
  );

  // KPIs
  doc.setFontSize(14);
  doc.text('Resumen General', 14, 45);
  
  autoTable(doc, {
    startY: 50,
    head: [['Métrica', 'Valor']],
    body: [
      ['Total Ventas', `S/${stats.ventas.total.toFixed(2)}`],
      ['Cantidad de Ventas', stats.ventas.cantidad.toString()],
      ['Ticket Promedio', `S/${stats.ventas.promedio.toFixed(2)}`],
      ['Utilidad Neta', `S/${stats.utilidad.utilidadNeta.toFixed(2)}`],
      ['Margen', `${stats.utilidad.margenPorcentaje.toFixed(1)}%`]
    ]
  });

  // Productos más vendidos
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Productos Más Vendidos', 14, 20);

  autoTable(doc, {
    startY: 25,
    head: [['Producto', 'Cantidad', 'Total']],
    body: stats.productos.masVendidos.map(p => [
      p.nombre,
      p.cantidad.toString(),
      `S/${p.total.toFixed(2)}`
    ])
  });

  return doc.output('blob');
}

export function calculateUtilidad(
  ventas: Sale[],
  productos: Product[]
): UtilidadData {
  const ingresos = ventas.reduce((sum, v) => sum + v.total, 0);
  
  const costos = ventas.reduce((sum, venta) => {
    const costosVenta = venta.items.reduce((itemSum, item) => {
      const producto = productos.find(p => p.id === item.productId);
      if (!producto) return itemSum;
      return itemSum + (producto.costoUnitario * item.cantidad);
    }, 0);
    return sum + costosVenta;
  }, 0);

  const utilidadNeta = ingresos - costos;
  const margenPorcentaje = (utilidadNeta / ingresos) * 100;

  return {
    ingresos,
    costos,
    utilidadNeta,
    margenPorcentaje
  };
}
```

### **GRÁFICOS (Recharts)**

```typescript
// Ejemplo de gráfico de ventas por hora

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SalesChart({ data }: { data: VentaPorHora[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hora" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="monto" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### **CRITERIOS DE ACEPTACIÓN**

- ✅ Dashboard muestra KPIs principales
- ✅ Gráfico de ventas por hora funciona
- ✅ Muestra top 5 productos más vendidos
- ✅ Muestra distribución por método de pago
- ✅ Alerta productos con stock < 20%
- ✅ Muestra ventas por barra
- ✅ Calcula utilidad neta correctamente
- ✅ Actualiza automáticamente cada 10 segundos
- ✅ Puede exportar reporte a PDF
- ✅ Filtro por rango de fechas funciona
- ✅ Responsive en mobile y desktop

### **INSTRUCCIONES PARA IA**

```
TAREA: Implementar dashboard de estadísticas y reportes

LIBRERÍAS:
- recharts para gráficos
- jspdf para exportar PDF
- date-fns para manejo de fechas

PASOS:
1. Crear API endpoints en app/api/dashboard/
2. Implementar cálculos de estadísticas
3. Crear página dashboard en app/(dashboard)/dashboard/page.tsx
4. Crear componentes de KPI cards
5. Crear gráficos con recharts
6. Implementar actualización automática
7. Implementar export a PDF
8. Agregar filtros de fecha

ESTADÍSTICAS A CALCULAR:
1. Ventas totales
2. Cantidad de ventas
3. Ticket promedio
4. Ventas por método de pago
5. Ventas por barra
6. Ventas por hora
7. Productos más vendidos
8. Stock crítico
9. Utilidad neta
10. Margen de ganancia

ACTUALIZACIÓN EN TIEMPO REAL:
- Polling cada 10 segundos
- O SSE para push de actualizaciones
- Animación suave al actualizar números

GRÁFICOS:
1. Line chart: Ventas por hora
2. Pie chart: Métodos de pago
3. Bar chart: Comparativa barras
4. Table: Top productos

EXPORT PDF:
- Incluir todos los KPIs
- Tabla de productos más vendidos
- Tabla de ventas por método
- Opcional: Incluir gráficos (imagen)

UI/UX:
- Grid responsive de cards
- Colores consistentes
- Iconos descriptivos
- Loading skeletons
- Animaciones suaves
- Filtros fáciles de usar

TESTING MANUAL:
1. Ver dashboard → muestra datos correctos
2. Esperar 10 segundos → actualiza
3. Hacer venta → KPIs actualizan
4. Filtrar por ayer → muestra datos de ayer
5. Click export PDF → descarga reporte
6. Abrir en mobile → responsive OK
```

---

## Credenciales de Prueba

- **Admin:** admin@halloween.com / admin123
- **Bartender:** carlos@halloween.com / bartender123

## **RESUMEN DE ENTREGABLES**

### **Módulos Completos:**

1. ✅ **Módulo 0:** Setup inicial y configuración
2. ✅ **Módulo 1:** Autenticación y gestión de usuarios
3. ✅ **Módulo 2:** Gestión de inventario (productos con S3)
4. ✅ **Módulo 3:** Gestión de ventas (POS multi-pago)
5. ✅ **Módulo 4:** Gestión de canciones (DJ Requests)
6. ✅ **Módulo 5:** Carta digital pública (con calculadora)
7. ✅ **Módulo 6:** Configuración del sistema
8. ✅ **Módulo 7:** Dashboard de estadísticas

### **Características Implementadas:**

- 🎯 Sistema completo de inventario con imágenes en S3
- 💰 Punto de venta con 5 métodos de pago
- 🎵 DJ Requests con 3 tipos (libre/prioritaria/VIP)
- 📱 Carta digital responsive con calculadora de gastos
- ⚙️ Sistema de descuentos por horario
- 📊 Dashboard con estadísticas en tiempo real
- 👥 Autenticación con 3 roles (admin/bartender/cajero)
- 📄 Export de reportes a PDF
- 🚀 Deployment automatizado con CI/CD
- ✅ Tests unitarios e integración
import { z } from 'zod';

// ============================================
// AUTH VALIDATIONS
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  rol: z.enum(['ADMIN', 'BARTENDER', 'CAJERO']),
  barra: z.string().nullable().optional(),
});

// ============================================
// PRODUCT VALIDATIONS
// ============================================

export const productSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  descripcion: z.string().max(500).optional(),
  categoria: z.enum(['CERVEZA', 'TRAGO', 'SHOT', 'SIN_ALCOHOL', 'OTRO']),
  precioBase: z.number().positive('Debe ser mayor a 0'),
  costoUnitario: z.number().positive('Debe ser mayor a 0'),
  stockInicial: z.number().int().nonnegative(),
  stockActual: z.number().int().nonnegative(),
  unidadMedida: z.enum(['UNIDAD', 'BOTELLA', 'LITRO', 'ML']).default('UNIDAD'),
  disponible: z.boolean().default(true),
}).refine(data => data.precioBase > data.costoUnitario, {
  message: 'El precio de venta debe ser mayor al costo',
  path: ['precioBase'],
});

export const stockUpdateSchema = z.object({
  cantidad: z.number().int(),
  motivo: z.enum(['venta', 'ajuste', 'devolucion']),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, 'Máximo 5MB')
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Solo JPG, PNG, WEBP'),
});

// ============================================
// SALE VALIDATIONS
// ============================================

export const saleItemSchema = z.object({
  productId: z.string().cuid(),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().positive(),
});

export const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'Debe tener al menos 1 producto'),
  descuentoPorcentaje: z.number().min(0).max(100),
  metodoPago: z.enum(['EFECTIVO', 'YAPE', 'PLIN', 'TARJETA', 'PULSERA']),
  pagoDetalles: z.object({}).passthrough(),
  barra: z.enum(['barra_1', 'barra_2']),
  notas: z.string().max(500).optional(),
});

export const pagoEfectivoSchema = z.object({
  montoRecibido: z.number().positive('Monto debe ser positivo'),
  cambio: z.number().nonnegative(),
});

export const pagoYapePlinSchema = z.object({
  numeroOperacion: z.string().min(6, 'Número de operación inválido'),
  telefono: z.string().regex(/^9\d{8}$/, 'Teléfono inválido'),
});

export const cancelSaleSchema = z.object({
  razonAnulacion: z.string().min(10, 'Debe explicar el motivo (mínimo 10 caracteres)'),
});

// ============================================
// SONG VALIDATIONS
// ============================================

export const songLibreSchema = z.object({
  titulo: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  artista: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  solicitanteNombre: z.string().max(50).optional(),
});

export const songPrioritariaSchema = z.object({
  titulo: z.string().min(2).max(100),
  artista: z.string().min(2).max(100),
});

export const songVipSchema = z.object({
  titulo: z.string().min(2).max(100),
  artista: z.string().min(2).max(100),
  dedicatoriaDe: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  dedicatoriaPara: z.string().min(2, 'Mínimo 2 caracteres').max(50),
  dedicatoriaMensaje: z.string().min(10, 'Mínimo 10 caracteres').max(200),
});

export const updateSongStatusSchema = z.object({
  estado: z.enum(['PENDIENTE', 'EN_COLA', 'REPRODUCIENDO', 'REPRODUCIDA', 'RECHAZADA']),
  notasDj: z.string().max(500).optional(),
});

// ============================================
// CONFIG VALIDATIONS
// ============================================

export const descuentoFranjaSchema = z.object({
  horaInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  horaFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  porcentaje: z.number().min(0).max(100),
  descripcion: z.string().min(3).max(100),
}).refine(data => data.horaFin > data.horaInicio, {
  message: 'Hora fin debe ser mayor a hora inicio',
  path: ['horaFin'],
});

export const descuentosConfigSchema = z.object({
  enabled: z.boolean(),
  descuentos: z.array(descuentoFranjaSchema),
});

export const eventoConfigSchema = z.object({
  eventoNombre: z.string().min(3),
  eventoFecha: z.date(),
  eventoHoraInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  eventoHoraFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  eventoAforoMaximo: z.number().int().positive(),
  eventoEstado: z.enum(['preparacion', 'activo', 'finalizado']),
});

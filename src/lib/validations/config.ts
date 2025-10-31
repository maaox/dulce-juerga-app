import { z } from 'zod';

export const descuentoFranjaSchema = z.object({
  horaInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  horaFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  porcentaje: z.number().min(0).max(100),
  descripcion: z.string().min(3).max(100)
}).refine(data => data.horaFin > data.horaInicio, {
  message: 'Hora fin debe ser mayor a hora inicio'
});

export const descuentosConfigSchema = z.object({
  enabled: z.boolean(),
  descuentos: z.array(descuentoFranjaSchema)
});

export const preciosConfigSchema = z.object({
  libre: z.number().min(0),
  prioritaria: z.number().min(0),
  vip: z.number().min(0)
});

export const cuentaPagoSchema = z.object({
  numero: z.string().optional(),
  nombre: z.string().optional(),
  qrUrl: z.string().optional(),
  qrKey: z.string().optional()
});

export const transferenciaSchema = z.object({
  banco: z.string().optional(),
  numeroCuenta: z.string().optional(),
  cci: z.string().optional(),
  titular: z.string().optional()
});

export const cuentasPagoConfigSchema = z.object({
  yape: cuentaPagoSchema.optional(),
  plin: cuentaPagoSchema.optional(),
  transferencia: transferenciaSchema.optional()
});

export const eventoConfigSchema = z.object({
  nombre: z.string().min(3).max(200),
  fecha: z.date(),
  horaInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  horaFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  aforoMaximo: z.number().min(1),
  estado: z.enum(['preparacion', 'activo', 'finalizado'])
});

export const notificationsConfigSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().optional()
});

export const configSchema = z.object({
  descuentosEnabled: z.boolean().optional(),
  descuentos: z.array(descuentoFranjaSchema).optional(),
  precioLibre: z.number().min(0).optional(),
  precioPrioritaria: z.number().min(0).optional(),
  precioVip: z.number().min(0).optional(),
  eventoNombre: z.string().min(3).max(200).optional(),
  eventoFecha: z.date().optional(),
  eventoHoraInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  eventoHoraFin: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  eventoAforoMaximo: z.number().min(1).optional(),
  eventoEstado: z.enum(['preparacion', 'activo', 'finalizado']).optional(),
  emailNotificaciones: z.string().email().optional().or(z.literal('')),
  whatsappNotificaciones: z.string().optional()
});

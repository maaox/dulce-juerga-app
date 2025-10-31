import prisma from '@/lib/prisma';

export interface DescuentoFranja {
  horaInicio: string;
  horaFin: string;
  porcentaje: number;
  descripcion: string;
}

export interface Discount {
  activo: boolean;
  porcentaje: number;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  tiempoRestanteMinutos: number;
  proximoDescuento: {
    porcentaje: number;
    horaInicio: string;
  } | null;
}

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

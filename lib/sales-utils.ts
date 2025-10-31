import { format } from 'date-fns';
import prisma from '@/lib/prisma';

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

export interface StockValidationItem {
  productId: string;
  cantidad: number;
}

export interface StockValidationResult {
  valid: boolean;
  errors: string[];
}

export async function validateStock(
  items: StockValidationItem[]
): Promise<StockValidationResult> {
  const errors: string[] = [];

  for (const item of items) {
    const producto = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!producto) {
      errors.push(`Producto ${item.productId} no encontrado`);
      continue;
    }

    if (!producto.disponible) {
      errors.push(`${producto.nombre} no está disponible`);
      continue;
    }

    if (!producto.activo) {
      errors.push(`${producto.nombre} no está activo`);
      continue;
    }

    if (producto.stockActual < item.cantidad) {
      errors.push(
        `Stock insuficiente de ${producto.nombre}. Disponible: ${producto.stockActual}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

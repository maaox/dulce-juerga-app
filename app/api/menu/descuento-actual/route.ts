import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureConfigExists, getCurrentDiscount, DescuentoFranja } from '@/lib/utils/config';

export async function GET(request: NextRequest) {
  try {
    await ensureConfigExists();

    const config = await prisma.config.findUnique({
      where: { id: 'singleton' },
      select: {
        descuentosEnabled: true,
        descuentos: true
      }
    });

    if (!config || !config.descuentosEnabled) {
      return NextResponse.json({
        porcentaje: 0,
        descripcion: 'Sin descuento activo',
        activo: false,
        tiempoRestante: 0,
        proximoDescuento: null
      });
    }

    const descuentos = config.descuentos
      ? JSON.parse(config.descuentos) as DescuentoFranja[]
      : [];

    const descuento = getCurrentDiscount(descuentos, config.descuentosEnabled);

    if (!descuento) {
      return NextResponse.json({
        porcentaje: 0,
        descripcion: 'Sin descuento activo',
        activo: false,
        tiempoRestante: 0,
        proximoDescuento: null
      });
    }

    return NextResponse.json({
      porcentaje: descuento.porcentaje,
      descripcion: descuento.descripcion,
      activo: descuento.activo,
      tiempoRestante: descuento.tiempoRestanteMinutos,
      proximoDescuento: descuento.proximoDescuento
    });
  } catch (error: any) {
    console.error('Error al obtener descuento actual:', error);
    return NextResponse.json(
      { error: 'Error al obtener descuento actual' },
      { status: 500 }
    );
  }
}

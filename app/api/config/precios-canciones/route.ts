import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureConfigExists } from '@/lib/utils/config';

// GET /api/config/precios-canciones
// Público - obtiene precios de DJ requests
export async function GET(request: NextRequest) {
  try {
    await ensureConfigExists();

    const config = await prisma.config.findUnique({
      where: { id: 'singleton' },
      select: {
        precioLibre: true,
        precioPrioritaria: true,
        precioVip: true
      }
    });

    if (!config) {
      return NextResponse.json({
        libre: 0,
        prioritaria: 5,
        vip: 8
      });
    }

    return NextResponse.json({
      libre: config.precioLibre,
      prioritaria: config.precioPrioritaria,
      vip: config.precioVip
    });
  } catch (error) {
    console.error('Error fetching precios canciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener precios' },
      { status: 500 }
    );
  }
}

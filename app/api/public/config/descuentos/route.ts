import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureConfigExists } from '@/lib/utils/config';

// GET /api/public/config/descuentos
// Public endpoint to get discount configuration
export async function GET() {
  try {
    await ensureConfigExists();

    const config = await prisma.config.findUnique({
      where: { id: 'singleton' },
      select: {
        descuentosEnabled: true,
        descuentos: true,
      }
    });

    if (!config) {
      return NextResponse.json(
        { enabled: false, descuentos: [] },
        { status: 200 }
      );
    }

    // Parse JSON fields
    const descuentos = config.descuentos ? JSON.parse(config.descuentos) : [];

    return NextResponse.json({
      enabled: config.descuentosEnabled,
      descuentos,
    });
  } catch (error) {
    console.error('Error fetching descuentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener descuentos' },
      { status: 500 }
    );
  }
}

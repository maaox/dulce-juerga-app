import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ensureConfigExists, validateDiscountFranjas } from '@/src/lib/utils/config';
import { descuentosConfigSchema } from '@/src/lib/validations/config';

export const dynamic = 'force-dynamic';

// PATCH /api/config/descuentos
// Admin actualiza solo descuentos
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = descuentosConfigSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Validate discount franjas
    const franjaValidation = validateDiscountFranjas(body.descuentos);
    if (!franjaValidation.valid) {
      return NextResponse.json(
        { error: 'Franjas inválidas', details: franjaValidation.errors },
        { status: 400 }
      );
    }

    await ensureConfigExists();

    const config = await prisma.config.update({
      where: { id: 'singleton' },
      data: {
        descuentosEnabled: body.enabled,
        descuentos: JSON.stringify(body.descuentos)
      }
    });

    // Parse JSON fields for response
    const configData = {
      ...config,
      descuentos: config.descuentos ? JSON.parse(config.descuentos) : [],
      cuentasPago: config.cuentasPago ? JSON.parse(config.cuentasPago) : null
    };

    return NextResponse.json({ config: configData });
  } catch (error) {
    console.error('Error updating descuentos:', error);
    return NextResponse.json(
      { error: 'Error al actualizar descuentos' },
      { status: 500 }
    );
  }
}

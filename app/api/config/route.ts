import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ensureConfigExists } from '@/src/lib/utils/config';
import { configSchema } from '@/src/lib/validations/config';

export const dynamic = 'force-dynamic';

// GET /api/config
// Admin obtiene toda la configuración
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    await ensureConfigExists();

    const config = await prisma.config.findUnique({
      where: { id: 'singleton' }
    });

    if (!config) {
      return NextResponse.json(
        { error: 'Configuración no encontrada' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const configData = {
      ...config,
      descuentos: config.descuentos ? JSON.parse(config.descuentos) : [],
      cuentasPago: config.cuentasPago ? JSON.parse(config.cuentasPago) : null
    };

    return NextResponse.json(configData);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

// PUT /api/config
// Admin actualiza configuración
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = configSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    await ensureConfigExists();

    const updateData: any = {};

    // Map validated fields
    if (body.descuentosEnabled !== undefined) {
      updateData.descuentosEnabled = body.descuentosEnabled;
    }
    if (body.descuentos !== undefined) {
      updateData.descuentos = JSON.stringify(body.descuentos);
    }
    if (body.precioLibre !== undefined) {
      updateData.precioLibre = body.precioLibre;
    }
    if (body.precioPrioritaria !== undefined) {
      updateData.precioPrioritaria = body.precioPrioritaria;
    }
    if (body.precioVip !== undefined) {
      updateData.precioVip = body.precioVip;
    }
    if (body.eventoNombre !== undefined) {
      updateData.eventoNombre = body.eventoNombre;
    }
    if (body.eventoFecha !== undefined) {
      updateData.eventoFecha = new Date(body.eventoFecha);
    }
    if (body.eventoHoraInicio !== undefined) {
      updateData.eventoHoraInicio = body.eventoHoraInicio;
    }
    if (body.eventoHoraFin !== undefined) {
      updateData.eventoHoraFin = body.eventoHoraFin;
    }
    if (body.eventoAforoMaximo !== undefined) {
      updateData.eventoAforoMaximo = body.eventoAforoMaximo;
    }
    if (body.eventoEstado !== undefined) {
      updateData.eventoEstado = body.eventoEstado;
    }
    if (body.emailNotificaciones !== undefined) {
      updateData.emailNotificaciones = body.emailNotificaciones || null;
    }
    if (body.whatsappNotificaciones !== undefined) {
      updateData.whatsappNotificaciones = body.whatsappNotificaciones || null;
    }

    const config = await prisma.config.update({
      where: { id: 'singleton' },
      data: updateData
    });

    // Parse JSON fields for response
    const configData = {
      ...config,
      descuentos: config.descuentos ? JSON.parse(config.descuentos) : [],
      cuentasPago: config.cuentasPago ? JSON.parse(config.cuentasPago) : null
    };

    return NextResponse.json({ config: configData });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}

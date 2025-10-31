import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH /api/songs/[id]/aprobar - Aprobar/Rechazar solicitud pagada (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { aprobado } = body;

    if (typeof aprobado !== 'boolean') {
      return NextResponse.json(
        { error: 'Aprobado debe ser true o false' },
        { status: 400 }
      );
    }

    const cancion = await prisma.song.findUnique({
      where: { id: params.id },
    });

    if (!cancion) {
      return NextResponse.json(
        { error: 'Canción no encontrada' },
        { status: 404 }
      );
    }

    // Solo se pueden aprobar/rechazar canciones pagadas pendientes
    if (cancion.tipo === 'LIBRE') {
      return NextResponse.json(
        { error: 'Las canciones libres no requieren aprobación' },
        { status: 400 }
      );
    }

    if (cancion.estado !== 'PENDIENTE') {
      return NextResponse.json(
        { error: 'Esta canción ya fue procesada' },
        { status: 400 }
      );
    }

    // Si se aprueba, calcular orden en cola
    let orden = cancion.orden;
    if (aprobado) {
      const ultimaDelTipo = await prisma.song.findFirst({
        where: {
          tipo: cancion.tipo,
          estado: 'EN_COLA',
        },
        orderBy: { orden: 'desc' },
      });

      orden = (ultimaDelTipo?.orden || 0) + 1;
    }

    // Actualizar canción
    const cancionActualizada = await prisma.song.update({
      where: { id: params.id },
      data: {
        estado: aprobado ? 'EN_COLA' : 'RECHAZADA',
        pagado: aprobado,
        orden: aprobado ? orden : 0,
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      cancion: cancionActualizada,
      mensaje: aprobado
        ? 'Solicitud aprobada y agregada a la cola'
        : 'Solicitud rechazada',
    });
  } catch (error: any) {
    console.error('Error al aprobar canción:', error);
    return NextResponse.json(
      { error: 'Error al aprobar canción' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH /api/songs/[id]/estado - Actualizar estado de canción (admin/DJ)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || !['ADMIN', 'BARTENDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { estado, notasDj } = body;

    if (!estado) {
      return NextResponse.json(
        { error: 'Estado es requerido' },
        { status: 400 }
      );
    }

    const estadosValidos = ['PENDIENTE', 'EN_COLA', 'REPRODUCIENDO', 'REPRODUCIDA', 'RECHAZADA'];
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
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

    // Validaciones especiales
    if (estado === 'REPRODUCIENDO') {
      // Marcar todas las demás canciones como no reproduciendo
      await prisma.song.updateMany({
        where: { estado: 'REPRODUCIENDO' },
        data: { estado: 'REPRODUCIDA' },
      });
    }

    // Calcular tiempo de espera si se marca como reproducida
    const tiempoEsperaMinutos =
      estado === 'REPRODUCIDA' && cancion.createdAt
        ? Math.round((Date.now() - cancion.createdAt.getTime()) / 60000)
        : null;

    // Actualizar canción
    const cancionActualizada = await prisma.song.update({
      where: { id: params.id },
      data: {
        estado,
        notasDj: notasDj || cancion.notasDj,
        fechaReproduccion: estado === 'REPRODUCIENDO' ? new Date() : cancion.fechaReproduccion,
        tiempoEsperaMinutos: tiempoEsperaMinutos || cancion.tiempoEsperaMinutos,
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

    return NextResponse.json({ cancion: cancionActualizada });
  } catch (error: any) {
    console.error('Error al actualizar estado de canción:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estado de canción' },
      { status: 500 }
    );
  }
}

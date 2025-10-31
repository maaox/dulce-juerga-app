import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { deleteFromS3 } from '@/src/lib/s3';

export const dynamic = 'force-dynamic';

// GET /api/songs/[id] - Obtener canción específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cancion = await prisma.song.findUnique({
      where: { id: params.id },
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

    if (!cancion) {
      return NextResponse.json(
        { error: 'Canción no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cancion });
  } catch (error: any) {
    console.error('Error al obtener canción:', error);
    return NextResponse.json(
      { error: 'Error al obtener canción' },
      { status: 500 }
    );
  }
}

// DELETE /api/songs/[id] - Eliminar canción (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
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

    // Eliminar comprobante de S3 si existe
    if (cancion.comprobanteKey) {
      try {
        await deleteFromS3(cancion.comprobanteKey);
      } catch (error) {
        console.error('Error al eliminar comprobante de S3:', error);
      }
    }

    // Eliminar canción
    await prisma.song.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Canción eliminada correctamente',
    });
  } catch (error: any) {
    console.error('Error al eliminar canción:', error);
    return NextResponse.json(
      { error: 'Error al eliminar canción' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH /api/songs/[id]/votar - Votar por una canción libre
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { deviceId } = body;

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID es requerido' },
        { status: 400 }
      );
    }

    // Obtener canción
    const cancion = await prisma.song.findUnique({
      where: { id: params.id },
    });

    if (!cancion) {
      return NextResponse.json(
        { error: 'Canción no encontrada' },
        { status: 404 }
      );
    }

    // Solo canciones libres pueden ser votadas
    if (cancion.tipo !== 'LIBRE') {
      return NextResponse.json(
        { error: 'Solo se pueden votar canciones libres' },
        { status: 400 }
      );
    }

    // Solo canciones en cola pueden ser votadas
    if (cancion.estado !== 'EN_COLA') {
      return NextResponse.json(
        { error: 'Esta canción ya no está en cola' },
        { status: 400 }
      );
    }

    // Verificar si ya votó
    const votosIps = cancion.votosIps ? JSON.parse(cancion.votosIps) : [];

    if (votosIps.includes(deviceId)) {
      return NextResponse.json({
        votos: cancion.votos,
        yaVoto: true,
        mensaje: 'Ya votaste por esta canción',
      });
    }

    // Agregar voto
    votosIps.push(deviceId);

    const cancionActualizada = await prisma.song.update({
      where: { id: params.id },
      data: {
        votos: { increment: 1 },
        votosIps: JSON.stringify(votosIps),
      },
    });

    return NextResponse.json({
      votos: cancionActualizada.votos,
      yaVoto: true,
      mensaje: 'Voto registrado correctamente',
    });
  } catch (error: any) {
    console.error('Error al votar canción:', error);
    return NextResponse.json(
      { error: 'Error al votar canción' },
      { status: 500 }
    );
  }
}

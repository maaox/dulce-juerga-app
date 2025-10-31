import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const ahoraSonando = await prisma.song.findFirst({
      where: { estado: 'REPRODUCIENDO' },
      include: {
        user: {
          select: {
            nombre: true,
          },
        },
      },
    });

    const libres = await prisma.song.findMany({
      where: {
        tipo: 'LIBRE',
        estado: 'EN_COLA',
      },
      orderBy: [
        { votos: 'desc' },
        { createdAt: 'asc' },
      ],
      take: 20,
    });

    const prioritarias = await prisma.song.findMany({
      where: {
        tipo: 'PRIORITARIA',
        estado: 'EN_COLA',
      },
      include: {
        user: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: [
        { orden: 'asc' },
        { createdAt: 'asc' },
      ],
      take: 10,
    });

    const vips = await prisma.song.findMany({
      where: {
        tipo: 'VIP',
        estado: 'EN_COLA',
      },
      include: {
        user: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: [
        { orden: 'asc' },
        { createdAt: 'asc' },
      ],
      take: 10,
    });

    const siguientes: any[] = [];
    const nextVip = vips[0];
    const nextPrioritaria = prioritarias[0];
    const nextLibre = libres[0];

    if (nextVip) siguientes.push(nextVip);
    if (nextPrioritaria) siguientes.push(nextPrioritaria);
    if (nextLibre && siguientes.length < 3) siguientes.push(nextLibre);

    if (siguientes.length < 3) {
      const restantes = [...vips.slice(1), ...prioritarias.slice(1), ...libres.slice(1)];
      siguientes.push(...restantes.slice(0, 3 - siguientes.length));
    }

    return NextResponse.json({
      ahoraSonando,
      libres,
      prioritarias,
      vips,
      siguientes: siguientes.slice(0, 3),
    });
  } catch (error: any) {
    console.error('Error al obtener cola pública:', error);
    return NextResponse.json(
      { error: 'Error al obtener cola pública' },
      { status: 500 }
    );
  }
}

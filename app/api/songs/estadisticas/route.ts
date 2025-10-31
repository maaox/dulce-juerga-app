import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/songs/estadisticas - Obtener estadísticas (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Total recaudado (prioritarias + VIPs)
    const cancionesPagadas = await prisma.song.findMany({
      where: {
        tipo: { in: ['PRIORITARIA', 'VIP'] },
        pagado: true,
      },
      select: {
        monto: true,
        tipo: true,
      },
    });

    const totalRecaudado = cancionesPagadas.reduce(
      (sum, c) => sum + c.monto,
      0
    );

    const totalPrioritarias = cancionesPagadas.filter(
      (c) => c.tipo === 'PRIORITARIA'
    ).length;

    const totalVips = cancionesPagadas.filter((c) => c.tipo === 'VIP').length;

    // Promedio de espera
    const cancionesReproducidas = await prisma.song.findMany({
      where: {
        estado: 'REPRODUCIDA',
        tiempoEsperaMinutos: { not: null },
      },
      select: {
        tiempoEsperaMinutos: true,
      },
    });

    const promedioEspera =
      cancionesReproducidas.length > 0
        ? Math.round(
            cancionesReproducidas.reduce(
              (sum, c) => sum + (c.tiempoEsperaMinutos || 0),
              0
            ) / cancionesReproducidas.length
          )
        : 0;

    // Canciones por estado
    const porEstado = await prisma.song.groupBy({
      by: ['estado'],
      _count: true,
    });

    // Total de canciones
    const totalCanciones = await prisma.song.count();

    return NextResponse.json({
      totalRecaudado,
      totalPrioritarias,
      totalVips,
      promedioEspera,
      totalCanciones,
      porEstado: porEstado.reduce(
        (acc, item) => {
          acc[item.estado] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

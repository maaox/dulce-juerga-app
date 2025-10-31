import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['ADMIN', 'BARTENDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const fechaParam = searchParams.get('fecha');

    // Determinar fecha
    const fecha = fechaParam ? new Date(fechaParam) : new Date();
    fecha.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);

    // Obtener ventas del día
    const ventas = await prisma.sale.findMany({
      where: {
        estado: 'COMPLETADA',
        createdAt: {
          gte: fecha,
          lt: fechaFin,
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Agrupar por hora (desde las 18:00 hasta las 06:00 del día siguiente)
    const ventasPorHora: Record<string, { cantidad: number; monto: number }> = {};

    // Inicializar todas las horas (18:00 a 05:00)
    for (let h = 18; h < 24; h++) {
      const hora = `${h.toString().padStart(2, '0')}:00`;
      ventasPorHora[hora] = { cantidad: 0, monto: 0 };
    }
    for (let h = 0; h < 6; h++) {
      const hora = `${h.toString().padStart(2, '0')}:00`;
      ventasPorHora[hora] = { cantidad: 0, monto: 0 };
    }

    // Contar ventas por hora
    ventas.forEach((venta) => {
      const hora = format(venta.createdAt, 'HH:00');
      if (ventasPorHora[hora]) {
        ventasPorHora[hora].cantidad += 1;
        ventasPorHora[hora].monto += venta.total;
      }
    });

    // Convertir a array
    const ventasPorHoraArray = Object.entries(ventasPorHora).map(
      ([hora, data]) => ({
        hora,
        cantidad: data.cantidad,
        monto: data.monto,
      })
    );

    return NextResponse.json({
      ventasPorHora: ventasPorHoraArray,
    });
  } catch (error) {
    console.error('Error fetching ventas por hora:', error);
    return NextResponse.json(
      { error: 'Error al obtener ventas por hora' },
      { status: 500 }
    );
  }
}

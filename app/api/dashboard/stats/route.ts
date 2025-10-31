import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['ADMIN', 'BARTENDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    // Filtros de fecha
    const where: any = {
      estado: 'COMPLETADA',
    };

    if (fechaInicio && fechaFin) {
      where.createdAt = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      };
    } else {
      // Por defecto, hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);

      where.createdAt = {
        gte: hoy,
        lt: manana,
      };
    }

    // Obtener ventas
    const ventas = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calcular estadísticas de ventas
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const cantidadVentas = ventas.length;
    const promedioVenta = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    // Ventas por método de pago
    const porMetodoPago = {
      efectivo: 0,
      yape: 0,
      plin: 0,
      tarjeta: 0,
      pulsera: 0,
    };

    ventas.forEach((venta) => {
      const metodo = venta.metodoPago.toLowerCase() as keyof typeof porMetodoPago;
      if (metodo in porMetodoPago) {
        porMetodoPago[metodo] += venta.total;
      }
    });

    // Ventas por barra
    const porBarra: Record<string, number> = {};
    ventas.forEach((venta) => {
      if (!porBarra[venta.barra]) {
        porBarra[venta.barra] = 0;
      }
      porBarra[venta.barra] += venta.total;
    });

    // Productos más vendidos
    const productoVentas: Record<
      string,
      { cantidad: number; total: number; producto: any }
    > = {};

    ventas.forEach((venta) => {
      venta.items.forEach((item) => {
        if (!productoVentas[item.productId]) {
          productoVentas[item.productId] = {
            cantidad: 0,
            total: 0,
            producto: item.product,
          };
        }
        productoVentas[item.productId].cantidad += item.cantidad;
        productoVentas[item.productId].total += item.subtotal;
      });
    });

    const masVendidos = Object.entries(productoVentas)
      .map(([productoId, data]) => ({
        productoId,
        nombre: data.producto.nombre,
        cantidad: data.cantidad,
        total: data.total,
        imagenUrl: data.producto.imagenUrl,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    const totalProductosVendidos = Object.values(productoVentas).reduce(
      (sum, p) => sum + p.cantidad,
      0
    );

    // Stock crítico (< 20% del stock inicial)
    const productos = await prisma.product.findMany({
      where: {
        activo: true,
      },
    });

    const stockCritico = productos
      .filter((p) => {
        const porcentaje = (p.stockActual / p.stockInicial) * 100;
        return porcentaje < 20 && porcentaje >= 0;
      })
      .map((p) => ({
        productoId: p.id,
        nombre: p.nombre,
        stockActual: p.stockActual,
        stockInicial: p.stockInicial,
        porcentaje: (p.stockActual / p.stockInicial) * 100,
      }))
      .sort((a, b) => a.porcentaje - b.porcentaje)
      .slice(0, 10);

    // Estadísticas de canciones
    const whereCanciones: any = {};
    if (fechaInicio && fechaFin) {
      whereCanciones.createdAt = {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      };
    }

    const [totalCanciones, cancionesPorTipo, cancionesPagadas] =
      await Promise.all([
        prisma.song.count({ where: whereCanciones }),
        prisma.song.groupBy({
          by: ['tipo'],
          where: whereCanciones,
          _count: true,
        }),
        prisma.song.findMany({
          where: {
            ...whereCanciones,
            pagado: true,
          },
          select: {
            monto: true,
            tiempoEsperaMinutos: true,
          },
        }),
      ]);

    const porTipoCanciones = {
      libres: 0,
      prioritarias: 0,
      vips: 0,
    };

    cancionesPorTipo.forEach((grupo) => {
      const tipo = grupo.tipo.toLowerCase() + 's';
      if (tipo in porTipoCanciones) {
        (porTipoCanciones as any)[tipo] = grupo._count;
      }
    });

    const totalRecaudadoCanciones = cancionesPagadas.reduce(
      (sum, c) => sum + c.monto,
      0
    );

    const promedioEspera =
      cancionesPagadas.length > 0
        ? cancionesPagadas.reduce(
            (sum, c) => sum + (c.tiempoEsperaMinutos || 0),
            0
          ) / cancionesPagadas.length
        : 0;

    // Calcular utilidad
    const ingresos = totalVentas + totalRecaudadoCanciones;

    const costos = ventas.reduce((sum, venta) => {
      const costosVenta = venta.items.reduce((itemSum, item) => {
        return itemSum + (item.product.costoUnitario * item.cantidad);
      }, 0);
      return sum + costosVenta;
    }, 0);

    const utilidadNeta = ingresos - costos;
    const margenPorcentaje = ingresos > 0 ? (utilidadNeta / ingresos) * 100 : 0;

    return NextResponse.json({
      ventas: {
        total: totalVentas,
        cantidad: cantidadVentas,
        promedio: promedioVenta,
        porMetodoPago,
        porBarra,
      },
      productos: {
        totalVendidos: totalProductosVendidos,
        masVendidos,
        stockCritico,
      },
      canciones: {
        totalSolicitudes: totalCanciones,
        porTipo: porTipoCanciones,
        totalRecaudado: totalRecaudadoCanciones,
        promedioEspera,
      },
      utilidad: {
        ingresos,
        costos,
        utilidadNeta,
        margenPorcentaje,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}

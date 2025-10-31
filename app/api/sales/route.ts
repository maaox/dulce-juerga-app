import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import prisma from '../../../lib/prisma';
import { saleSchema } from '../../../src/lib/validations';
import { generateSaleCode, validateStock } from '../../../src/lib/sales-utils';

export const dynamic = 'force-dynamic';

// GET /api/sales - Listar ventas con filtros
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const barra = searchParams.get('barra');
    const metodoPago = searchParams.get('metodoPago');
    const estado = searchParams.get('estado');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    // Si es bartender, solo ver sus ventas
    if (session.user.role === 'BARTENDER') {
      where.userId = session.user.id;
      if (session.user.barra) {
        where.barra = session.user.barra;
      }
    }

    if (fechaInicio) {
      where.createdAt = { gte: new Date(fechaInicio) };
    }

    if (fechaFin) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(fechaFin),
      };
    }

    if (barra) {
      where.barra = barra;
    }

    if (metodoPago) {
      where.metodoPago = metodoPago;
    }

    if (estado) {
      where.estado = estado;
    }

    // Obtener ventas y totales
    const [ventas, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              nombre: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  nombre: true,
                  imagenUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sale.count({ where }),
    ]);

    // Calcular estadísticas
    const estadisticas = await prisma.sale.aggregate({
      where,
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Desglose por método de pago
    const porMetodoPago = await prisma.sale.groupBy({
      by: ['metodoPago'],
      where,
      _sum: {
        total: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      ventas,
      total,
      page,
      totalPages,
      estadisticas: {
        totalVentas: estadisticas._sum.total || 0,
        cantidadVentas: estadisticas._count,
        totalEfectivo: porMetodoPago.find((m) => m.metodoPago === 'EFECTIVO')?._sum.total || 0,
        totalYape: porMetodoPago.find((m) => m.metodoPago === 'YAPE')?._sum.total || 0,
        totalPlin: porMetodoPago.find((m) => m.metodoPago === 'PLIN')?._sum.total || 0,
        totalTarjeta: porMetodoPago.find((m) => m.metodoPago === 'TARJETA')?._sum.total || 0,
        totalPulsera: porMetodoPago.find((m) => m.metodoPago === 'PULSERA')?._sum.total || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { error: 'Error al obtener ventas' },
      { status: 500 }
    );
  }
}

// POST /api/sales - Crear venta
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();

    // Validar datos
    const validatedData = saleSchema.parse(body);

    // Validar stock antes de crear la venta
    const stockValidation = await validateStock(
      validatedData.items.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
      }))
    );

    if (!stockValidation.valid) {
      return NextResponse.json(
        { error: 'Stock insuficiente', details: stockValidation.errors },
        { status: 400 }
      );
    }

    // Generar código único
    const codigo = generateSaleCode();

    // Calcular totales
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.precioUnitario * item.cantidad,
      0
    );

    const descuentoMonto = subtotal * (validatedData.descuentoPorcentaje / 100);
    const total = subtotal - descuentoMonto;

    // Crear venta en transacción
    const venta = await prisma.$transaction(async (tx) => {
      // Crear venta
      const nuevaVenta = await tx.sale.create({
        data: {
          codigo,
          userId: session.user.id,
          barra: validatedData.barra,
          subtotal,
          descuentoPorcentaje: validatedData.descuentoPorcentaje,
          descuentoMonto,
          total,
          metodoPago: validatedData.metodoPago,
          pagoDetalles: JSON.stringify(validatedData.pagoDetalles),
          notas: validatedData.notas,
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              nombreProducto: '', // Se llenará después
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              subtotal: item.precioUnitario * item.cantidad,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Actualizar nombres de productos y stock
      for (const item of nuevaVenta.items) {
        // Actualizar nombre del producto en el item
        await tx.saleItem.update({
          where: { id: item.id },
          data: { nombreProducto: item.product.nombre },
        });

        // Descontar stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockActual: {
              decrement: item.cantidad,
            },
          },
        });
      }

      return nuevaVenta;
    });

    return NextResponse.json(
      {
        venta,
        codigo,
        total,
        message: 'Venta creada correctamente',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating sale:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear venta' },
      { status: 500 }
    );
  }
}

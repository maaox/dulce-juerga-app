import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { cancelSaleSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

// PATCH /api/sales/[id]/anular - Anular venta (solo admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const { razonAnulacion } = cancelSaleSchema.parse(body);

    const venta = await prisma.sale.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    if (venta.estado === 'ANULADA') {
      return NextResponse.json(
        { error: 'La venta ya está anulada' },
        { status: 400 }
      );
    }

    // Anular venta en transacción
    const ventaAnulada = await prisma.$transaction(async (tx) => {
      // Actualizar estado de venta
      const updated = await tx.sale.update({
        where: { id: params.id },
        data: {
          estado: 'ANULADA',
          anuladaPor: session.user.id,
          razonAnulacion,
          fechaAnulacion: new Date(),
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Devolver stock
      for (const item of updated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockActual: {
              increment: item.cantidad,
            },
          },
        });
      }

      return updated;
    });

    return NextResponse.json({
      venta: ventaAnulada,
      message: 'Venta anulada correctamente. Stock devuelto.',
    });
  } catch (error: any) {
    console.error('Error canceling sale:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al anular venta' },
      { status: 500 }
    );
  }
}

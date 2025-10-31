import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../lib/prisma';
import { stockUpdateSchema } from '../../../../../src/lib/validations';

export const dynamic = 'force-dynamic';

// PATCH /api/products/[id]/stock - Actualizar stock
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'CAJERO')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const { cantidad, motivo } = stockUpdateSchema.parse(body);

    const producto = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    let nuevoStock = producto.stockActual;

    switch (motivo) {
      case 'venta':
        nuevoStock -= cantidad;
        break;
      case 'ajuste':
        nuevoStock = cantidad;
        break;
      case 'devolucion':
        nuevoStock += cantidad;
        break;
    }

    if (nuevoStock < 0) {
      return NextResponse.json(
        { error: 'Stock no puede ser negativo' },
        { status: 400 }
      );
    }

    const productoActualizado = await prisma.product.update({
      where: { id: params.id },
      data: { stockActual: nuevoStock },
    });

    return NextResponse.json({
      producto: productoActualizado,
      nuevoStock,
      cambio: nuevoStock - producto.stockActual,
    });
  } catch (error: any) {
    console.error('Error updating stock:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar stock' },
      { status: 500 }
    );
  }
}

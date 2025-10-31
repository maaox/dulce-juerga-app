import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/sales/[id] - Obtener una venta
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const venta = await prisma.sale.findUnique({
      where: { id: params.id },
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
                categoria: true,
                imagenUrl: true,
              },
            },
          },
        },
      },
    });

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    // Si es bartender, solo puede ver sus propias ventas
    if (session.user.role === 'BARTENDER' && venta.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json({ venta });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { error: 'Error al obtener venta' },
      { status: 500 }
    );
  }
}

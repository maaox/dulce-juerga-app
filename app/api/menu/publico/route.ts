import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ensureConfigExists, getCurrentDiscount, DescuentoFranja } from '@/src/lib/utils/config';

export async function GET(request: NextRequest) {
  try {
    // Obtener productos disponibles
    const productos = await prisma.product.findMany({
      where: {
        disponible: true,
        activo: true,
        stockActual: {
          gt: 0,
        },
      },
      orderBy: [
        { categoria: 'asc' },
        { nombre: 'asc' },
      ],
    });

    // Obtener descuento actual desde Config
    await ensureConfigExists();

    const config = await prisma.config.findUnique({
      where: { id: 'singleton' },
      select: {
        descuentosEnabled: true,
        descuentos: true
      }
    });

    let descuentoActual = {
      porcentaje: 0,
      descripcion: 'Sin descuento',
      horaInicio: '',
      horaFin: '',
      tiempoRestanteMinutos: 0,
      activo: false,
    };

    if (config && config.descuentosEnabled) {
      const descuentos = config.descuentos
        ? JSON.parse(config.descuentos) as DescuentoFranja[]
        : [];

      const descuento = getCurrentDiscount(descuentos, config.descuentosEnabled);

      if (descuento) {
        descuentoActual = {
          porcentaje: descuento.porcentaje,
          descripcion: descuento.descripcion,
          horaInicio: descuento.horaInicio,
          horaFin: descuento.horaFin,
          tiempoRestanteMinutos: descuento.tiempoRestanteMinutos,
          activo: descuento.activo,
        };
      }
    }

    // Aplicar descuento a productos
    const productosConDescuento = productos.map((producto) => {
      const precioBase = Number(producto.precioBase);
      const descuento = descuentoActual.activo ? descuentoActual.porcentaje : 0;
      const precioActual = precioBase * (1 - descuento / 100);

      return {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        imagenUrl: producto.imagenUrl,
        precioBase,
        precioActual,
        descuentoPorcentaje: descuento,
        disponible: producto.disponible,
        stockActual: producto.stockActual,
        opciones: producto.opciones ? JSON.parse(producto.opciones) : null,
      };
    });

    return NextResponse.json({
      productos: productosConDescuento,
      descuentoActual,
    });
  } catch (error: any) {
    console.error('Error al obtener menú público:', error);
    return NextResponse.json(
      { error: 'Error al obtener menú público' },
      { status: 500 }
    );
  }
}

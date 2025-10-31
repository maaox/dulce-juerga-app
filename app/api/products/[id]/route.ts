import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { productSchema } from '@/lib/validations';
import { uploadToS3, deleteFromS3 } from '@/lib/s3';

export const dynamic = 'force-dynamic';

// GET /api/products/[id] - Obtener un producto
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const producto = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ producto });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'CAJERO')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const formData = await req.formData();
    const data = {
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string || undefined,
      categoria: formData.get('categoria') as string,
      precioBase: parseFloat(formData.get('precioBase') as string),
      costoUnitario: parseFloat(formData.get('costoUnitario') as string),
      stockInicial: parseInt(formData.get('stockInicial') as string),
      stockActual: parseInt(formData.get('stockActual') as string),
      unidadMedida: formData.get('unidadMedida') as string || 'UNIDAD',
      disponible: formData.get('disponible') === 'true',
    };

    // Validar datos
    const validatedData = productSchema.parse(data);

    // Obtener producto actual
    const productoActual = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!productoActual) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Procesar nueva imagen si existe
    let imagenUrl = productoActual.imagenUrl;
    let imagenKey = productoActual.imagenKey;

    const imagen = formData.get('imagen') as File | null;
    if (imagen && imagen.size > 0) {
      // Eliminar imagen anterior si existe
      if (productoActual.imagenKey) {
        try {
          await deleteFromS3(productoActual.imagenKey);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Subir nueva imagen
      const buffer = Buffer.from(await imagen.arrayBuffer());
      const upload = await uploadToS3(buffer, imagen.name, imagen.type, 'productos');
      imagenUrl = upload.url;
      imagenKey = upload.key;
    }

    // Actualizar producto
    const producto = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        imagenUrl,
        imagenKey,
      },
    });

    return NextResponse.json({ producto });
  } catch (error: any) {
    console.error('Error updating product:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Eliminar producto (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const producto = await prisma.product.update({
      where: { id: params.id },
      data: { activo: false },
    });

    return NextResponse.json({
      message: 'Producto eliminado correctamente',
      producto,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}

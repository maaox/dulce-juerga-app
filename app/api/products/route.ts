import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import prisma from '../../../lib/prisma';
import { productSchema } from '../../../src/lib/validations';
import { uploadToS3, deleteFromS3 } from '../../../src/lib/s3';

export const dynamic = 'force-dynamic';

// GET /api/products - Listar productos con filtros y paginación
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoria = searchParams.get('categoria');
    const buscar = searchParams.get('buscar');
    const disponible = searchParams.get('disponible');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = { activo: true };

    if (categoria && categoria !== 'todas') {
      where.categoria = categoria;
    }

    if (buscar) {
      where.nombre = {
        contains: buscar,
        mode: 'insensitive',
      };
    }

    if (disponible !== null && disponible !== undefined) {
      where.disponible = disponible === 'true';
    }

    // Obtener productos y total
    const [productos, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      productos,
      total,
      page,
      limit,
      totalPages,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear producto
export async function POST(req: NextRequest) {
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

    // Procesar imagen si existe
    let imagenUrl: string | undefined;
    let imagenKey: string | undefined;

    const imagen = formData.get('imagen') as File | null;
    if (imagen && imagen.size > 0) {
      const buffer = Buffer.from(await imagen.arrayBuffer());
      const upload = await uploadToS3(buffer, imagen.name, imagen.type, 'productos');
      imagenUrl = upload.url;
      imagenKey = upload.key;
    }

    // Crear producto
    const producto = await prisma.product.create({
      data: {
        ...validatedData,
        imagenUrl,
        imagenKey,
      },
    });

    return NextResponse.json({ producto }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

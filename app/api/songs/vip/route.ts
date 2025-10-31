import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { uploadToS3 } from '@/src/lib/s3';
import { ensureConfigExists } from '@/src/lib/utils/config';

// POST /api/songs/vip - Crear solicitud VIP (pública)
export async function POST(request: NextRequest) {
  try {
    // Obtener precio desde Config
    await ensureConfigExists();
    const config = await prisma.config.findUnique({
      where: { id: 'singleton' },
      select: { precioVip: true }
    });
    const precioVip = config?.precioVip || 8.0;

    const formData = await request.formData();
    const titulo = formData.get('titulo') as string;
    const artista = formData.get('artista') as string;
    const solicitanteNombre = formData.get('solicitanteNombre') as string;
    const dedicatoriaDe = formData.get('dedicatoriaDe') as string;
    const dedicatoriaPara = formData.get('dedicatoriaPara') as string;
    const dedicatoriaMensaje = formData.get('dedicatoriaMensaje') as string;
    const comprobanteFile = formData.get('comprobante') as File;

    // Validaciones
    if (!titulo || !artista) {
      return NextResponse.json(
        { error: 'Título y artista son requeridos' },
        { status: 400 }
      );
    }

    if (!dedicatoriaDe || !dedicatoriaPara) {
      return NextResponse.json(
        { error: 'Dedicatoria de y para son requeridos' },
        { status: 400 }
      );
    }

    if (!comprobanteFile) {
      return NextResponse.json(
        { error: 'Comprobante de pago es requerido' },
        { status: 400 }
      );
    }

    // Validar archivo
    if (comprobanteFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El comprobante no debe superar 5MB' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(comprobanteFile.type)) {
      return NextResponse.json(
        { error: 'Solo se permiten imágenes JPG, PNG o WEBP' },
        { status: 400 }
      );
    }

    // Subir comprobante a S3
    const buffer = Buffer.from(await comprobanteFile.arrayBuffer());
    const { url, key } = await uploadToS3(
      buffer,
      comprobanteFile.name,
      comprobanteFile.type,
      'comprobantes/canciones'
    );

    // Obtener IP del solicitante
    const ipSolicitante =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Crear canción (estado PENDIENTE hasta aprobación)
    const cancion = await prisma.song.create({
      data: {
        titulo,
        artista,
        tipo: 'VIP',
        solicitanteNombre: solicitanteNombre || 'Anónimo',
        dedicatoriaDe,
        dedicatoriaPara,
        dedicatoriaMensaje: dedicatoriaMensaje || null,
        estado: 'PENDIENTE',
        monto: precioVip,
        pagado: false,
        comprobanteUrl: url,
        comprobanteKey: key,
        ipSolicitante,
        orden: 0,
      },
    });

    return NextResponse.json({
      cancion,
      estado: 'pendiente_aprobacion',
      mensaje:
        'Tu solicitud VIP está pendiente de aprobación. El DJ revisará tu comprobante y tu dedicatoria será mencionada al reproducir la canción.',
    });
  } catch (error: any) {
    console.error('Error al crear solicitud VIP:', error);
    return NextResponse.json(
      { error: 'Error al crear solicitud VIP' },
      { status: 500 }
    );
  }
}

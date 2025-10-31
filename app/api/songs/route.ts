import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/songs - Listar canciones (admin/DJ)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !["ADMIN", "BARTENDER"].includes(session.user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");
    const estado = searchParams.get("estado");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tipo) where.tipo = tipo;
    if (estado)
      where.estado =
        estado === "EN_COLA,REPRODUCIENDO,PENDIENTE"
          ? { in: ["EN_COLA", "REPRODUCIENDO", "PENDIENTE"] }
          : estado;

    const [canciones, total, stats] = await Promise.all([
      prisma.song.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
        },
        orderBy: [
          { tipo: "desc" }, // VIP > PRIORITARIA > LIBRE
          { orden: "asc" },
          { votos: "desc" },
          { createdAt: "asc" },
        ],
        skip,
        take: limit,
      }),
      prisma.song.count({ where }),
      prisma.song.groupBy({
        by: ["tipo"],
        _count: true,
      }),
    ]);

    const porTipo = {
      libres: stats.find((s) => s.tipo === "LIBRE")?._count || 0,
      prioritarias: stats.find((s) => s.tipo === "PRIORITARIA")?._count || 0,
      vips: stats.find((s) => s.tipo === "VIP")?._count || 0,
    };

    return NextResponse.json({
      canciones,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      porTipo,
    });
  } catch (error: any) {
    console.error("Error al obtener canciones:", error);
    return NextResponse.json(
      { error: "Error al obtener canciones" },
      { status: 500 }
    );
  }
}

// POST /api/songs - Crear solicitud libre (pública)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, artista, solicitanteNombre } = body;
    console.log("Received song request:", body);

    // Validaciones
    if (!titulo || !artista) {
      return NextResponse.json(
        { error: "Título y artista son requeridos" },
        { status: 400 }
      );
    }

    // Obtener IP del solicitante
    const ipSolicitante =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Verificar límite de canciones libres en cola (100 max)
    const cancionesLibresEnCola = await prisma.song.count({
      where: {
        tipo: "LIBRE",
        estado: { in: ["PENDIENTE", "EN_COLA"] },
      },
    });

    if (cancionesLibresEnCola >= 100) {
      return NextResponse.json(
        { error: "La cola de solicitudes libres está llena" },
        { status: 400 }
      );
    }

    // Calcular orden (última canción libre + 1)
    const ultimaLibre = await prisma.song.findFirst({
      where: { tipo: "LIBRE", estado: "EN_COLA" },
      orderBy: { orden: "desc" },
    });

    const orden = (ultimaLibre?.orden || 0) + 1;

    // Crear canción
    const cancion = await prisma.song.create({
      data: {
        titulo,
        artista,
        tipo: "LIBRE",
        solicitanteNombre: solicitanteNombre || "Anónimo",
        estado: "EN_COLA",
        orden,
        ipSolicitante,
      },
    });

    // Calcular posición en cola y tiempo estimado
    const posicionEnCola = cancionesLibresEnCola + 1;
    const tiempoEstimado = posicionEnCola * 3; // 3 minutos por canción

    return NextResponse.json({
      cancion,
      posicionEnCola,
      tiempoEstimado,
    });
  } catch (error: any) {
    console.error("Error al crear canción:", error);
    return NextResponse.json(
      { error: "Error al crear canción" },
      { status: 500 }
    );
  }
}

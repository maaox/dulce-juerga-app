import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ensureConfigExists } from '@/lib/utils/config';
import { uploadToS3, deleteFromS3 } from '@/lib/s3';

export const dynamic = 'force-dynamic';

// GET /api/config/cuentas-pago
// Público - obtiene info de pago (sin datos sensibles)
export async function GET(request: NextRequest) {
  try {
    await ensureConfigExists();

    const config = await prisma.config.findUnique({
      where: { id: 'singleton' },
      select: {
        cuentasPago: true
      }
    });

    if (!config || !config.cuentasPago) {
      return NextResponse.json({
        yape: null,
        plin: null,
        transferencia: null
      });
    }

    const cuentas = JSON.parse(config.cuentasPago);

    return NextResponse.json({
      yape: cuentas.yape ? {
        numero: cuentas.yape.numero,
        nombre: cuentas.yape.nombre,
        qrUrl: cuentas.yape.qrUrl
      } : null,
      plin: cuentas.plin ? {
        numero: cuentas.plin.numero,
        nombre: cuentas.plin.nombre,
        qrUrl: cuentas.plin.qrUrl
      } : null,
      transferencia: cuentas.transferencia ? {
        banco: cuentas.transferencia.banco,
        numeroCuenta: cuentas.transferencia.numeroCuenta,
        cci: cuentas.transferencia.cci,
        titular: cuentas.transferencia.titular
      } : null
    });
  } catch (error) {
    console.error('Error fetching cuentas pago:', error);
    return NextResponse.json(
      { error: 'Error al obtener cuentas de pago' },
      { status: 500 }
    );
  }
}

// PATCH /api/config/cuentas-pago
// Admin actualiza cuentas de pago con posibles QR uploads
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }

    await ensureConfigExists();

    const formData = await request.formData();

    // Get current config
    const currentConfig = await prisma.config.findUnique({
      where: { id: 'singleton' }
    });

    const currentCuentas = currentConfig?.cuentasPago
      ? JSON.parse(currentConfig.cuentasPago)
      : {};

    const newCuentas: any = { ...currentCuentas };

    // Process Yape
    const yapeNumero = formData.get('yapeNumero') as string | null;
    const yapeNombre = formData.get('yapeNombre') as string | null;
    const yapeQr = formData.get('yapeQr') as File | null;

    if (yapeNumero || yapeNombre || yapeQr) {
      if (!newCuentas.yape) newCuentas.yape = {};

      if (yapeNumero) newCuentas.yape.numero = yapeNumero;
      if (yapeNombre) newCuentas.yape.nombre = yapeNombre;

      if (yapeQr && yapeQr.size > 0) {
        // Delete old QR if exists
        if (newCuentas.yape.qrKey) {
          await deleteFromS3(newCuentas.yape.qrKey);
        }

        // Upload new QR
        const buffer = Buffer.from(await yapeQr.arrayBuffer());
        const { url, key } = await uploadToS3(
          buffer,
          `pagos/yape-qr-${Date.now()}.jpg`,
          yapeQr.type
        );

        newCuentas.yape.qrUrl = url;
        newCuentas.yape.qrKey = key;
      }
    }

    // Process Plin
    const plinNumero = formData.get('plinNumero') as string | null;
    const plinNombre = formData.get('plinNombre') as string | null;
    const plinQr = formData.get('plinQr') as File | null;

    if (plinNumero || plinNombre || plinQr) {
      if (!newCuentas.plin) newCuentas.plin = {};

      if (plinNumero) newCuentas.plin.numero = plinNumero;
      if (plinNombre) newCuentas.plin.nombre = plinNombre;

      if (plinQr && plinQr.size > 0) {
        // Delete old QR if exists
        if (newCuentas.plin.qrKey) {
          await deleteFromS3(newCuentas.plin.qrKey);
        }

        // Upload new QR
        const buffer = Buffer.from(await plinQr.arrayBuffer());
        const { url, key } = await uploadToS3(
          buffer,
          `pagos/plin-qr-${Date.now()}.jpg`,
          plinQr.type
        );

        newCuentas.plin.qrUrl = url;
        newCuentas.plin.qrKey = key;
      }
    }

    // Process Transferencia
    const transfBanco = formData.get('transferenciaBanco') as string | null;
    const transfCuenta = formData.get('transferenciaNumeroCuenta') as string | null;
    const transfCci = formData.get('transferenciaCci') as string | null;
    const transfTitular = formData.get('transferenciaTitular') as string | null;

    if (transfBanco || transfCuenta || transfCci || transfTitular) {
      if (!newCuentas.transferencia) newCuentas.transferencia = {};

      if (transfBanco) newCuentas.transferencia.banco = transfBanco;
      if (transfCuenta) newCuentas.transferencia.numeroCuenta = transfCuenta;
      if (transfCci) newCuentas.transferencia.cci = transfCci;
      if (transfTitular) newCuentas.transferencia.titular = transfTitular;
    }

    // Update config
    const config = await prisma.config.update({
      where: { id: 'singleton' },
      data: {
        cuentasPago: JSON.stringify(newCuentas)
      }
    });

    // Parse JSON fields for response
    const configData = {
      ...config,
      descuentos: config.descuentos ? JSON.parse(config.descuentos) : [],
      cuentasPago: config.cuentasPago ? JSON.parse(config.cuentasPago) : null
    };

    return NextResponse.json({ config: configData });
  } catch (error) {
    console.error('Error updating cuentas pago:', error);
    return NextResponse.json(
      { error: 'Error al actualizar cuentas de pago' },
      { status: 500 }
    );
  }
}

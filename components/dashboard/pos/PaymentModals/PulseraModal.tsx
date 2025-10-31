"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseCartReturn } from "@/src/hooks/useCart";
import { useSales } from "@/src/hooks/useSales";
import { Watch, AlertCircle, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PulseraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: UseCartReturn;
  onSuccess: () => void;
}

// Mock wristband validation (in production, integrate with actual wristband system)
const MOCK_WRISTBANDS = {
  "PUL001": { saldo: 100, nombre: "Juan Pérez" },
  "PUL002": { saldo: 50, nombre: "María García" },
  "PUL003": { saldo: 150, nombre: "Carlos López" },
  "PUL004": { saldo: 5, nombre: "Ana Torres" },
};

export function PulseraModal({
  open,
  onOpenChange,
  cart,
  onSuccess,
}: PulseraModalProps) {
  const { data: session } = useSession();
  const { createSale, loading } = useSales();
  const [idPulsera, setIdPulsera] = useState("");
  const [pulseraInfo, setPulseraInfo] = useState<{
    saldo: number;
    nombre: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidatePulsera = () => {
    setValidationError(null);
    setPulseraInfo(null);

    if (!idPulsera.trim()) {
      setValidationError("Ingresa el ID de la pulsera");
      return;
    }

    // Mock validation (replace with actual API call)
    const wristband = MOCK_WRISTBANDS[idPulsera as keyof typeof MOCK_WRISTBANDS];

    if (!wristband) {
      setValidationError("Pulsera no encontrada o inválida");
      return;
    }

    if (wristband.saldo < cart.total) {
      setValidationError(
        `Saldo insuficiente. Disponible: S/${wristband.saldo.toFixed(2)}`
      );
      setPulseraInfo(wristband);
      return;
    }

    setPulseraInfo(wristband);
  };

  const handleSubmit = async () => {
    if (!pulseraInfo || !session?.user?.barra) return;

    const result = await createSale({
      items: cart.items.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      })),
      descuentoPorcentaje: cart.descuentoPorcentaje,
      metodoPago: "PULSERA",
      pagoDetalles: {
        idPulsera,
        saldoAnterior: pulseraInfo.saldo,
        saldoNuevo: pulseraInfo.saldo - cart.total,
      },
      barra: session.user.barra,
    });

    if (result) {
      setIdPulsera("");
      setPulseraInfo(null);
      setValidationError(null);
      onSuccess();
    }
  };

  const handleClose = () => {
    setIdPulsera("");
    setPulseraInfo(null);
    setValidationError(null);
    onOpenChange(false);
  };

  const isSaldoSuficiente =
    pulseraInfo && pulseraInfo.saldo >= cart.total;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5 text-pink-500" />
            Pago con Pulsera
          </DialogTitle>
          <DialogDescription>
            Escanea o ingresa el ID de la pulsera
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Total a Pagar */}
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Total a pagar:</div>
            <div className="text-3xl font-bold">S/{cart.total.toFixed(2)}</div>
          </div>

          <Separator />

          {/* ID de Pulsera */}
          <div className="space-y-2">
            <Label htmlFor="idPulsera">
              ID de Pulsera <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="idPulsera"
                type="text"
                value={idPulsera}
                onChange={(e) => {
                  setIdPulsera(e.target.value.toUpperCase());
                  setPulseraInfo(null);
                  setValidationError(null);
                }}
                placeholder="Ej: PUL001"
                className="uppercase"
                autoFocus
              />
              <Button
                onClick={handleValidatePulsera}
                disabled={!idPulsera.trim() || loading}
                variant="outline"
              >
                Validar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Prueba con: PUL001, PUL002, PUL003
            </p>
          </div>

          {/* Validation Error */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Pulsera Info */}
          {pulseraInfo && (
            <Alert
              variant={isSaldoSuficiente ? "default" : "destructive"}
              className={
                isSaldoSuficiente
                  ? "border-green-500 bg-green-500/10"
                  : ""
              }
            >
              <CheckCircle2
                className={`h-4 w-4 ${isSaldoSuficiente ? "text-green-500" : ""}`}
              />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">{pulseraInfo.nombre}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Saldo actual:</span>
                    <span className="font-bold">
                      S/{pulseraInfo.saldo.toFixed(2)}
                    </span>
                  </div>
                  {isSaldoSuficiente && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Saldo después:</span>
                      <span className="font-bold text-green-600">
                        S/{(pulseraInfo.saldo - cart.total).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isSaldoSuficiente || loading}
            className="bg-pink-500 hover:bg-pink-600"
          >
            {loading ? "Procesando..." : "Completar Venta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

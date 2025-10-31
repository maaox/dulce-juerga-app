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
import { Banknote, ArrowRightLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EfectivoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: UseCartReturn;
  onSuccess: () => void;
}

export function EfectivoModal({
  open,
  onOpenChange,
  cart,
  onSuccess,
}: EfectivoModalProps) {
  const { data: session } = useSession();
  const { createSale, loading } = useSales();
  const [montoRecibido, setMontoRecibido] = useState("");

  const cambio = parseFloat(montoRecibido || "0") - cart.total;
  const esPagoValido = parseFloat(montoRecibido || "0") >= cart.total;

  const handleSubmit = async () => {
    if (!esPagoValido || !session?.user?.barra) return;

    const result = await createSale({
      items: cart.items.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      })),
      descuentoPorcentaje: cart.descuentoPorcentaje,
      metodoPago: "EFECTIVO",
      pagoDetalles: {
        montoRecibido: parseFloat(montoRecibido),
        cambio: cambio,
      },
      barra: session.user.barra,
    });

    if (result) {
      setMontoRecibido("");
      onSuccess();
    }
  };

  const handleClose = () => {
    setMontoRecibido("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-green-500" />
            Pago en Efectivo
          </DialogTitle>
          <DialogDescription>
            Ingresa el monto recibido del cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Total a Pagar */}
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Total a pagar:</div>
            <div className="text-3xl font-bold">S/{cart.total.toFixed(2)}</div>
          </div>

          {/* Monto Recibido */}
          <div className="space-y-2">
            <Label htmlFor="montoRecibido">Monto Recibido (S/)</Label>
            <Input
              id="montoRecibido"
              type="number"
              step="0.01"
              min={cart.total}
              value={montoRecibido}
              onChange={(e) => setMontoRecibido(e.target.value)}
              placeholder="0.00"
              autoFocus
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[
              Math.ceil(cart.total),
              Math.ceil(cart.total / 10) * 10,
              Math.ceil(cart.total / 20) * 20,
              Math.ceil(cart.total / 50) * 50,
            ].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setMontoRecibido(amount.toString())}
                className="text-xs"
              >
                S/{amount}
              </Button>
            ))}
          </div>

          {/* Cambio */}
          {montoRecibido && (
            <>
              <Separator />
              <div
                className={`flex items-center justify-between rounded-lg p-4 ${
                  esPagoValido ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="font-medium">Cambio:</span>
                </div>
                <span
                  className={`text-2xl font-bold ${
                    esPagoValido ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {esPagoValido ? `S/${cambio.toFixed(2)}` : "Insuficiente"}
                </span>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!esPagoValido || loading}
            className="bg-green-500 hover:bg-green-600"
          >
            {loading ? "Procesando..." : "Completar Venta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

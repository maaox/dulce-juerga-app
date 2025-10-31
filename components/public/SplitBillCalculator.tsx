"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCalculator } from "@/src/hooks/useCalculator";
import { CalculatorItem } from "./CalculatorItem";
import { Users, Share2, RefreshCw, Wallet } from "lucide-react";
import { formatPrice } from "@/src/lib/utils/pricing";

interface SplitBillCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculator: ReturnType<typeof useCalculator>;
}

export function SplitBillCalculator({
  open,
  onOpenChange,
  calculator,
}: SplitBillCalculatorProps) {
  const handlePersonasChange = (delta: number) => {
    const newValue = Math.max(1, calculator.numPersonas + delta);
    calculator.setNumPersonas(newValue);
  };

  const handleClearAll = () => {
    if (confirm("¿Estás seguro de limpiar toda la calculadora?")) {
      calculator.clearCalculator();
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <Wallet className="h-6 w-6" />
            Dividir Gastos
          </SheetTitle>
          <SheetDescription>
            Calcula cuánto debe pagar cada persona
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Number of People */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Número de personas</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePersonasChange(-1)}
                disabled={calculator.numPersonas <= 1}
              >
                -
              </Button>
              <div className="flex h-12 flex-1 items-center justify-center rounded-lg border bg-muted text-2xl font-bold">
                <Users className="mr-2 h-5 w-5" />
                {calculator.numPersonas}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePersonasChange(1)}
              >
                +
              </Button>
            </div>
          </div>

          <Separator />

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold">
              Productos Seleccionados ({calculator.items.length})
            </h3>

            {calculator.isEmpty ? (
              <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">No hay productos agregados</p>
                  <p className="mt-1 text-xs">
                    Agrega productos desde la carta
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
                {calculator.items.map((item) => (
                  <CalculatorItem
                    key={item.producto.id}
                    item={item}
                    onUpdateQuantity={calculator.updateQuantity}
                    onRemove={calculator.removeItem}
                  />
                ))}
              </div>
            )}
          </div>

          {!calculator.isEmpty && (
            <>
              <Separator />

              {/* Totals */}
              <div className="space-y-3 rounded-lg bg-muted p-4">
                {calculator.descuentoTotal > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatPrice(calculator.totalSinDescuento)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento:</span>
                      <span>-{formatPrice(calculator.descuentoTotal)}</span>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(calculator.subtotal)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Por persona:</span>
                  <span>{formatPrice(calculator.totalPorPersona)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={calculator.shareWhatsApp}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Share2 className="h-5 w-5" />
                  Compartir por WhatsApp
                </Button>

                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="w-full gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Nueva cuenta
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { CalculatorItem as CalculatorItemType } from "@/src/hooks/useCalculator";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/src/lib/utils/pricing";

interface CalculatorItemProps {
  item: CalculatorItemType;
  onUpdateQuantity: (productoId: string, cantidad: number) => void;
  onRemove: (productoId: string) => void;
}

export function CalculatorItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CalculatorItemProps) {
  const subtotal = item.producto.precioActual * item.cantidad;

  return (
    <div className="flex items-center gap-2 rounded-lg border p-3">
      <div className="flex-1">
        <p className="font-medium leading-tight line-clamp-1">
          {item.producto.nombre}
        </p>
        <p className="mt-1 text-sm font-semibold text-primary">
          {formatPrice(subtotal)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.producto.id, item.cantidad - 1)}
          disabled={item.cantidad <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <div className="flex h-8 w-12 items-center justify-center rounded-md border bg-muted text-sm font-semibold">
          {item.cantidad}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.producto.id, item.cantidad + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={() => onRemove(item.producto.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

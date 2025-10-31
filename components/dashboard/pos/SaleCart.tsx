"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UseCartReturn } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface SaleCartProps {
  cart: UseCartReturn;
}

export function SaleCart({ cart }: SaleCartProps) {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    descuentoPorcentaje,
    setDescuentoPorcentaje,
    descuentoMonto,
    total,
    descuentoActivo,
  } = cart;

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito
          </CardTitle>
          {items.length > 0 && (
            <Badge variant="secondary">{items.length} items</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
            <ShoppingCart className="mb-2 h-12 w-12 opacity-20" />
            <p className="text-sm">El carrito está vacío</p>
            <p className="mt-1 text-xs">Agrega productos para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 rounded-lg border p-3"
                >
                  {/* Product Image */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.imagenUrl ? (
                      <Image
                        src={item.imagenUrl}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-2xl">🍺</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium leading-tight line-clamp-1">
                          {item.nombre}
                        </h4>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          S/{item.precioUnitario.toFixed(2)} c/u
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, item.cantidad - 1)
                            )
                          }
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            updateQuantity(
                              item.productId,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="h-7 w-14 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.productId, item.cantidad + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-semibold">
                        S/{(item.cantidad * item.precioUnitario).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Discount Input */}
            <div className="space-y-2">
              <Label htmlFor="descuento" className="flex items-center gap-2">
                Descuento (%)
                {descuentoActivo && (
                  <Badge variant="secondary" className="text-xs">
                    Automático
                  </Badge>
                )}
              </Label>
              <Input
                id="descuento"
                type="number"
                min="0"
                max="100"
                step="1"
                value={descuentoPorcentaje}
                onChange={(e) =>
                  setDescuentoPorcentaje(
                    Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                  )
                }
                placeholder="0"
                disabled={descuentoActivo}
                className={descuentoActivo ? "cursor-not-allowed opacity-70" : ""}
              />
              {descuentoActivo && (
                <p className="text-xs text-muted-foreground">
                  Descuento aplicado automáticamente según el horario configurado
                </p>
              )}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">S/{subtotal.toFixed(2)}</span>
              </div>
              {descuentoPorcentaje > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Descuento ({descuentoPorcentaje}%):
                  </span>
                  <span className="font-medium text-red-500">
                    -S/{descuentoMonto.toFixed(2)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">
                  S/{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Clear Cart Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vaciar Carrito
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}

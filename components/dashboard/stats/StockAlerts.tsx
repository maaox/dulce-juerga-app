"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StockAlertsProps {
  products: Array<{
    productoId: string;
    nombre: string;
    stockActual: number;
    stockInicial: number;
    porcentaje: number;
  }>;
}

export function StockAlerts({ products }: StockAlertsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Stock Crítico
          </h3>
          <Badge variant="destructive">{products.length}</Badge>
        </div>

        {products.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-center text-sm text-muted-foreground">
            No hay productos con stock crítico
          </div>
        ) : (
          <div className="space-y-2">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.productoId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{product.nombre}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Stock: {product.stockActual} / {product.stockInicial}
                    </span>
                    <Badge
                      variant={
                        product.porcentaje < 10
                          ? "destructive"
                          : product.porcentaje < 20
                            ? "default"
                            : "secondary"
                      }
                    >
                      {product.porcentaje.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <Link href="/dashboard/inventario">
                  <Button size="sm" variant="outline">
                    Reabastecer
                  </Button>
                </Link>
              </div>
            ))}

            {products.length > 5 && (
              <Link href="/dashboard/inventario">
                <Button variant="ghost" className="w-full">
                  Ver todos ({products.length})
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

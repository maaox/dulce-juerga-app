"use client";

import { PublicProduct } from "@/hooks/usePublicMenu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/pricing";
import { getCategoryLabel } from "@/lib/utils/categories";

interface ProductCardPublicProps {
  producto: PublicProduct;
  onAddToCalculator: (producto: PublicProduct) => void;
}

export function ProductCardPublic({
  producto,
  onAddToCalculator,
}: ProductCardPublicProps) {
  const hasDiscount = producto.descuentoPorcentaje > 0;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Layout: Horizontal on Mobile, Vertical on Desktop */}
      <div className="flex flex-row gap-3 p-3 sm:flex-col sm:p-0">
        {/* Product Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-auto sm:w-full sm:rounded-none sm:rounded-t-lg sm:aspect-square">
          {producto.imagenUrl ? (
            <Image
              src={producto.imagenUrl}
              alt={producto.nombre}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground sm:h-16 sm:w-16" />
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute right-1 top-1 sm:right-2 sm:top-2">
              <Badge className="bg-red-500 text-xs text-white shadow-lg sm:text-sm">
                -{producto.descuentoPorcentaje}%
              </Badge>
            </div>
          )}

          {/* Category Badge - Only on Desktop */}
          <div className="absolute left-1 top-1 hidden sm:block sm:left-2 sm:top-2">
            <Badge variant="secondary">{getCategoryLabel(producto.categoria)}</Badge>
          </div>

          {/* Stock Badge */}
          {producto.stockActual < 10 && producto.stockActual > 0 && (
            <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2">
              <Badge variant="outline" className="bg-orange-500/90 text-xs text-white sm:text-sm">
                ¡{producto.stockActual} unidades!
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between sm:p-4">
          <div className="space-y-1 sm:space-y-3">
            {/* Category Badge - Only on Mobile */}
            <div className="sm:hidden">
              <Badge variant="secondary" className="text-xs">
                {getCategoryLabel(producto.categoria)}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-semibold leading-tight sm:text-base line-clamp-1">
                {producto.nombre}
              </h3>
              {producto.descripcion && (
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm line-clamp-1 sm:line-clamp-2">
                  {producto.descripcion}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-2">
              {hasDiscount && (
                <span className="text-xs text-muted-foreground sm:text-sm line-through">
                  {formatPrice(producto.precioBase)}
                </span>
              )}
              <span className="text-lg font-bold text-primary sm:text-2xl">
                {formatPrice(producto.precioActual)}
              </span>
            </div>

            {/* Options - Hidden on Mobile */}
            {producto.opciones && producto.opciones.length > 0 && (
              <div className="hidden text-xs text-muted-foreground sm:block">
                <p>Opciones disponibles:</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {producto.opciones.map((opcion, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {opcion.nombre} +{formatPrice(opcion.precioExtra)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Calculator Button */}
            <Button
              onClick={() => onAddToCalculator(producto)}
              className="w-full gap-2 text-xs sm:text-sm"
              size="sm"
              disabled={producto.stockActual === 0}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              {producto.stockActual === 0
                ? "Agotado"
                : "Agregar"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

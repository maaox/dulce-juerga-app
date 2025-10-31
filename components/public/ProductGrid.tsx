"use client";

import { PublicProduct } from "@/src/hooks/usePublicMenu";
import { ProductCardPublic } from "./ProductCardPublic";

interface ProductGridProps {
  productos: PublicProduct[];
  loading: boolean;
  onAddToCalculator: (producto: PublicProduct) => void;
}

export function ProductGrid({
  productos,
  loading,
  onAddToCalculator,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg bg-muted sm:h-96"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {productos.map((producto) => (
        <ProductCardPublic
          key={producto.id}
          producto={producto}
          onAddToCalculator={onAddToCalculator}
        />
      ))}
    </div>
  );
}

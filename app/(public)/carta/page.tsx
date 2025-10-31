"use client";

import { useState } from "react";
import { usePublicMenu } from "@/hooks/usePublicMenu";
import { useCalculator } from "@/hooks/useCalculator";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { DiscountBanner } from "@/components/public/DiscountBanner";
import { SearchBar } from "@/components/public/SearchBar";
import { CategoryFilter } from "@/components/public/CategoryFilter";
import { ProductGrid } from "@/components/public/ProductGrid";
import { SplitBillCalculator } from "@/components/public/SplitBillCalculator";

export default function CartaPage() {
  const menu = usePublicMenu();
  const calculator = useCalculator();
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Discount Banner Sticky */}
      {menu.descuento && <DiscountBanner descuento={menu.descuento} />}

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            🎃 Carta Digital
          </h1>
          <p className="text-lg text-muted-foreground">
            Descubre nuestro menú de bebidas
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={menu.busqueda}
            onChange={menu.setBusqueda}
            placeholder="Buscar bebidas..."
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            selected={menu.categoria}
            onSelect={menu.setCategoria}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid
          productos={menu.productos}
          loading={menu.loading}
          onAddToCalculator={(producto) => {
            calculator.addItem(producto);
            // Auto-open calculator on first add
            if (calculator.isEmpty) {
              setShowCalculator(true);
            }
          }}
        />

        {/* Empty State */}
        {!menu.loading && menu.productos.length === 0 && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">No se encontraron productos</p>
              <p className="mt-2 text-sm">
                Intenta con otra búsqueda o categoría
              </p>
            </div>
          </div>
        )}

        {/* Floating Calculator Button */}
        {!calculator.isEmpty && (
          <Button
            size="lg"
            onClick={() => setShowCalculator(true)}
            className="md:flex md:flex-col fixed bottom-6 right-6 h-16 w-16 rounded-full p-0 md:p-2 shadow-lg md:h-auto md:w-auto md:rounded-md md:px-6"
          >
            <Calculator className="h-6 w-6 md:mr-2" />
            <span className="hidden md:inline">
              Dividir ({calculator.items.length})
            </span>
            {!showCalculator && calculator.items.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {calculator.items.length}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Split Bill Calculator Modal */}
      <SplitBillCalculator
        open={showCalculator}
        onOpenChange={setShowCalculator}
        calculator={calculator}
      />

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/50 py-8">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            🎃 <strong>Dulce Juerga</strong> - Halloween Party 2024
          </p>
          <p>31 de Octubre | 21:30 PM</p>
          <p className="mt-2">WhatsApp: 927 040 637</p>
        </div>
      </footer>
    </div>
  );
}

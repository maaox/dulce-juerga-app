"use client";

import { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { UseCartReturn } from "@/hooks/useCart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSelectorProps {
  cart: UseCartReturn;
}

export function ProductSelector({ cart }: ProductSelectorProps) {
  const { products, loading, fetchProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState<string>("all");

  useEffect(() => {
    fetchProducts({
      disponible: true,
      categoria: categoria === "all" ? undefined : categoria,
      search: search || undefined,
    });
  }, [categoria, search, fetchProducts]);

  const handleAddToCart = (product: Product) => {
    cart.addItem({
      productId: product.id,
      nombre: product.nombre,
      precioUnitario: Number(product.precioBase),
      cantidad: 1,
      imagenUrl: product.imagenUrl,
    });
  };

  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.productId === productId);
  };

  const getStockStatus = (product: Product) => {
    const stockPorcentaje = (product.stockActual / product.stockInicial) * 100;
    if (product.stockActual === 0) return { color: "bg-red-500", text: "Agotado" };
    if (stockPorcentaje < 20) return { color: "bg-orange-500", text: "Stock Bajo" };
    return { color: "bg-green-500", text: "Disponible" };
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Productos Disponibles</CardTitle>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="CERVEZA">Cerveza</SelectItem>
              <SelectItem value="TRAGO">Trago</SelectItem>
              <SelectItem value="SHOT">Shot</SelectItem>
              <SelectItem value="SIN_ALCOHOL">Sin Alcohol</SelectItem>
              <SelectItem value="OTRO">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            No se encontraron productos disponibles
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const stockStatus = getStockStatus(product);
              const inCart = isInCart(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.imagenUrl ? (
                      <Image
                        src={product.imagenUrl}
                        alt={product.nombre}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-6xl">🍺</span>
                      </div>
                    )}
                    {product.stockActual === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <Badge variant="destructive" className="text-sm">
                          AGOTADO
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight line-clamp-1">
                        {product.nombre}
                      </h3>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs"
                      >
                        {product.categoria}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold">
                          S/{product.precioBase.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div
                            className={`h-2 w-2 rounded-full ${stockStatus.color}`}
                          />
                          <span>Stock: {product.stockActual}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockActual === 0 || inCart}
                        className="gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        {inCart ? "En carrito" : "Agregar"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </>
  );
}

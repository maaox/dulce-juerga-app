"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { ProductFormDialog } from "@/components/dashboard/ProductFormDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventarioPage() {
  const { products, loading, pagination, fetchProducts } = useProducts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState({
    categoria: "todas",
    buscar: "",
    disponible: undefined as boolean | undefined,
  });

  useEffect(() => {
    fetchProducts({ page: 1, limit: 20, ...filters });
  }, [fetchProducts, filters]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, buscar: value }));
  };

  const handleCategoriaChange = (value: string) => {
    setFilters((prev) => ({ ...prev, categoria: value }));
  };

  return (
    <div className="space-y-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona los productos del evento
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Productos
          </div>
          <div className="text-2xl font-bold">{pagination.total}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Stock Bajo
          </div>
          <div className="text-2xl font-bold text-orange-500">
            {products.filter((p) => {
              const porcentaje = (p.stockActual / p.stockInicial) * 100;
              return porcentaje < 20 && porcentaje > 0;
            }).length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Agotados
          </div>
          <div className="text-2xl font-bold text-red-500">
            {products.filter((p) => p.stockActual === 0).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={filters.buscar}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.categoria}
          onValueChange={handleCategoriaChange}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="CERVEZA">Cervezas</SelectItem>
            <SelectItem value="TRAGO">Tragos</SelectItem>
            <SelectItem value="SHOT">Shots</SelectItem>
            <SelectItem value="SIN_ALCOHOL">Sin Alcohol</SelectItem>
            <SelectItem value="OTRO">Otros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No hay productos</h3>
            <p className="text-sm text-muted-foreground">
              Comienza creando tu primer producto
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Producto
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={() => fetchProducts({ page: 1, limit: 20, ...filters })}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() =>
              fetchProducts({
                page: pagination.page - 1,
                limit: 20,
                ...filters,
              })
            }
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasMore}
            onClick={() =>
              fetchProducts({
                page: pagination.page + 1,
                limit: 20,
                ...filters,
              })
            }
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Create Product Dialog */}
      <ProductFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          setIsCreateOpen(false);
          fetchProducts({ page: 1, limit: 20, ...filters });
        }}
      />
    </div>
  );
}

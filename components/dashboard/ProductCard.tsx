"use client";

import { Product } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ProductFormDialog } from "./ProductFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProducts } from "@/src/hooks/useProducts";
import { getCategoryLabel } from "@/src/lib/utils/categories";

interface ProductCardProps {
  product: Product;
  onUpdate?: () => void;
}

export function ProductCard({ product, onUpdate }: ProductCardProps) {
  const { deleteProduct } = useProducts();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const stockPorcentaje = (product.stockActual / product.stockInicial) * 100;
  const isStockBajo = stockPorcentaje < 20 && stockPorcentaje > 0;
  const isAgotado = product.stockActual === 0;

  const margen = ((product.precioBase - product.costoUnitario) / product.costoUnitario) * 100;

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "CERVEZA":
        return "bg-amber-500/10 text-amber-500";
      case "TRAGO":
        return "bg-purple-500/10 text-purple-500";
      case "SHOT":
        return "bg-red-500/10 text-red-500";
      case "SIN_ALCOHOL":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handleDelete = async () => {
    await deleteProduct(product.id);
    setIsDeleteOpen(false);
    onUpdate?.(); // Refrescar lista
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            {product.imagenUrl ? (
              <Image
                src={product.imagenUrl}
                alt={product.nombre}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl">🍺</span>
              </div>
            )}
            {isAgotado && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge variant="destructive" className="text-lg">
                  AGOTADO
                </Badge>
              </div>
            )}
            {isStockBajo && !isAgotado && (
              <Badge
                variant="destructive"
                className="absolute right-2 top-2"
              >
                <AlertTriangle className="mr-1 h-3 w-3" />
                Stock Bajo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{product.nombre}</h3>
              <Badge className={getCategoriaColor(product.categoria)}>
                {getCategoryLabel(product.categoria)}
              </Badge>
            </div>
            {product.descripcion && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.descripcion}
              </p>
            )}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-2xl font-bold">S/{product.precioBase.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  Costo: S/{product.costoUnitario.toFixed(2)} • Margen: {margen.toFixed(0)}%
                </p>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stock:</span>
                <span className={`font-semibold ${isAgotado ? 'text-red-500' : isStockBajo ? 'text-orange-500' : ''}`}>
                  {product.stockActual} / {product.stockInicial} {product.unidadMedida}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${
                    isAgotado
                      ? 'bg-red-500'
                      : isStockBajo
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(stockPorcentaje, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <ProductFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        product={product}
        onSuccess={() => {
          setIsEditOpen(false);
          onUpdate?.(); // Refrescar lista
        }}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto &quot;{product.nombre}&quot;. El producto no se eliminará permanentemente, solo se marcará como inactivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

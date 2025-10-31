"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";
import Image from "next/image";

interface TopProductsTableProps {
  products: Array<{
    productoId: string;
    nombre: string;
    cantidad: number;
    total: number;
    imagenUrl: string | null;
  }>;
  totalVendidos: number;
}

export function TopProductsTable({
  products,
  totalVendidos,
}: TopProductsTableProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 5 Productos
          </h3>
          <p className="text-sm text-muted-foreground">
            {totalVendidos} vendidos
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => {
                const porcentaje =
                  totalVendidos > 0
                    ? (product.cantidad / totalVendidos) * 100
                    : 0;

                return (
                  <TableRow key={product.productoId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.imagenUrl && (
                          <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={product.imagenUrl}
                              alt={product.nombre}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="font-medium">{product.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {product.cantidad}
                    </TableCell>
                    <TableCell className="text-right">
                      S/{product.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-muted-foreground">
                        {porcentaje.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSales } from "@/src/hooks/useSales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Search,
  Eye,
  XCircle,
  TrendingUp,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Sale, SaleItem } from "@prisma/client";

type SaleWithItems = Sale & {
  items: SaleItem[];
  user: { name: string };
};

export function SalesHistory() {
  const { data: session } = useSession();
  const { sales, loading, fetchSales, getSaleById, cancelSale } = useSales();
  const [filters, setFilters] = useState({
    fechaDesde: format(new Date(), "yyyy-MM-dd"),
    fechaHasta: format(new Date(), "yyyy-MM-dd"),
    metodoPago: "all",
    estado: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSale, setSelectedSale] = useState<SaleWithItems | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalMonto: 0,
    ventasCompletadas: 0,
  });

  useEffect(() => {
    loadSales();
  }, [filters]);

  const loadSales = async () => {
    const data = await fetchSales({
      fechaDesde: filters.fechaDesde,
      fechaHasta: filters.fechaHasta,
      metodoPago: filters.metodoPago === "all" ? undefined : filters.metodoPago,
      estado: filters.estado === "all" ? undefined : filters.estado,
    });

    if (data?.stats) {
      setStats({
        totalVentas: data.stats.count,
        totalMonto: data.stats.totalMonto,
        ventasCompletadas: data.stats.completadas || 0,
      });
    }
  };

  const handleViewSale = async (saleId: string) => {
    const sale = await getSaleById(saleId);
    if (sale) {
      setSelectedSale(sale);
      setShowDetailModal(true);
    }
  };

  const handleCancelSale = async (saleId: string) => {
    if (!confirm("¿Estás seguro de anular esta venta?")) return;

    const razon = prompt("Ingresa la razón de anulación:");
    if (!razon) return;

    const result = await cancelSale(saleId, razon);
    if (result) {
      loadSales();
      setShowDetailModal(false);
    }
  };

  const getMetodoPagoColor = (metodo: string) => {
    switch (metodo) {
      case "EFECTIVO":
        return "bg-green-500/10 text-green-500";
      case "YAPE":
        return "bg-purple-500/10 text-purple-500";
      case "PLIN":
        return "bg-blue-500/10 text-blue-500";
      case "TARJETA":
        return "bg-orange-500/10 text-orange-500";
      case "PULSERA":
        return "bg-pink-500/10 text-pink-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "COMPLETADA":
        return "bg-green-500/10 text-green-500";
      case "ANULADA":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const filteredSales = sales.filter((sale) =>
    sale.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVentas}</div>
              <p className="text-xs text-muted-foreground">
                {stats.ventasCompletadas} completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                S/{stats.totalMonto.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio: S/
                {stats.totalVentas > 0
                  ? (stats.totalMonto / stats.totalVentas).toFixed(2)
                  : "0.00"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalVentas > 0
                  ? ((stats.ventasCompletadas / stats.totalVentas) * 100).toFixed(1)
                  : "0"}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Ventas completadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Desde</label>
                <Input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) =>
                    setFilters({ ...filters, fechaDesde: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Hasta</label>
                <Input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) =>
                    setFilters({ ...filters, fechaHasta: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Método de Pago</label>
                <Select
                  value={filters.metodoPago}
                  onValueChange={(value) =>
                    setFilters({ ...filters, metodoPago: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                    <SelectItem value="YAPE">Yape</SelectItem>
                    <SelectItem value="PLIN">Plin</SelectItem>
                    <SelectItem value="TARJETA">Tarjeta</SelectItem>
                    <SelectItem value="PULSERA">Pulsera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={filters.estado}
                  onValueChange={(value) =>
                    setFilters({ ...filters, estado: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="COMPLETADA">Completada</SelectItem>
                    <SelectItem value="ANULADA">Anulada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código de venta..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sales Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                Cargando...
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                No se encontraron ventas
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Método Pago</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale: any) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">
                        {sale.codigo}
                      </TableCell>
                      <TableCell>
                        {format(new Date(sale.createdAt), "dd/MM/yyyy HH:mm", {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>{sale.user?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getMetodoPagoColor(sale.metodoPago)}>
                          {sale.metodoPago}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        S/{sale.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getEstadoColor(sale.estado)}>
                          {sale.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSale(sale.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sale Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Venta</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              {/* Sale Info */}
              <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-semibold">{selectedSale.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-semibold">
                    {format(
                      new Date(selectedSale.createdAt),
                      "dd/MM/yyyy HH:mm",
                      { locale: es }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendedor</p>
                  <p className="font-semibold">
                    {selectedSale.user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barra</p>
                  <p className="font-semibold">{selectedSale.barra}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pago</p>
                  <Badge className={getMetodoPagoColor(selectedSale.metodoPago)}>
                    {selectedSale.metodoPago}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge className={getEstadoColor(selectedSale.estado)}>
                    {selectedSale.estado}
                  </Badge>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="mb-2 font-semibold">Productos</h3>
                <div className="space-y-2">
                  {selectedSale.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{item.nombreProducto}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.cantidad} x S/{item.precioUnitario.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        S/{item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>S/{selectedSale.subtotal.toFixed(2)}</span>
                </div>
                {selectedSale.descuentoPorcentaje > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Descuento ({selectedSale.descuentoPorcentaje}%):</span>
                    <span>
                      -S/
                      {(
                        selectedSale.subtotal -
                        selectedSale.total
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                  <span>Total:</span>
                  <span>S/{selectedSale.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Cancel Button (Admin only) */}
              {session?.user?.role === "ADMIN" &&
                selectedSale.estado === "COMPLETADA" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCancelSale(selectedSale.id)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Anular Venta
                  </Button>
                )}

              {selectedSale.estado === "ANULADA" && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm">
                  <p className="font-semibold text-red-500">Venta Anulada</p>
                  {selectedSale.razonAnulacion && (
                    <p className="mt-1 text-muted-foreground">
                      Razón: {selectedSale.razonAnulacion}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

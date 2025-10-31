"use client";

import { useDashboardStats } from "@/src/hooks/useDashboardStats";
import { KPICard } from "@/components/dashboard/stats/KPICard";
import { SalesChart } from "@/components/dashboard/stats/SalesChart";
import { TopProductsTable } from "@/components/dashboard/stats/TopProductsTable";
import { PaymentMethodsChart } from "@/components/dashboard/stats/PaymentMethodsChart";
import { StockAlerts } from "@/components/dashboard/stats/StockAlerts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Music,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { stats, ventasPorHora, loading, refetch } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6 px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Estadísticas en tiempo real del evento
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Ventas Totales"
          value={`S/${stats.ventas.total.toFixed(2)}`}
          icon={DollarSign}
          subtitle={`${stats.ventas.cantidad} ventas`}
          colorClass="text-green-600"
        />
        <KPICard
          title="Ticket Promedio"
          value={`S/${stats.ventas.promedio.toFixed(2)}`}
          icon={ShoppingCart}
          subtitle="Por venta"
          colorClass="text-blue-600"
        />
        <KPICard
          title="Utilidad Neta"
          value={`S/${stats.utilidad.utilidadNeta.toFixed(2)}`}
          icon={TrendingUp}
          subtitle={`${stats.utilidad.margenPorcentaje.toFixed(1)}% margen`}
          colorClass="text-purple-600"
        />
        <KPICard
          title="DJ Requests"
          value={`S/${stats.canciones.totalRecaudado.toFixed(2)}`}
          icon={Music}
          subtitle={`${stats.canciones.totalSolicitudes} solicitudes`}
          colorClass="text-pink-600"
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart data={ventasPorHora} />
        <TopProductsTable
          products={stats.productos.masVendidos}
          totalVendidos={stats.productos.totalVendidos}
        />
      </div>

      {/* Gráficos secundarios */}
      <div className="grid gap-4 md:grid-cols-2">
        <PaymentMethodsChart data={stats.ventas.porMetodoPago} />
        <StockAlerts products={stats.productos.stockCritico} />
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';

export interface DashboardStats {
  ventas: {
    total: number;
    cantidad: number;
    promedio: number;
    porMetodoPago: {
      efectivo: number;
      yape: number;
      plin: number;
      tarjeta: number;
      pulsera: number;
    };
    porBarra: Record<string, number>;
  };
  productos: {
    totalVendidos: number;
    masVendidos: Array<{
      productoId: string;
      nombre: string;
      cantidad: number;
      total: number;
      imagenUrl: string | null;
    }>;
    stockCritico: Array<{
      productoId: string;
      nombre: string;
      stockActual: number;
      stockInicial: number;
      porcentaje: number;
    }>;
  };
  canciones: {
    totalSolicitudes: number;
    porTipo: {
      libres: number;
      prioritarias: number;
      vips: number;
    };
    totalRecaudado: number;
    promedioEspera: number;
  };
  utilidad: {
    ingresos: number;
    costos: number;
    utilidadNeta: number;
    margenPorcentaje: number;
  };
}

export interface VentaPorHora {
  hora: string;
  cantidad: number;
  monto: number;
}

export function useDashboardStats(
  fechaInicio?: Date,
  fechaFin?: Date,
  autoRefresh = true
) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ventasPorHora, setVentasPorHora] = useState<VentaPorHora[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();

      if (fechaInicio) {
        params.set('fechaInicio', fechaInicio.toISOString());
      }
      if (fechaFin) {
        params.set('fechaFin', fechaFin.toISOString());
      }

      const [statsRes, ventasRes] = await Promise.all([
        fetch(`/api/dashboard/stats?${params}`),
        fetch(`/api/dashboard/ventas-por-hora?${params}`),
      ]);

      if (!statsRes.ok || !ventasRes.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const statsData = await statsRes.json();
      const ventasData = await ventasRes.json();

      setStats(statsData);
      setVentasPorHora(ventasData.ventasPorHora);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      // Actualizar cada 10 segundos
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [fetchStats, autoRefresh]);

  return {
    stats,
    ventasPorHora,
    loading,
    error,
    refetch: fetchStats,
  };
}

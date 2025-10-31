import { useState, useCallback } from 'react';
import { Sale } from '@prisma/client';
import { toast } from 'sonner';

interface CreateSaleData {
  items: {
    productId: string;
    cantidad: number;
    precioUnitario: number;
  }[];
  descuentoPorcentaje: number;
  metodoPago: string;
  pagoDetalles: any;
  barra: string;
  notas?: string;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSale = useCallback(async (data: CreateSaleData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear venta');
      }

      const result = await response.json();
      toast.success('Venta completada', {
        description: `Código: ${result.codigo} - Total: S/${result.total.toFixed(2)}`,
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear venta';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSales = useCallback(async (params: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.set(key, params[key].toString());
        }
      });

      const response = await fetch(`/api/sales?${queryParams}`);

      if (!response.ok) {
        throw new Error('Error al obtener ventas');
      }

      const data = await response.json();
      setSales(data.ventas);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener ventas';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSaleById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sales/${id}`);

      if (!response.ok) {
        throw new Error('Error al obtener venta');
      }

      const data = await response.json();
      return data.venta;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener venta';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSale = useCallback(async (id: string, razonAnulacion: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sales/${id}/anular`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ razonAnulacion }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al anular venta');
      }

      const data = await response.json();
      toast.success('Venta anulada correctamente');
      return data.venta;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al anular venta';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sales,
    loading,
    error,
    createSale,
    fetchSales,
    getSaleById,
    cancelSale,
  };
}

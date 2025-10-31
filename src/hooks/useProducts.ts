import { useState, useCallback } from 'react';
import { Product } from '@prisma/client';
import { toast } from 'sonner';

interface UseProductsParams {
  page?: number;
  limit?: number;
  categoria?: string;
  buscar?: string;
  search?: string;
  disponible?: boolean;
}

interface ProductsResponse {
  productos: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false,
  });

  const fetchProducts = useCallback(async (params: UseProductsParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.categoria) queryParams.set('categoria', params.categoria);
      if (params.buscar) queryParams.set('buscar', params.buscar);
      if (params.search) queryParams.set('buscar', params.search);
      if (params.disponible !== undefined) queryParams.set('disponible', params.disponible.toString());

      const response = await fetch(`/api/products?${queryParams}`);

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data: ProductsResponse = await response.json();

      setProducts(data.productos);
      setPagination({
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
        hasMore: data.hasMore,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener productos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (formData: FormData): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear producto');
      }

      const data = await response.json();
      toast.success('Producto creado correctamente');

      // Recargar productos
      await fetchProducts();

      return data.producto;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, formData: FormData): Promise<Product | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar producto');
      }

      const data = await response.json();
      toast.success('Producto actualizado correctamente');

      // Actualizar en la lista
      setProducts(prev => prev.map(p => p.id === id ? data.producto : p));

      return data.producto;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar producto');
      }

      toast.success('Producto eliminado correctamente');

      // Remover de la lista
      setProducts(prev => prev.filter(p => p.id !== id));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStock = useCallback(async (
    id: string,
    cantidad: number,
    motivo: 'venta' | 'ajuste' | 'devolucion'
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad, motivo }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar stock');
      }

      const data = await response.json();
      toast.success('Stock actualizado correctamente');

      // Actualizar en la lista
      setProducts(prev => prev.map(p => p.id === id ? data.producto : p));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar stock';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  };
}

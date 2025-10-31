import { useState, useEffect, useMemo, useCallback } from 'react';

export interface PublicProduct {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  imagenUrl: string | null;
  precioBase: number;
  precioActual: number;
  descuentoPorcentaje: number;
  disponible: boolean;
  stockActual: number;
  opciones: Array<{ nombre: string; precioExtra: number }> | null;
}

export interface Descuento {
  porcentaje: number;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  tiempoRestanteMinutos: number;
  activo: boolean;
}

export function usePublicMenu() {
  const [productos, setProductos] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [descuento, setDescuento] = useState<Descuento | null>(null);
  const [categoria, setCategoria] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState('');

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/menu/publico');
      if (!response.ok) throw new Error('Error al cargar menú');

      const data = await response.json();
      setProductos(data.productos);
      setDescuento(data.descuentoActual);
    } catch (error) {
      console.error('Error al cargar menú:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDescuento = useCallback(async () => {
    try {
      const response = await fetch('/api/menu/descuento-actual');
      if (!response.ok) throw new Error('Error al cargar descuento');

      const data = await response.json();
      setDescuento({
        porcentaje: data.porcentaje,
        descripcion: data.descripcion,
        horaInicio: '',
        horaFin: '',
        tiempoRestanteMinutos: data.tiempoRestante,
        activo: data.activo,
      });
    } catch (error) {
      console.error('Error al cargar descuento:', error);
    }
  }, []);

  useEffect(() => {
    fetchMenu();

    // Actualizar descuento cada minuto
    const interval = setInterval(fetchDescuento, 60000);
    return () => clearInterval(interval);
  }, [fetchMenu, fetchDescuento]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCategoria =
        categoria === 'todas' || p.categoria === categoria;
      const matchBusqueda = p.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return matchCategoria && matchBusqueda && p.disponible;
    });
  }, [productos, categoria, busqueda]);

  return {
    productos: productosFiltrados,
    todosLosProductos: productos,
    loading,
    descuento,
    categoria,
    setCategoria,
    busqueda,
    setBusqueda,
    refresh: fetchMenu,
  };
}

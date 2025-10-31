import { useState, useCallback, useMemo, useEffect } from 'react';

export interface CartItem {
  productId: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  imagenUrl: string | null;
}

export interface UseCartReturn {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  descuentoPorcentaje: number;
  setDescuentoPorcentaje: (porcentaje: number) => void;
  descuentoMonto: number;
  total: number;
  descuentoActivo: boolean;
}

interface DescuentoFranja {
  horaInicio: string;
  horaFin: string;
  porcentaje: number;
}

function getCurrentDiscount(franjas: DescuentoFranja[]): number {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  for (const franja of franjas) {
    if (currentTime >= franja.horaInicio && currentTime <= franja.horaFin) {
      return franja.porcentaje;
    }
  }

  return 0;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [descuentoActivo, setDescuentoActivo] = useState(false);

  // Fetch and apply automatic discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch('/api/public/config/descuentos');
        if (response.ok) {
          const data = await response.json();
          if (data.enabled && data.descuentos && data.descuentos.length > 0) {
            const currentDiscount = getCurrentDiscount(data.descuentos);
            if (currentDiscount > 0) {
              setDescuentoPorcentaje(currentDiscount);
              setDescuentoActivo(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };

    fetchDiscounts();

    // Check for discount updates every minute
    const interval = setInterval(fetchDiscounts, 60000);

    return () => clearInterval(interval);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        // Actualizar cantidad
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        );
      }
      // Agregar nuevo item
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, cantidad } : i
      )
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    // Don't reset discount if it's automatic
    if (!descuentoActivo) {
      setDescuentoPorcentaje(0);
    }
  }, [descuentoActivo]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.precioUnitario * item.cantidad;
    }, 0);
  }, [items]);

  const descuentoMonto = useMemo(() => {
    return subtotal * (descuentoPorcentaje / 100);
  }, [subtotal, descuentoPorcentaje]);

  const total = useMemo(() => {
    return subtotal - descuentoMonto;
  }, [subtotal, descuentoMonto]);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    descuentoPorcentaje,
    setDescuentoPorcentaje,
    descuentoMonto,
    total,
    descuentoActivo,
  };
}

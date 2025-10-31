import { useState, useMemo, useCallback } from 'react';
import { PublicProduct } from './usePublicMenu';

export interface CalculatorItem {
  producto: PublicProduct;
  cantidad: number;
}

export function useCalculator() {
  const [items, setItems] = useState<CalculatorItem[]>([]);
  const [numPersonas, setNumPersonas] = useState(1);

  const addItem = useCallback((producto: PublicProduct, cantidad: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.producto.id === producto.id);
      if (existing) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { producto, cantidad }];
    });
  }, []);

  const updateQuantity = useCallback((productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      )
    );
  }, []);

  const removeItem = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const clearCalculator = useCallback(() => {
    setItems([]);
    setNumPersonas(1);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.producto.precioActual * item.cantidad;
    }, 0);
  }, [items]);

  const descuentoTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const precioBase = item.producto.precioBase * item.cantidad;
      const precioActual = item.producto.precioActual * item.cantidad;
      return sum + (precioBase - precioActual);
    }, 0);
  }, [items]);

  const totalSinDescuento = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.producto.precioBase * item.cantidad;
    }, 0);
  }, [items]);

  const totalPorPersona = useMemo(() => {
    return numPersonas > 0 ? subtotal / numPersonas : 0;
  }, [subtotal, numPersonas]);

  const generateWhatsAppMessage = useCallback(() => {
    const lineas = items.map(
      (i) =>
        `• ${i.cantidad}x ${i.producto.nombre} - S/${(
          i.producto.precioActual * i.cantidad
        ).toFixed(2)}`
    );

    let mensaje = `🎃 *Dulce Juerga - División de cuenta*\n\n`;
    mensaje += lineas.join('\n');
    mensaje += `\n\n─────────────────\n`;

    if (descuentoTotal > 0) {
      mensaje += `Subtotal: S/${totalSinDescuento.toFixed(2)}\n`;
      mensaje += `Descuento: -S/${descuentoTotal.toFixed(2)}\n`;
    }

    mensaje += `*Total:* S/${subtotal.toFixed(2)}\n`;
    mensaje += `*Personas:* ${numPersonas}\n`;
    mensaje += `*Por persona:* S/${totalPorPersona.toFixed(2)}`;

    return mensaje;
  }, [items, subtotal, totalPorPersona, numPersonas, descuentoTotal, totalSinDescuento]);

  const shareWhatsApp = useCallback(() => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, [generateWhatsAppMessage]);

  return {
    items,
    numPersonas,
    setNumPersonas,
    addItem,
    updateQuantity,
    removeItem,
    clearCalculator,
    subtotal,
    descuentoTotal,
    totalSinDescuento,
    totalPorPersona,
    shareWhatsApp,
    isEmpty: items.length === 0,
  };
}

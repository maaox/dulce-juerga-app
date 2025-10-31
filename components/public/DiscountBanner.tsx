"use client";

import { useEffect, useState } from "react";
import { Descuento } from "@/hooks/usePublicMenu";
import { formatTimeRemaining } from "@/lib/utils/pricing";
import { Clock, Flame } from "lucide-react";

interface DiscountBannerProps {
  descuento: Descuento;
}

export function DiscountBanner({ descuento }: DiscountBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    descuento.tiempoRestanteMinutos
  );

  useEffect(() => {
    setTimeRemaining(descuento.tiempoRestanteMinutos);
  }, [descuento]);

  useEffect(() => {
    if (!descuento.activo) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [descuento.activo]);

  if (!descuento.activo) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-red-600 px-4 py-3 text-center text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <Flame className="h-5 w-5 animate-pulse" />
        <span className="font-bold">{descuento.descripcion}</span>
        <span className="hidden md:inline">•</span>
        <span className="text-sm font-semibold">
          {descuento.porcentaje}% OFF en todo
        </span>
        {timeRemaining > 0 && (
          <>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Termina en {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

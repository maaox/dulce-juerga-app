import { useState, useEffect } from 'react';
import { DescuentoFranja } from '@/lib/utils/config';

export interface Config {
  id: string;
  descuentosEnabled: boolean;
  descuentos: DescuentoFranja[];
  precioLibre: number;
  precioPrioritaria: number;
  precioVip: number;
  cuentasPago: any;
  eventoNombre: string;
  eventoFecha: Date;
  eventoHoraInicio: string;
  eventoHoraFin: string;
  eventoAforoMaximo: number;
  eventoEstado: string;
  emailNotificaciones: string | null;
  whatsappNotificaciones: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/config');

      if (!res.ok) {
        throw new Error('Error al obtener configuración');
      }

      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Error fetching config:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<Config>) => {
    try {
      setError(null);
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar configuración');
      }

      const data = await res.json();
      setConfig(data.config);
      return data;
    } catch (err) {
      console.error('Error updating config:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateDescuentos = async (enabled: boolean, descuentos: DescuentoFranja[]) => {
    try {
      setError(null);
      const res = await fetch('/api/config/descuentos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, descuentos })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar descuentos');
      }

      const data = await res.json();
      setConfig(data.config);
      return data;
    } catch (err) {
      console.error('Error updating descuentos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateCuentasPago = async (formData: FormData) => {
    try {
      setError(null);
      const res = await fetch('/api/config/cuentas-pago', {
        method: 'PATCH',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar cuentas de pago');
      }

      const data = await res.json();
      setConfig(data.config);
      return data;
    } catch (err) {
      console.error('Error updating cuentas pago:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    updateConfig,
    updateDescuentos,
    updateCuentasPago,
    refetch: fetchConfig
  };
}

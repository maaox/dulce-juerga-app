import { useState, useCallback, useEffect } from 'react';
import { Song } from '@prisma/client';

interface PublicQueueData {
  ahoraSonando: Song | null;
  libres: Song[];
  prioritarias: Song[];
  vips: Song[];
  siguientes: Song[];
}

export function usePublicQueue(autoRefresh: boolean = true, interval: number = 10000) {
  const [data, setData] = useState<PublicQueueData>({
    ahoraSonando: null,
    libres: [],
    prioritarias: [],
    vips: [],
    siguientes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/songs/publico');

      if (!response.ok) {
        throw new Error('Error al obtener la cola');
      }

      const queueData: PublicQueueData = await response.json();
      setData(queueData);
    } catch (err: any) {
      setError(err.message || 'Error al obtener la cola');
      console.error('Error fetching public queue:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh
  useEffect(() => {
    fetchQueue();

    if (autoRefresh) {
      const intervalId = setInterval(fetchQueue, interval);
      return () => clearInterval(intervalId);
    }
  }, [fetchQueue, autoRefresh, interval]);

  return {
    ...data,
    loading,
    error,
    refresh: fetchQueue,
  };
}

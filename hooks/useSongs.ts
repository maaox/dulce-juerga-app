import { useState, useCallback } from "react";
import { Song } from "@prisma/client";
import { toast } from "sonner";

interface UseSongsParams {
  tipo?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

interface SongsResponse {
  canciones: Song[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  porTipo: {
    libres: number;
    prioritarias: number;
    vips: number;
  };
}

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    libres: 0,
    prioritarias: 0,
    vips: 0,
  });

  const fetchSongs = useCallback(async (params: UseSongsParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params.tipo) queryParams.set("tipo", params.tipo);
      if (params.estado) queryParams.set("estado", params.estado);
      if (params.page) queryParams.set("page", params.page.toString());
      if (params.limit) queryParams.set("limit", params.limit.toString());

      const response = await fetch(`/api/songs?${queryParams}`);

      if (!response.ok) {
        throw new Error("Error al obtener canciones");
      }

      const data: SongsResponse = await response.json();

      setSongs(data.canciones);
      setStats(data.porTipo);
    } catch (err: any) {
      const errorMessage = err.message || "Error al obtener canciones";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSong = useCallback(
    async (data: {
      titulo: string;
      artista: string;
      solicitanteNombre?: string;
    }): Promise<Song | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/songs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al solicitar canción");
        }

        const result = await response.json();
        toast.success(
          `Canción agregada a la cola. Posición: ${result.posicionEnCola}`
        );

        return result.cancion;
      } catch (err: any) {
        const errorMessage = err.message || "Error al solicitar canción";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createPrioritaria = useCallback(
    async (formData: FormData): Promise<Song | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/songs/prioritaria", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            error.error || "Error al solicitar canción prioritaria"
          );
        }

        const result = await response.json();
        toast.success(result.mensaje);

        return result.cancion;
      } catch (err: any) {
        const errorMessage =
          err.message || "Error al solicitar canción prioritaria";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createVip = useCallback(
    async (formData: FormData): Promise<Song | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/songs/vip", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al solicitar canción VIP");
        }

        const result = await response.json();
        toast.success(result.mensaje);

        return result.cancion;
      } catch (err: any) {
        const errorMessage = err.message || "Error al solicitar canción VIP";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (id: string, estado: string, notasDj?: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/songs/${id}/estado`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado, notasDj }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al actualizar estado");
        }

        const result = await response.json();
        toast.success("Estado actualizado correctamente");

        // Actualizar en la lista
        setSongs((prev) => prev.map((s) => (s.id === id ? result.cancion : s)));

        return true;
      } catch (err: any) {
        const errorMessage = err.message || "Error al actualizar estado";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const approveSong = useCallback(
    async (id: string, aprobado: boolean): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/songs/${id}/aprobar`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ aprobado }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al procesar solicitud");
        }

        const result = await response.json();
        toast.success(result.mensaje);

        // Remover de la lista
        setSongs((prev) => prev.filter((s) => s.id !== id));

        return true;
      } catch (err: any) {
        const errorMessage = err.message || "Error al procesar solicitud";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteSong = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/songs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al eliminar canción");
      }

      toast.success("Canción eliminada correctamente");

      // Remover de la lista
      setSongs((prev) => prev.filter((s) => s.id !== id));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Error al eliminar canción";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const voteSong = useCallback(
    async (id: string, deviceId: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/songs/${id}/votar`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deviceId }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al votar");
        }

        const result = await response.json();

        if (result.yaVoto && result.votos) {
          toast.success(result.mensaje);

          // Actualizar votos en la lista
          setSongs((prev) =>
            prev.map((s) => (s.id === id ? { ...s, votos: result.votos } : s))
          );
        }

        return true;
      } catch (err: any) {
        const errorMessage = err.message || "Error al votar";
        toast.error(errorMessage);
        return false;
      }
    },
    []
  );

  return {
    songs,
    loading,
    error,
    stats,
    fetchSongs,
    createSong,
    createPrioritaria,
    createVip,
    updateStatus,
    approveSong,
    deleteSong,
    voteSong,
  };
}

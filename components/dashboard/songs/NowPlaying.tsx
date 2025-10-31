"use client";

import { useState, useEffect } from "react";
import { Song } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Music, User, SkipForward, CheckCircle2 } from "lucide-react";
import { useSongs } from "@/hooks/useSongs";

interface NowPlayingProps {
  song: Song & { user?: { name: string } | null };
  onUpdate: () => void;
}

export function NowPlaying({ song, onUpdate }: NowPlayingProps) {
  const { updateStatus, loading } = useSongs();
  const [progress, setProgress] = useState(0);

  // Simular progreso de canción (3 minutos)
  useEffect(() => {
    const startTime = song.fechaReproduccion
      ? new Date(song.fechaReproduccion).getTime()
      : Date.now();
    const duration = 3 * 60 * 1000; // 3 minutos

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [song]);

  const handleMarkAsPlayed = async () => {
    await updateStatus(song.id, "REPRODUCIDA");
    onUpdate();
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "LIBRE":
        return "bg-blue-500";
      case "PRIORITARIA":
        return "bg-purple-500";
      case "VIP":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 animate-pulse text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{song.titulo}</h2>
              <p className="text-lg text-muted-foreground">{song.artista}</p>
            </div>
          </div>
        </div>
        <Badge className={`${getTipoColor(song.tipo)} text-white`}>
          {song.tipo}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>Solicitado por: {song.user?.name || song.solicitanteNombre}</span>
      </div>

      {/* Dedicatoria VIP */}
      {song.tipo === "VIP" && (
        <div className="rounded-lg bg-orange-500/10 p-4">
          <p className="font-semibold text-orange-600">
            💝 De {song.dedicatoriaDe} para {song.dedicatoriaPara}
          </p>
          {song.dedicatoriaMensaje && (
            <p className="mt-2 text-muted-foreground">
              &quot;{song.dedicatoriaMensaje}&quot;
            </p>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          ~{Math.ceil((100 - progress) * 1.8)} segundos restantes
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleMarkAsPlayed}
          disabled={loading}
          className="flex-1 gap-2"
          size="lg"
        >
          <CheckCircle2 className="h-5 w-5" />
          Marcar como Reproducida
        </Button>
        <Button
          variant="outline"
          onClick={handleMarkAsPlayed}
          disabled={loading}
          size="lg"
          className="gap-2"
        >
          <SkipForward className="h-5 w-5" />
          Siguiente
        </Button>
      </div>
    </div>
  );
}

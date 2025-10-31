"use client";

import { useState, useEffect } from "react";
import { Song } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Music, User, Heart } from "lucide-react";

interface PublicNowPlayingProps {
  song: Song & { user?: { name: string } | null };
}

export function PublicNowPlaying({ song }: PublicNowPlayingProps) {
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
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 animate-pulse text-primary" />
            <div>
              <h2 className="text-3xl font-bold">{song.titulo}</h2>
              <p className="text-xl text-muted-foreground">{song.artista}</p>
            </div>
          </div>
        </div>
        <Badge className={`${getTipoColor(song.tipo)} text-white`}>
          {song.tipo}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <User className="h-4 w-4" />
        <span>Solicitado por: {song.user?.name || song.solicitanteNombre}</span>
      </div>

      {/* Dedicatoria VIP */}
      {song.tipo === "VIP" && (
        <div className="rounded-lg bg-gradient-to-r from-orange-500/20 to-pink-500/20 p-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-orange-500 text-orange-500" />
            <p className="font-semibold text-orange-600">
              De {song.dedicatoriaDe} para {song.dedicatoriaPara}
            </p>
          </div>
          {song.dedicatoriaMensaje && (
            <p className="mt-2 italic text-muted-foreground">
              &quot;{song.dedicatoriaMensaje}&quot;
            </p>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-3" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>En reproducción...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

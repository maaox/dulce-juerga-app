"use client";

import { useState } from "react";
import { Song } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Music,
  User,
  Heart,
  Clock,
  Play,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { useSongs } from "@/src/hooks/useSongs";
import Image from "next/image";

interface SongCardProps {
  song: Song & { user?: { name: string } | null };
  position?: number;
  onUpdate: () => void;
}

export function SongCard({ song, position, onUpdate }: SongCardProps) {
  const { updateStatus, deleteSong, loading } = useSongs();
  const [notasDj, setNotasDj] = useState(song.notasDj || "");
  const [showNotes, setShowNotes] = useState(false);

  const handlePlaySong = async () => {
    await updateStatus(song.id, "REPRODUCIENDO", notasDj);
    onUpdate();
  };

  const handleMarkAsPlayed = async () => {
    await updateStatus(song.id, "REPRODUCIDA", notasDj);
    onUpdate();
  };

  const handleDeleteSong = async () => {
    if (confirm("¿Estás seguro de eliminar esta canción?")) {
      await deleteSong(song.id);
      onUpdate();
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "LIBRE":
        return "bg-blue-500/10 text-blue-500";
      case "PRIORITARIA":
        return "bg-purple-500/10 text-purple-500";
      case "VIP":
        return "bg-orange-500/10 text-orange-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const tiempoEstimado = position ? position * 3 : 0;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              {position && (
                <Badge variant="outline" className="shrink-0">
                  #{position}
                </Badge>
              )}
              <div className="flex-1">
                <h3 className="font-semibold leading-tight">{song.titulo}</h3>
                <p className="text-sm text-muted-foreground">{song.artista}</p>
              </div>
            </div>
          </div>
          <Badge className={getTipoColor(song.tipo)}>{song.tipo}</Badge>
        </div>

        {/* Info */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{song.user?.name || song.solicitanteNombre}</span>
          </div>

          {song.tipo === "LIBRE" && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>{song.votos} votos</span>
            </div>
          )}

          {(song.tipo === "PRIORITARIA" || song.tipo === "VIP") && (
            <div className="flex items-center gap-1 text-green-600">
              <span className="font-semibold">S/{song.monto.toFixed(2)}</span>
            </div>
          )}

          {tiempoEstimado > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>~{tiempoEstimado} min</span>
            </div>
          )}
        </div>

        {/* Dedicatoria VIP */}
        {song.tipo === "VIP" && (
          <div className="rounded-lg bg-orange-500/10 p-3 text-sm">
            <p className="font-semibold text-orange-600">
              De {song.dedicatoriaDe} para {song.dedicatoriaPara}
            </p>
            {song.dedicatoriaMensaje && (
              <p className="mt-1 text-muted-foreground">
                &quot;{song.dedicatoriaMensaje}&quot;
              </p>
            )}
          </div>
        )}

        {/* Comprobante */}
        {song.comprobanteUrl && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(song.comprobanteUrl!, "_blank")}
          >
            <ImageIcon className="h-4 w-4" />
            Ver Comprobante
          </Button>
        )}

        {/* Notas del DJ */}
        {showNotes && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Notas del DJ</label>
            <Textarea
              value={notasDj}
              onChange={(e) => setNotasDj(e.target.value)}
              placeholder="Agregar notas..."
              rows={2}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={handlePlaySong}
            disabled={loading}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Reproducir
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAsPlayed}
            disabled={loading}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Marcar como Reproducida
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNotes(!showNotes)}
          >
            {showNotes ? "Ocultar" : "Notas"}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDeleteSong}
            disabled={loading}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}

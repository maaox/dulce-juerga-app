"use client";

import { Song } from "@prisma/client";
import { SongCard } from "./SongCard";

interface SongQueueProps {
  songs: Song[];
  tipo: "LIBRE" | "PRIORITARIA" | "VIP";
  onUpdate: () => void;
}

export function SongQueue({ songs, tipo, onUpdate }: SongQueueProps) {
  if (songs.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No hay canciones {tipo.toLowerCase()} en cola</p>
          <p className="mt-1 text-xs">
            {tipo === "LIBRE"
              ? "Los usuarios pueden solicitar canciones gratis"
              : tipo === "PRIORITARIA"
              ? "Solicitudes prioritarias cuestan S/5"
              : "Solicitudes VIP cuestan S/8 e incluyen dedicatoria"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {songs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          position={index + 1}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

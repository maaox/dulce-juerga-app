"use client";

import { useState } from "react";
import { Song } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Music,
  User,
  DollarSign,
  Image as ImageIcon,
  Heart,
  Maximize2,
} from "lucide-react";
import { useSongs } from "@/hooks/useSongs";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PendingApprovalsProps {
  songs: (Song & { user?: { name: string } | null })[];
  onUpdate: () => void;
}

export function PendingApprovals({ songs, onUpdate }: PendingApprovalsProps) {
  const { approveSong, loading } = useSongs();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const handleApprove = async (id: string) => {
    await approveSong(id, true);
    onUpdate();
  };

  const handleReject = async (id: string) => {
    if (confirm("¿Estás seguro de rechazar esta solicitud?")) {
      await approveSong(id, false);
      onUpdate();
    }
  };

  if (songs.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No hay solicitudes pendientes de aprobación
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {songs.map((song) => (
          <Card key={song.id} className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">{song.titulo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {song.artista}
                    </p>
                  </div>
                </div>
              </div>
              <Badge
                variant={song.tipo === "VIP" ? "default" : "secondary"}
                className={
                  song.tipo === "VIP"
                    ? "bg-orange-500"
                    : "bg-purple-500 text-white"
                }
              >
                {song.tipo}
              </Badge>
            </div>

            {/* Info */}
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{song.user?.name || "Usuario"}</span>
              </div>

              <div className="flex items-center gap-1 text-green-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold">
                  S/{song.monto.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Dedicatoria VIP */}
            {song.tipo === "VIP" && (
              <div className="rounded-lg bg-orange-500/10 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-orange-500" />
                  <p className="font-semibold text-orange-600">
                    De {song.dedicatoriaDe} para {song.dedicatoriaPara}
                  </p>
                </div>
                {song.dedicatoriaMensaje && (
                  <p className="mt-2 text-muted-foreground">
                    &quot;{song.dedicatoriaMensaje}&quot;
                  </p>
                )}
              </div>
            )}

            {/* Comprobante - Vista Compacta */}
            {song.comprobanteUrl && (
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={song.comprobanteUrl}
                    alt="Comprobante"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Comprobante de Pago</p>
                  <p className="text-xs text-muted-foreground">
                    Click para ver en tamaño completo
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedImage({
                      url: song.comprobanteUrl!,
                      title: `${song.titulo} - ${song.artista}`,
                    })
                  }
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleApprove(song.id)}
                disabled={loading}
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Aprobar
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(song.id)}
                disabled={loading}
                className="flex-1 gap-2"
              >
                <XCircle className="h-4 w-4" />
                Rechazar
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Modal para ver comprobante en tamaño completo */}
    <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedImage?.title}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {selectedImage && (
            <Image
              src={selectedImage.url}
              alt="Comprobante completo"
              fill
              className="object-contain"
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(selectedImage?.url, "_blank")}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Abrir en Nueva Pestaña
          </Button>
          <Button onClick={() => setSelectedImage(null)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
}

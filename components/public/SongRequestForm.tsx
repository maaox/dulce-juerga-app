"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSongs } from "@/hooks/useSongs";
import { Send } from "lucide-react";

interface SongRequestFormProps {
  onSuccess: () => void;
}

export function SongRequestForm({ onSuccess }: SongRequestFormProps) {
  const { createSong, loading } = useSongs();
  const [formData, setFormData] = useState({
    titulo: "",
    artista: "",
    solicitanteNombre: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createSong(formData);

    if (result) {
      // Limpiar formulario
      setFormData({
        titulo: "",
        artista: "",
        solicitanteNombre: "",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">
          Título de la Canción <span className="text-red-500">*</span>
        </Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) =>
            setFormData({ ...formData, titulo: e.target.value })
          }
          placeholder="Ej: Bohemian Rhapsody"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="artista">
          Artista <span className="text-red-500">*</span>
        </Label>
        <Input
          id="artista"
          value={formData.artista}
          onChange={(e) =>
            setFormData({ ...formData, artista: e.target.value })
          }
          placeholder="Ej: Queen"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">
          Tu Nombre <span className="text-muted-foreground">(Opcional)</span>
        </Label>
        <Input
          id="nombre"
          value={formData.solicitanteNombre}
          onChange={(e) =>
            setFormData({ ...formData, solicitanteNombre: e.target.value })
          }
          placeholder="Anónimo"
        />
        <p className="text-xs text-muted-foreground">
          Si no ingresas tu nombre, aparecerás como &quot;Anónimo&quot;
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full gap-2">
        <Send className="h-4 w-4" />
        {loading ? "Enviando..." : "Solicitar Canción"}
      </Button>

      <div className="rounded-lg bg-blue-500/10 p-3 text-sm text-muted-foreground">
        <p className="font-medium text-blue-600">💡 Tip:</p>
        <p className="mt-1">
          Las canciones libres se ordenan por votos. ¡Pide a tus amigos que
          voten por tu canción!
        </p>
      </div>
    </form>
  );
}

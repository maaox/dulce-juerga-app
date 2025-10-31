"use client";

import { useState } from "react";
import { Config } from "@/hooks/useConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Music, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface PricesConfigProps {
  config: Config;
  onUpdate: (updates: Partial<Config>) => Promise<any>;
}

export function PricesConfig({ config, onUpdate }: PricesConfigProps) {
  const [precioLibre, setPrecioLibre] = useState(config.precioLibre);
  const [precioPrioritaria, setPrecioPrioritaria] = useState(config.precioPrioritaria);
  const [precioVip, setPrecioVip] = useState(config.precioVip);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate({
        precioLibre,
        precioPrioritaria,
        precioVip,
      });
      toast.success("Precios actualizados correctamente");
    } catch (error) {
      toast.error("Error al actualizar precios");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Music className="h-6 w-6" />
          Precios DJ Requests
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configura los precios para las solicitudes de canciones
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="precioLibre">Solicitud Libre (Gratis)</Label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">S/</span>
            <Input
              id="precioLibre"
              type="number"
              min="0"
              step="0.01"
              value={precioLibre}
              onChange={(e) => setPrecioLibre(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Solicitudes gratuitas que entran en cola según votos
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precioPrioritaria">Solicitud Prioritaria</Label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">S/</span>
            <Input
              id="precioPrioritaria"
              type="number"
              min="0"
              step="0.01"
              value={precioPrioritaria}
              onChange={(e) => setPrecioPrioritaria(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Solicitudes que tienen prioridad sobre las gratuitas
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precioVip">Solicitud VIP con Dedicatoria</Label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">S/</span>
            <Input
              id="precioVip"
              type="number"
              min="0"
              step="0.01"
              value={precioVip}
              onChange={(e) => setPrecioVip(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Solicitudes con máxima prioridad e incluye dedicatoria
          </p>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
        <h4 className="font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Resumen de Precios
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Libre:</span>
            <span className="font-semibold">S/{precioLibre.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Prioritaria:</span>
            <span className="font-semibold">S/{precioPrioritaria.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>VIP:</span>
            <span className="font-semibold">S/{precioVip.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full"
        size="lg"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}

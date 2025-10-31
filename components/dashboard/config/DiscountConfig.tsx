"use client";

import { useState } from "react";
import { Config } from "@/src/hooks/useConfig";
import { DescuentoFranja } from "@/src/lib/utils/config";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DiscountFormModal } from "./DiscountFormModal";
import { Clock, Percent, Edit2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface DiscountConfigProps {
  config: Config;
  onUpdate: (enabled: boolean, descuentos: DescuentoFranja[]) => Promise<any>;
}

export function DiscountConfig({ config, onUpdate }: DiscountConfigProps) {
  const [enabled, setEnabled] = useState(config.descuentosEnabled);
  const [descuentos, setDescuentos] = useState<DescuentoFranja[]>(config.descuentos || []);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate(enabled, descuentos);
      toast.success("Descuentos actualizados correctamente");
    } catch (error) {
      toast.error("Error al actualizar descuentos");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFranja = (franja: DescuentoFranja) => {
    if (editingIndex !== null) {
      const newDescuentos = [...descuentos];
      newDescuentos[editingIndex] = franja;
      setDescuentos(newDescuentos);
    } else {
      setDescuentos([...descuentos, franja]);
    }
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleDeleteFranja = (index: number) => {
    if (confirm("¿Estás seguro de eliminar esta franja de descuento?")) {
      setDescuentos(descuentos.filter((_, i) => i !== index));
    }
  };

  const handleEditFranja = (index: number) => {
    setEditingIndex(index);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Descuentos por Hora</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configura franjas horarias de descuento que se aplicarán automáticamente
        </p>
      </div>

      <Separator />

      <div className="flex items-center space-x-2">
        <Switch
          id="descuentos-enabled"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <Label htmlFor="descuentos-enabled" className="font-semibold">
          Descuentos habilitados
        </Label>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Franjas Horarias</h3>
          <Button
            onClick={() => {
              setEditingIndex(null);
              setShowModal(true);
            }}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar franja
          </Button>
        </div>

        {descuentos.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-sm text-muted-foreground">
              No hay franjas de descuento configuradas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {descuentos.map((franja, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold">{franja.descripcion}</h4>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {franja.horaInicio} - {franja.horaFin}
                    </div>
                    <div className="flex items-center gap-1">
                      <Percent className="h-4 w-4" />
                      {franja.porcentaje}% OFF
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditFranja(index)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteFranja(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full"
        size="lg"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>

      <DiscountFormModal
        open={showModal}
        onOpenChange={setShowModal}
        onSubmit={handleAddFranja}
        initialData={editingIndex !== null ? descuentos[editingIndex] : undefined}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { DescuentoFranja } from "@/lib/utils/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DiscountFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (franja: DescuentoFranja) => void;
  initialData?: DescuentoFranja;
}

export function DiscountFormModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: DiscountFormModalProps) {
  const [descripcion, setDescripcion] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [porcentaje, setPorcentaje] = useState(10);

  useEffect(() => {
    if (initialData) {
      setDescripcion(initialData.descripcion);
      setHoraInicio(initialData.horaInicio);
      setHoraFin(initialData.horaFin);
      setPorcentaje(initialData.porcentaje);
    } else {
      setDescripcion("");
      setHoraInicio("");
      setHoraFin("");
      setPorcentaje(10);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion || !horaInicio || !horaFin) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (horaFin <= horaInicio) {
      alert("La hora fin debe ser mayor a la hora inicio");
      return;
    }

    onSubmit({
      descripcion,
      horaInicio,
      horaFin,
      porcentaje,
    });

    // Reset form
    setDescripcion("");
    setHoraInicio("");
    setHoraFin("");
    setPorcentaje(10);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar" : "Agregar"} Franja de Descuento
          </DialogTitle>
          <DialogDescription>
            Define los horarios y porcentaje de descuento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="Ej: Happy Hour Extremo"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horaInicio">Hora Inicio</Label>
              <Input
                id="horaInicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaFin">Hora Fin</Label>
              <Input
                id="horaFin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Porcentaje de Descuento</Label>
              <span className="text-2xl font-bold">{porcentaje}%</span>
            </div>
            <Slider
              value={[porcentaje]}
              onValueChange={(value) => setPorcentaje(value[0])}
              min={0}
              max={50}
              step={5}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? "Actualizar" : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

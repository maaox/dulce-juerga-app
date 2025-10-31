"use client";

import { useState } from "react";
import { Config } from "@/hooks/useConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface EventConfigProps {
  config: Config;
  onUpdate: (updates: Partial<Config>) => Promise<any>;
}

export function EventConfig({ config, onUpdate }: EventConfigProps) {
  const [eventoNombre, setEventoNombre] = useState(config.eventoNombre);
  const [eventoFecha, setEventoFecha] = useState(
    format(new Date(config.eventoFecha), "yyyy-MM-dd")
  );
  const [eventoHoraInicio, setEventoHoraInicio] = useState(config.eventoHoraInicio);
  const [eventoHoraFin, setEventoHoraFin] = useState(config.eventoHoraFin);
  const [eventoAforoMaximo, setEventoAforoMaximo] = useState(config.eventoAforoMaximo);
  const [eventoEstado, setEventoEstado] = useState(config.eventoEstado);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate({
        eventoNombre,
        eventoFecha: new Date(eventoFecha),
        eventoHoraInicio,
        eventoHoraFin,
        eventoAforoMaximo,
        eventoEstado,
      });
      toast.success("Configuración del evento actualizada");
    } catch (error) {
      toast.error("Error al actualizar configuración");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Configuración del Evento
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define los datos principales del evento
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eventoNombre">Nombre del Evento</Label>
          <Input
            id="eventoNombre"
            placeholder="Halloween Party 2024"
            value={eventoNombre}
            onChange={(e) => setEventoNombre(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="eventoFecha">Fecha del Evento</Label>
            <Input
              id="eventoFecha"
              type="date"
              value={eventoFecha}
              onChange={(e) => setEventoFecha(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventoEstado">Estado del Evento</Label>
            <Select value={eventoEstado} onValueChange={setEventoEstado}>
              <SelectTrigger id="eventoEstado">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preparacion">En Preparación</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="eventoHoraInicio">Hora de Inicio</Label>
            <Input
              id="eventoHoraInicio"
              type="time"
              value={eventoHoraInicio}
              onChange={(e) => setEventoHoraInicio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventoHoraFin">Hora de Fin</Label>
            <Input
              id="eventoHoraFin"
              type="time"
              value={eventoHoraFin}
              onChange={(e) => setEventoHoraFin(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventoAforoMaximo">Aforo Máximo</Label>
            <Input
              id="eventoAforoMaximo"
              type="number"
              min="1"
              value={eventoAforoMaximo}
              onChange={(e) => setEventoAforoMaximo(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
        <h4 className="font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          Resumen del Evento
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Nombre:</span>
            <span className="font-semibold">{eventoNombre}</span>
          </div>
          <div className="flex justify-between">
            <span>Fecha:</span>
            <span className="font-semibold">
              {format(new Date(eventoFecha), "dd/MM/yyyy")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Horario:</span>
            <span className="font-semibold">
              {eventoHoraInicio} - {eventoHoraFin}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Aforo:</span>
            <span className="font-semibold">{eventoAforoMaximo} personas</span>
          </div>
          <div className="flex justify-between">
            <span>Estado:</span>
            <span className="font-semibold capitalize">
              {eventoEstado === "preparacion"
                ? "En Preparación"
                : eventoEstado === "activo"
                  ? "Activo"
                  : "Finalizado"}
            </span>
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

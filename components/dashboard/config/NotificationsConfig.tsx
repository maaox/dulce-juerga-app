"use client";

import { useState } from "react";
import { Config } from "@/src/hooks/useConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface NotificationsConfigProps {
  config: Config;
  onUpdate: (updates: Partial<Config>) => Promise<any>;
}

export function NotificationsConfig({ config, onUpdate }: NotificationsConfigProps) {
  const [emailNotificaciones, setEmailNotificaciones] = useState(
    config.emailNotificaciones || ""
  );
  const [whatsappNotificaciones, setWhatsappNotificaciones] = useState(
    config.whatsappNotificaciones || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onUpdate({
        emailNotificaciones: emailNotificaciones || null,
        whatsappNotificaciones: whatsappNotificaciones || null,
      });
      toast.success("Configuración de notificaciones actualizada");
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
          <Bell className="h-6 w-6" />
          Notificaciones
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configura los canales para recibir notificaciones del sistema
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emailNotificaciones" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email para Notificaciones
          </Label>
          <Input
            id="emailNotificaciones"
            type="email"
            placeholder="admin@halloween.com"
            value={emailNotificaciones}
            onChange={(e) => setEmailNotificaciones(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Recibirás notificaciones de ventas importantes, stock bajo, etc.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNotificaciones" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp para Notificaciones
          </Label>
          <Input
            id="whatsappNotificaciones"
            type="tel"
            placeholder="987654321"
            value={whatsappNotificaciones}
            onChange={(e) => setWhatsappNotificaciones(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Número de WhatsApp (solo números, sin +51)
          </p>
        </div>
      </div>

      <Separator />

      <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
        <h4 className="font-semibold">Tipos de Notificaciones</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Ventas completadas (resumen diario)</li>
          <li>• Stock bajo de productos</li>
          <li>• Solicitudes de canciones VIP</li>
          <li>• Errores críticos del sistema</li>
          <li>• Reportes de fin de evento</li>
        </ul>
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

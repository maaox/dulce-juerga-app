"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useSongs } from "@/src/hooks/useSongs";
import { Crown, Zap, Upload, QrCode } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface PaidRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: "PRIORITARIA" | "VIP";
  onSuccess: () => void;
}

export function PaidRequestModal({
  open,
  onOpenChange,
  tipo,
  onSuccess,
}: PaidRequestModalProps) {
  const { createPrioritaria, createVip, loading } = useSongs();
  const [formData, setFormData] = useState({
    titulo: "",
    artista: "",
    solicitanteNombre: "",
    dedicatoriaDe: "",
    dedicatoriaPara: "",
    dedicatoriaMensaje: "",
  });
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(
    null
  );
  const [cuentaYape, setCuentaYape] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const precio = tipo === "PRIORITARIA" ? 5 : 8;

  // Fetch Yape QR from config
  useEffect(() => {
    const fetchYapeConfig = async () => {
      try {
        const response = await fetch("/api/config/cuentas-pago");
        if (response.ok) {
          const data = await response.json();
          setCuentaYape(data.yape);
        }
      } catch (error) {
        console.error("Error fetching Yape config:", error);
      } finally {
        setLoadingConfig(false);
      }
    };

    if (open) {
      fetchYapeConfig();
    }
  }, [open]);

  const handleComprobanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobanteFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprobantePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comprobanteFile) {
      alert("Debes subir el comprobante de pago");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("titulo", formData.titulo);
    formDataToSend.append("artista", formData.artista);
    formDataToSend.append("solicitanteNombre", formData.solicitanteNombre || "Anónimo");
    formDataToSend.append("comprobante", comprobanteFile);

    if (tipo === "VIP") {
      formDataToSend.append("dedicatoriaDe", formData.dedicatoriaDe);
      formDataToSend.append("dedicatoriaPara", formData.dedicatoriaPara);
      if (formData.dedicatoriaMensaje) {
        formDataToSend.append(
          "dedicatoriaMensaje",
          formData.dedicatoriaMensaje
        );
      }
    }

    const result =
      tipo === "PRIORITARIA"
        ? await createPrioritaria(formDataToSend)
        : await createVip(formDataToSend);

    if (result) {
      // Limpiar formulario
      setFormData({
        titulo: "",
        artista: "",
        solicitanteNombre: "",
        dedicatoriaDe: "",
        dedicatoriaPara: "",
        dedicatoriaMensaje: "",
      });
      setComprobanteFile(null);
      setComprobantePreview(null);
      onSuccess();
    }
  };

  const Icon = tipo === "PRIORITARIA" ? Zap : Crown;
  const color = tipo === "PRIORITARIA" ? "purple" : "orange";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 text-${color}-600`} />
            Solicitud {tipo === "PRIORITARIA" ? "Prioritaria" : "VIP"}
          </DialogTitle>
          <DialogDescription>
            {tipo === "PRIORITARIA"
              ? "Tu canción sonará antes que las solicitudes libres"
              : "Tu canción tendrá máxima prioridad y se mencionará tu dedicatoria"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Precio */}
          <div className={`rounded-lg bg-${color}-500/10 p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Precio:</span>
              <span className={`text-2xl font-bold text-${color}-600`}>
                S/{precio.toFixed(2)}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Escanea para pagar con Yape
            </Label>
            <div className="flex flex-col items-center rounded-lg border p-4">
              {loadingConfig ? (
                <div className="flex h-48 w-48 items-center justify-center">
                  <p className="text-sm text-muted-foreground">Cargando QR...</p>
                </div>
              ) : cuentaYape?.qrUrl ? (
                <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                  <Image
                    src={cuentaYape.qrUrl}
                    alt="QR Code Yape"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed">
                  <p className="text-center text-sm text-muted-foreground">
                    QR no configurado
                  </p>
                </div>
              )}
              {cuentaYape?.numero && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Yape: <strong>{cuentaYape.numero}</strong>
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Nombre del Solicitante */}
          <div className="space-y-2">
            <Label htmlFor="solicitanteNombre">
              Tu Nombre <span className="text-muted-foreground">(Opcional)</span>
            </Label>
            <Input
              id="solicitanteNombre"
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

          {/* Datos de la canción */}
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
              required
            />
          </div>

          {/* Dedicatoria (solo VIP) */}
          {tipo === "VIP" && (
            <>
              <Separator />
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Dedicatoria Personalizada
                </Label>

                <div className="space-y-2">
                  <Label htmlFor="dedicatoriaDe">
                    De <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dedicatoriaDe"
                    value={formData.dedicatoriaDe}
                    onChange={(e) =>
                      setFormData({ ...formData, dedicatoriaDe: e.target.value })
                    }
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dedicatoriaPara">
                    Para <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dedicatoriaPara"
                    value={formData.dedicatoriaPara}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dedicatoriaPara: e.target.value,
                      })
                    }
                    placeholder="Nombre del destinatario"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dedicatoriaMensaje">
                    Mensaje{" "}
                    <span className="text-muted-foreground">(Opcional)</span>
                  </Label>
                  <Textarea
                    id="dedicatoriaMensaje"
                    value={formData.dedicatoriaMensaje}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dedicatoriaMensaje: e.target.value,
                      })
                    }
                    placeholder="Un mensaje especial..."
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Comprobante */}
          <div className="space-y-2">
            <Label htmlFor="comprobante">
              Comprobante de Pago <span className="text-red-500">*</span>
            </Label>
            {comprobantePreview && (
              <div className="relative aspect-video overflow-hidden rounded-lg border">
                <Image
                  src={comprobantePreview}
                  alt="Comprobante preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                id="comprobante"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleComprobanteChange}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Captura de pantalla de tu pago por Yape o Plin
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className={`w-full gap-2 bg-${color}-600 hover:bg-${color}-700`}
          >
            <Upload className="h-4 w-4" />
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </Button>

          <div className={`rounded-lg bg-${color}-500/10 p-3 text-sm`}>
            <p className={`font-medium text-${color}-600`}>
              ℹ️ Importante:
            </p>
            <p className="mt-1 text-muted-foreground">
              Tu solicitud será revisada por el DJ antes de ser agregada a la
              cola. Una vez aprobada, tu canción sonará {tipo === "PRIORITARIA" ? "antes que las solicitudes libres" : "con máxima prioridad y se mencionará tu dedicatoria"}.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

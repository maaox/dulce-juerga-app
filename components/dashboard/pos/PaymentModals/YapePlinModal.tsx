"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseCartReturn } from "@/hooks/useCart";
import { useSales } from "@/hooks/useSales";
import { Smartphone, DollarSign, Upload, QrCode } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface YapePlinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: UseCartReturn;
  metodo: "YAPE" | "PLIN";
  onSuccess: () => void;
}

export function YapePlinModal({
  open,
  onOpenChange,
  cart,
  metodo,
  onSuccess,
}: YapePlinModalProps) {
  const { data: session } = useSession();
  const { createSale, loading } = useSales();
  const [numeroOperacion, setNumeroOperacion] = useState("");
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(
    null
  );
  const [cuentasPago, setCuentasPago] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Fetch payment accounts from config
  useEffect(() => {
    const fetchCuentasPago = async () => {
      try {
        const response = await fetch("/api/config/cuentas-pago");
        if (response.ok) {
          const data = await response.json();
          setCuentasPago(data);
        }
      } catch (error) {
        console.error("Error fetching cuentas pago:", error);
      } finally {
        setLoadingConfig(false);
      }
    };

    if (open) {
      fetchCuentasPago();
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

  const handleSubmit = async () => {
    if (!numeroOperacion || !session?.user?.barra) return;

    // Upload comprobante if provided
    let comprobanteUrl = null;
    if (comprobanteFile) {
      const formData = new FormData();
      formData.append("file", comprobanteFile);
      formData.append("folder", "comprobantes");

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          comprobanteUrl = uploadData.url;
        }
      } catch (error) {
        console.error("Error uploading comprobante:", error);
      }
    }

    const result = await createSale({
      items: cart.items.map((item) => ({
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      })),
      descuentoPorcentaje: cart.descuentoPorcentaje,
      metodoPago: metodo,
      pagoDetalles: {
        numeroOperacion,
        comprobanteUrl,
      },
      barra: session.user.barra,
    });

    if (result) {
      setNumeroOperacion("");
      setComprobanteFile(null);
      setComprobantePreview(null);
      onSuccess();
    }
  };

  const handleClose = () => {
    setNumeroOperacion("");
    setComprobanteFile(null);
    setComprobantePreview(null);
    onOpenChange(false);
  };

  const Icon = metodo === "YAPE" ? Smartphone : DollarSign;
  const color = metodo === "YAPE" ? "purple" : "blue";

  // Get QR code and phone from config
  const currentAccount = metodo === "YAPE" ? cuentasPago?.yape : cuentasPago?.plin;
  const qrCodeUrl = currentAccount?.qrUrl;
  const phoneNumber = currentAccount?.numero;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 text-${color}-500`} />
            Pago con {metodo}
          </DialogTitle>
          <DialogDescription>
            Escanea el código QR y completa los datos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Total a Pagar */}
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Total a pagar:</div>
            <div className="text-3xl font-bold">S/{cart.total.toFixed(2)}</div>
          </div>

          <Separator />

          {/* QR Code */}
          <div className="flex flex-col items-center gap-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <QrCode className="h-4 w-4" />
              Escanea para pagar
            </div>
            {loadingConfig ? (
              <div className="flex h-48 w-48 items-center justify-center">
                <p className="text-sm text-muted-foreground">Cargando QR...</p>
              </div>
            ) : qrCodeUrl ? (
              <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                <Image
                  src={qrCodeUrl}
                  alt={`${metodo} QR Code`}
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
            {phoneNumber && (
              <p className="text-center text-xs text-muted-foreground">
                Número: {phoneNumber}
              </p>
            )}
          </div>

          <Separator />

          {/* Número de Operación */}
          <div className="space-y-2">
            <Label htmlFor="numeroOperacion">
              Número de Operación <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numeroOperacion"
              type="text"
              value={numeroOperacion}
              onChange={(e) => setNumeroOperacion(e.target.value)}
              placeholder="Ej: 123456789"
              autoFocus
            />
          </div>

          {/* Comprobante Upload (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="comprobante">
              Comprobante <span className="text-muted-foreground">(Opcional)</span>
            </Label>
            <div className="flex items-center gap-2">
              {comprobantePreview && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={comprobantePreview}
                    alt="Comprobante preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="comprobante"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleComprobanteChange}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Captura de pantalla de la operación
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!numeroOperacion || loading}
            className={`bg-${color}-500 hover:bg-${color}-600`}
          >
            {loading ? "Procesando..." : "Completar Venta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

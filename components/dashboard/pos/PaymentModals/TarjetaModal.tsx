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
import { UseCartReturn } from "@/src/hooks/useCart";
import { useSales } from "@/src/hooks/useSales";
import { Building2, Copy, CheckCircle2, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface TarjetaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: UseCartReturn;
  onSuccess: () => void;
}

export function TarjetaModal({
  open,
  onOpenChange,
  cart,
  onSuccess,
}: TarjetaModalProps) {
  const { data: session } = useSession();
  const { createSale, loading } = useSales();
  const { toast } = useToast();
  const [numeroOperacion, setNumeroOperacion] = useState("");
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [comprobantePreview, setComprobantePreview] = useState<string | null>(null);
  const [cuentaBancaria, setCuentaBancaria] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch bank account from config
  useEffect(() => {
    const fetchCuentaBancaria = async () => {
      try {
        const response = await fetch("/api/config/cuentas-pago");
        if (response.ok) {
          const data = await response.json();
          setCuentaBancaria(data.transferencia);
        }
      } catch (error) {
        console.error("Error fetching cuenta bancaria:", error);
      } finally {
        setLoadingConfig(false);
      }
    };

    if (open) {
      fetchCuentaBancaria();
    }
  }, [open]);

  const isFormValid = numeroOperacion.trim() !== "";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copiado",
      description: `${field} copiado al portapapeles`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

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
    if (!isFormValid || !session?.user?.barra) return;

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
      metodoPago: "TARJETA",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-500" />
            Transferencia Bancaria
          </DialogTitle>
          <DialogDescription>
            Realiza la transferencia y completa los datos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Total a Pagar */}
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Total a pagar:</div>
            <div className="text-3xl font-bold">S/{cart.total.toFixed(2)}</div>
          </div>

          <Separator />

          {/* Bank Account Details */}
          {loadingConfig ? (
            <div className="space-y-3 rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Cargando datos bancarios...</p>
            </div>
          ) : cuentaBancaria ? (
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="h-4 w-4" />
                Datos Bancarios
              </div>

              {/* Banco */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Banco</p>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                  <p className="font-medium">{cuentaBancaria.banco}</p>
                </div>
              </div>

              {/* Número de Cuenta */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Número de Cuenta</p>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                  <p className="font-mono">{cuentaBancaria.numeroCuenta}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(cuentaBancaria.numeroCuenta, "Número de cuenta")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "Número de cuenta" ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* CCI */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">CCI</p>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                  <p className="font-mono text-sm">{cuentaBancaria.cci}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(cuentaBancaria.cci, "CCI")}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === "CCI" ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Datos bancarios no configurados
              </p>
            </div>
          )}

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
            disabled={!isFormValid || loading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {loading ? "Procesando..." : "Completar Venta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

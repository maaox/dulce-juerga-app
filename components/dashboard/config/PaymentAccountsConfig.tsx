"use client";

import { useState, useRef } from "react";
import { Config } from "@/hooks/useConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PaymentAccountsConfigProps {
  config: Config;
  onUpdate: (formData: FormData) => Promise<any>;
}

export function PaymentAccountsConfig({ config, onUpdate }: PaymentAccountsConfigProps) {
  const [saving, setSaving] = useState(false);
  const yapeQrInputRef = useRef<HTMLInputElement>(null);
  const plinQrInputRef = useRef<HTMLInputElement>(null);

  const cuentasPago = config.cuentasPago || {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      const formData = new FormData(e.currentTarget);
      await onUpdate(formData);
      toast.success("Cuentas de pago actualizadas correctamente");
    } catch (error) {
      toast.error("Error al actualizar cuentas de pago");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cuentas de Pago</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configura las cuentas para recibir pagos de los clientes
        </p>
      </div>

      <Separator />

      {/* YAPE */}
      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Yape</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="yapeNumero">Número de celular</Label>
            <Input
              id="yapeNumero"
              name="yapeNumero"
              placeholder="987654321"
              defaultValue={cuentasPago.yape?.numero || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yapeNombre">Nombre del titular</Label>
            <Input
              id="yapeNombre"
              name="yapeNombre"
              placeholder="Halloween Party"
              defaultValue={cuentasPago.yape?.nombre || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Código QR</Label>
          <div className="flex gap-4">
            {cuentasPago.yape?.qrUrl && (
              <div className="relative h-32 w-32 rounded-lg border overflow-hidden">
                <Image
                  src={cuentasPago.yape.qrUrl}
                  alt="Yape QR"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                ref={yapeQrInputRef}
                type="file"
                name="yapeQr"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast.info("Archivo seleccionado: " + file.name);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => yapeQrInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {cuentasPago.yape?.qrUrl ? "Cambiar QR" : "Subir QR"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Imagen del código QR de Yape
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* PLIN */}
      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Plin</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="plinNumero">Número de celular</Label>
            <Input
              id="plinNumero"
              name="plinNumero"
              placeholder="987654321"
              defaultValue={cuentasPago.plin?.numero || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plinNombre">Nombre del titular</Label>
            <Input
              id="plinNombre"
              name="plinNombre"
              placeholder="Halloween Party"
              defaultValue={cuentasPago.plin?.nombre || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Código QR</Label>
          <div className="flex gap-4">
            {cuentasPago.plin?.qrUrl && (
              <div className="relative h-32 w-32 rounded-lg border overflow-hidden">
                <Image
                  src={cuentasPago.plin.qrUrl}
                  alt="Plin QR"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                ref={plinQrInputRef}
                type="file"
                name="plinQr"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast.info("Archivo seleccionado: " + file.name);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => plinQrInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {cuentasPago.plin?.qrUrl ? "Cambiar QR" : "Subir QR"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Imagen del código QR de Plin
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* TRANSFERENCIA */}
      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Transferencia Bancaria</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transferenciaBanco">Banco</Label>
            <Input
              id="transferenciaBanco"
              name="transferenciaBanco"
              placeholder="BCP"
              defaultValue={cuentasPago.transferencia?.banco || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transferenciaTitular">Titular</Label>
            <Input
              id="transferenciaTitular"
              name="transferenciaTitular"
              placeholder="Nombre del titular"
              defaultValue={cuentasPago.transferencia?.titular || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transferenciaNumeroCuenta">Número de cuenta</Label>
            <Input
              id="transferenciaNumeroCuenta"
              name="transferenciaNumeroCuenta"
              placeholder="123-456-789"
              defaultValue={cuentasPago.transferencia?.numeroCuenta || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transferenciaCci">CCI</Label>
            <Input
              id="transferenciaCci"
              name="transferenciaCci"
              placeholder="00123456789"
              defaultValue={cuentasPago.transferencia?.cci || ""}
            />
          </div>
        </div>
      </Card>

      <Separator />

      <Button
        type="submit"
        disabled={saving}
        className="w-full"
        size="lg"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}

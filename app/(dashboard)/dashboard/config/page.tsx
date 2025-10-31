"use client";

import { useConfig } from "@/hooks/useConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscountConfig } from "@/components/dashboard/config/DiscountConfig";
import { PricesConfig } from "@/components/dashboard/config/PricesConfig";
import { PaymentAccountsConfig } from "@/components/dashboard/config/PaymentAccountsConfig";
import { EventConfig } from "@/components/dashboard/config/EventConfig";
import { NotificationsConfig } from "@/components/dashboard/config/NotificationsConfig";
import { Settings2 } from "lucide-react";

export default function ConfigPage() {
  const { config, loading, updateConfig, updateDescuentos, updateCuentasPago } = useConfig();

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Settings2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No se pudo cargar la configuración</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Settings2 className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
      </div>

      <Tabs defaultValue="descuentos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="descuentos">Descuentos</TabsTrigger>
          <TabsTrigger value="precios">Precios DJ</TabsTrigger>
          <TabsTrigger value="cuentas">Cuentas de Pago</TabsTrigger>
          <TabsTrigger value="evento">Evento</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="descuentos">
          <Card className="p-6">
            <DiscountConfig
              config={config}
              onUpdate={updateDescuentos}
            />
          </Card>
        </TabsContent>

        <TabsContent value="precios">
          <Card className="p-6">
            <PricesConfig
              config={config}
              onUpdate={updateConfig}
            />
          </Card>
        </TabsContent>

        <TabsContent value="cuentas">
          <Card className="p-6">
            <PaymentAccountsConfig
              config={config}
              onUpdate={updateCuentasPago}
            />
          </Card>
        </TabsContent>

        <TabsContent value="evento">
          <Card className="p-6">
            <EventConfig
              config={config}
              onUpdate={updateConfig}
            />
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones">
          <Card className="p-6">
            <NotificationsConfig
              config={config}
              onUpdate={updateConfig}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

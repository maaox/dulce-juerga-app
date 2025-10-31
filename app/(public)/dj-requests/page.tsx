"use client";

import { useState } from "react";
import { usePublicQueue } from "@/src/hooks/usePublicQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Radio,
  Send,
  Crown,
  Zap,
  RefreshCw,
} from "lucide-react";
import { PublicNowPlaying } from "@/components/public/PublicNowPlaying";
import { PublicQueue } from "@/components/public/PublicQueue";
import { SongRequestForm } from "@/components/public/SongRequestForm";
import { PaidRequestModal } from "@/components/public/PaidRequestModal";

export default function DJRequestsPage() {
  const {
    ahoraSonando,
    libres,
    prioritarias,
    vips,
    siguientes,
    loading,
    refresh,
  } = usePublicQueue(true, 10000);

  const [activeTab, setActiveTab] = useState("solicitar");
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [requestType, setRequestType] = useState<"PRIORITARIA" | "VIP">(
    "PRIORITARIA"
  );

  const handleOpenPaidRequest = (tipo: "PRIORITARIA" | "VIP") => {
    setRequestType(tipo);
    setShowPaidModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            🎵 Solicitudes de DJ
          </h1>
          <p className="text-lg text-muted-foreground">
            Solicita tu canción favorita para la fiesta
          </p>
        </div>

        {/* Now Playing */}
        {ahoraSonando && (
          <Card className="mb-8 border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-6 w-6 animate-pulse text-primary" />
                Ahora Sonando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PublicNowPlaying song={ahoraSonando} />
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solicitar" className="gap-2">
              <Send className="h-4 w-4" />
              Solicitar Canción
            </TabsTrigger>
            <TabsTrigger value="cola" className="gap-2">
              <Music className="h-4 w-4" />
              Ver Cola
              <Badge variant="secondary" className="ml-1">
                {libres.length + prioritarias.length + vips.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Solicitar */}
          <TabsContent value="solicitar" className="mt-6 space-y-6">
            {/* Solicitud Libre */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-blue-500" />
                  Solicitud Libre (Gratis)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SongRequestForm onSuccess={refresh} />
              </CardContent>
            </Card>

            {/* Solicitudes Pagadas */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Prioritaria */}
              <Card className="border-purple-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Zap className="h-5 w-5" />
                    Solicitud Prioritaria
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Precio:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        S/5.00
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✓ Tu canción suena antes que las libres</li>
                      <li>✓ Requiere aprobación del DJ</li>
                      <li>✓ Pago por Yape o Plin</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleOpenPaidRequest("PRIORITARIA")}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Solicitar Prioritaria
                  </Button>
                </CardContent>
              </Card>

              {/* VIP */}
              <Card className="border-orange-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <Crown className="h-5 w-5" />
                    Solicitud VIP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Precio:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        S/8.00
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✓ Máxima prioridad en la cola</li>
                      <li>✓ Dedicatoria personalizada</li>
                      <li>✓ El DJ menciona tu dedicatoria</li>
                      <li>✓ Pago por Yape o Plin</li>
                    </ul>
                  </div>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleOpenPaidRequest("VIP")}
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Solicitar VIP
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Cola */}
          <TabsContent value="cola" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </div>
            <PublicQueue
              libres={libres}
              prioritarias={prioritarias}
              vips={vips}
              siguientes={siguientes}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Paid Request Modal */}
      <PaidRequestModal
        open={showPaidModal}
        onOpenChange={setShowPaidModal}
        tipo={requestType}
        onSuccess={() => {
          refresh();
          setShowPaidModal(false);
        }}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSongs } from "@/hooks/useSongs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  RefreshCw,
  Clock,
  DollarSign,
  Users,
  Radio,
} from "lucide-react";
import { SongQueue } from "@/components/dashboard/songs/SongQueue";
import { NowPlaying } from "@/components/dashboard/songs/NowPlaying";
import { PendingApprovals } from "@/components/dashboard/songs/PendingApprovals";

export default function CancionesPage() {
  const { songs, loading, stats, fetchSongs } = useSongs();
  const [activeTab, setActiveTab] = useState("libres");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSongs({ estado: "EN_COLA,REPRODUCIENDO,PENDIENTE" });

    // Auto-refresh cada 10 segundos
    const interval = setInterval(() => {
      fetchSongs({ estado: "EN_COLA,REPRODUCIENDO,PENDIENTE" });
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchSongs]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSongs({ estado: "EN_COLA,REPRODUCIENDO,PENDIENTE" });
    setRefreshing(false);
  };

  const nowPlaying = songs.find((s) => s.estado === "REPRODUCIENDO");
  const pending = songs.filter((s) => s.estado === "PENDIENTE");
  const libres = songs.filter((s) => s.tipo === "LIBRE" && s.estado === "EN_COLA");
  const prioritarias = songs.filter(
    (s) => s.tipo === "PRIORITARIA" && s.estado === "EN_COLA"
  );
  const vips = songs.filter((s) => s.tipo === "VIP" && s.estado === "EN_COLA");

  return (
    <div className="flex h-full flex-col gap-4 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Canciones
          </h1>
          <p className="text-muted-foreground">
            Administra las solicitudes de canciones del DJ
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cola</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {libres.length + prioritarias.length + vips.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.libres} libres, {stats.prioritarias} prioritarias, {stats.vips} VIP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending.length}</div>
            <p className="text-xs text-muted-foreground">
              Requieren aprobación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Libres</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.libres}</div>
            <p className="text-xs text-muted-foreground">
              Solicitudes gratuitas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.prioritarias + stats.vips}
            </div>
            <p className="text-xs text-muted-foreground">
              S/{(stats.prioritarias * 5 + stats.vips * 8).toFixed(2)} recaudado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Now Playing */}
      {nowPlaying && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Ahora Sonando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NowPlaying song={nowPlaying} onUpdate={fetchSongs} />
          </CardContent>
        </Card>
      )}

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pendientes de Aprobación
              <Badge variant="destructive">{pending.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PendingApprovals songs={pending} onUpdate={fetchSongs} />
          </CardContent>
        </Card>
      )}

      {/* Queue Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="libres" className="gap-2">
            <Users className="h-4 w-4" />
            Libres ({libres.length})
          </TabsTrigger>
          <TabsTrigger value="prioritarias" className="gap-2">
            <Music className="h-4 w-4" />
            Prioritarias ({prioritarias.length})
          </TabsTrigger>
          <TabsTrigger value="vips" className="gap-2">
            <DollarSign className="h-4 w-4" />
            VIP ({vips.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="libres" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cola de Canciones Libres</CardTitle>
            </CardHeader>
            <CardContent>
              <SongQueue songs={libres} tipo="LIBRE" onUpdate={fetchSongs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prioritarias" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cola de Canciones Prioritarias</CardTitle>
            </CardHeader>
            <CardContent>
              <SongQueue
                songs={prioritarias}
                tipo="PRIORITARIA"
                onUpdate={fetchSongs}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vips" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cola de Canciones VIP</CardTitle>
            </CardHeader>
            <CardContent>
              <SongQueue songs={vips} tipo="VIP" onUpdate={fetchSongs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

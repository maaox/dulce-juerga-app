"use client";

import { useState, useEffect } from "react";
import { Song } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Music,
  User,
  Heart,
  Clock,
  TrendingUp,
  Crown,
  Zap,
} from "lucide-react";
import { useSongs } from "@/hooks/useSongs";

interface PublicQueueProps {
  libres: Song[];
  prioritarias: (Song & { user?: { name: string } | null })[];
  vips: (Song & { user?: { name: string } | null })[];
  siguientes: Song[];
}

export function PublicQueue({
  libres,
  prioritarias,
  vips,
  siguientes,
}: PublicQueueProps) {
  const { voteSong } = useSongs();
  const [deviceId, setDeviceId] = useState("");
  const [votedSongs, setVotedSongs] = useState<Set<string>>(new Set());

  // Generar o recuperar device ID
  useEffect(() => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("deviceId", id);
    }
    setDeviceId(id);

    // Recuperar canciones votadas
    const voted = localStorage.getItem("votedSongs");
    if (voted) {
      setVotedSongs(new Set(JSON.parse(voted)));
    }
  }, []);

  const handleVote = async (songId: string) => {
    if (votedSongs.has(songId)) {
      return;
    }

    const success = await voteSong(songId, deviceId);

    if (success) {
      const newVoted = new Set(votedSongs);
      newVoted.add(songId);
      setVotedSongs(newVoted);
      localStorage.setItem("votedSongs", JSON.stringify(Array.from(newVoted)));
    }
  };

  const hasVoted = (songId: string) => votedSongs.has(songId);

  return (
    <div className="space-y-6">
      {/* Próximas 3 */}
      {siguientes.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Próximas en Sonar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {siguientes.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Badge variant="outline">#{index + 1}</Badge>
                  <Music className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{song.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {song.artista}
                    </p>
                  </div>
                  <Badge
                    className={
                      song.tipo === "VIP"
                        ? "bg-orange-500"
                        : song.tipo === "PRIORITARIA"
                        ? "bg-purple-500"
                        : "bg-blue-500"
                    }
                  >
                    {song.tipo}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs por tipo */}
      <Tabs defaultValue="libres">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="libres" className="gap-2">
            <Music className="h-4 w-4" />
            Libres ({libres.length})
          </TabsTrigger>
          <TabsTrigger value="prioritarias" className="gap-2">
            <Zap className="h-4 w-4" />
            Prioritarias ({prioritarias.length})
          </TabsTrigger>
          <TabsTrigger value="vips" className="gap-2">
            <Crown className="h-4 w-4" />
            VIP ({vips.length})
          </TabsTrigger>
        </TabsList>

        {/* Libres */}
        <TabsContent value="libres" className="mt-4">
          {libres.length === 0 ? (
            <Card>
              <CardContent className="flex h-48 items-center justify-center text-muted-foreground">
                No hay canciones libres en cola
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {libres.map((song, index) => (
                <Card key={song.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div>
                              <p className="font-semibold">{song.titulo}</p>
                              <p className="text-sm text-muted-foreground">
                                {song.artista}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-blue-500 text-white">LIBRE</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{song.solicitanteNombre}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>~{(index + 1) * 3} min</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant={hasVoted(song.id) ? "secondary" : "default"}
                          onClick={() => handleVote(song.id)}
                          disabled={hasVoted(song.id)}
                          className="gap-2"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              hasVoted(song.id) ? "fill-current" : ""
                            }`}
                          />
                          {song.votos} {hasVoted(song.id) ? "Votado" : "Votar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Prioritarias */}
        <TabsContent value="prioritarias" className="mt-4">
          {prioritarias.length === 0 ? (
            <Card>
              <CardContent className="flex h-48 items-center justify-center text-muted-foreground">
                No hay canciones prioritarias en cola
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {prioritarias.map((song, index) => (
                <Card key={song.id} className="border-purple-500/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div>
                              <p className="font-semibold">{song.titulo}</p>
                              <p className="text-sm text-muted-foreground">
                                {song.artista}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-purple-500 text-white">
                          PRIORITARIA
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{song.user?.name || "Usuario"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>~{(index + 1) * 3} min</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* VIP */}
        <TabsContent value="vips" className="mt-4">
          {vips.length === 0 ? (
            <Card>
              <CardContent className="flex h-48 items-center justify-center text-muted-foreground">
                No hay canciones VIP en cola
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {vips.map((song, index) => (
                <Card key={song.id} className="border-orange-500/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div>
                              <p className="font-semibold">{song.titulo}</p>
                              <p className="text-sm text-muted-foreground">
                                {song.artista}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-orange-500 text-white">VIP</Badge>
                      </div>

                      <div className="rounded-lg bg-orange-500/10 p-3">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-orange-500" />
                          <p className="text-sm font-semibold text-orange-600">
                            De {song.dedicatoriaDe} para {song.dedicatoriaPara}
                          </p>
                        </div>
                        {song.dedicatoriaMensaje && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            &quot;{song.dedicatoriaMensaje}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>~{(index + 1) * 3} min</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

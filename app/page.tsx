"use client";

import {
  ChevronDown,
  Skull,
  Ghost,
  Candy,
  Wine,
  Gift,
  Clock,
  Users,
  MapPin,
  Sparkles,
  Trophy,
  Award,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Mejorado */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(/hero-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "scroll",
        }}
      >
        {/* Overlay oscuro con gradiente rojo */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/40 via-black/60 to-black/70" />

        {/* Efecto de sangre goteando desde arriba */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-950/50 to-transparent" />

        {/* Partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-pulse">
            <Ghost className="w-16 h-16 text-white/5" />
          </div>
          <div className="absolute top-40 right-20 animate-pulse delay-1000">
            <Skull className="w-12 h-12 text-red-900/20" />
          </div>
          <div className="absolute bottom-40 left-20 animate-pulse delay-500">
            <Candy className="w-10 h-10 text-orange-900/20" />
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Skull con efecto glow rojo */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 blur-3xl bg-red-600/30 animate-pulse" />
            <Skull className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 text-red-600 animate-pulse relative drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]" />
          </div>

          {/* Título con sombra roja terrorífica */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 md:mb-3 tracking-wider drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]"
            style={{ fontFamily: "'Creepster', cursive" }}
          >
            Dulce
          </h1>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-red-600 drop-shadow-[0_0_40px_rgba(220,38,38,0.8)]"
            style={{ fontFamily: "'Nosifer', cursive" }}
          >
            Juerga
          </h2>

          <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 text-gray-200">
            La fiesta de Halloween más terrorífica del año
          </p>

          {/* Badge de urgencia */}
          <div className="mb-6 md:mb-8 flex justify-center gap-2 md:gap-3 flex-wrap">
            <Badge className="bg-red-600/90 text-white px-3 py-1.5 text-xs md:text-sm font-bold border border-red-400 shadow-lg shadow-red-600/50">
              31 OCTUBRE 2025
            </Badge>
            <Badge className="bg-red-600/90 text-white px-3 py-1.5 text-xs md:text-sm font-bold border border-red-400 shadow-lg shadow-red-600/50">
              CUPOS LIMITADOS
            </Badge>
          </div>

          {/* CTA Principal con efecto hover mejorado */}
          <Button
            onClick={() => scrollToSection("entradas")}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-bold shadow-2xl shadow-red-600/50 hover:shadow-red-600/80 transition-all hover:scale-105 border-2 border-red-400"
          >
            Consigue tu Entrada
          </Button>
        </div>

        {/* Indicador de scroll mejorado */}
        <div
          className="absolute bottom-10 cursor-pointer animate-bounce"
          onClick={() => scrollToSection("about")}
        >
          <ChevronDown className="w-12 h-12 text-red-500/70 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
        </div>
      </div>

      {/* Sección Sobre Nosotros - Con Neuromarketing */}
      <section
        id="about"
        className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-black via-red-950/10 to-black relative overflow-hidden"
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,0,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(220,38,38,0.05),transparent_50%)]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              style={{ fontFamily: "'Nosifer', cursive" }}
            >
              No es una fiesta más
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-6 md:mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-200 text-lg leading-relaxed">
                <span className="text-red-500 font-bold text-2xl">
                  La noche que todos recordarán.
                </span>{" "}
                Experiencia premium, ambiente único y precios que te permitirán
                disfrutar la fiesta como se debe.
                <span className="text-red-400 font-semibold">
                  {" "}
                  Esta Halloween será diferente.
                </span>
              </p>

              <div className="bg-gradient-to-br from-red-950/40 to-black/60 p-6 rounded-lg border border-red-900/50 shadow-xl shadow-red-900/20">
                <p className="text-gray-300 text-base leading-relaxed italic">
                  &ldquo;Esta no es otra fiesta de Halloween. Es el evento del
                  año donde el terror se encuentra con la diversión, los premios
                  son reales y cada momento está diseñado para que
                  <span className="text-red-400 font-semibold">
                    {" "}
                    no quieras que termine
                  </span>
                  .&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <Badge className="bg-red-600/20 text-red-400 border border-red-600/50">
                  EXPERIENCIA ÚNICA
                </Badge>
                <Badge className="bg-red-600/20 text-red-400 border border-red-600/50">
                  PREMIOS REALES
                </Badge>
              </div>
            </div>

            {/* Info del Evento */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-900 shadow-2xl shadow-red-900/30">
                <CardContent className="p-8 pt-8">
                  <h3 className="text-2xl font-bold mb-6 text-red-500">
                    Información del Evento
                  </h3>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-600/20 p-3 rounded-lg">
                        <Clock className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Fecha y Hora
                        </div>
                        <div className="text-white font-bold text-lg">
                          31 de Octubre, 2025
                        </div>
                        <div className="text-red-400 font-semibold">
                          Desde las 9:30 PM
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-red-600/20 p-3 rounded-lg">
                        <Users className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Aforo Limitado
                        </div>
                        <div className="text-white font-bold text-lg">
                          Cupos limitados
                        </div>
                        <div className="text-red-400 font-semibold text-sm">
                          ¡Exclusivo e íntimo!
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-red-600/20 p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Ubicación</div>
                        <a
                          href="https://maps.app.goo.gl/Wb4SHBmzjCj1nekE7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-bold hover:text-red-400 transition-colors block"
                        >
                          Tinkuy Eventos
                        </a>
                        <div className="text-gray-500 text-sm">
                          Lotización Columbia, Cajamarca 06001
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-red-900/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        Cupos disponibles
                      </span>
                      <Badge className="bg-red-600 text-white font-bold animate-pulse">
                        SE AGOTAN RÁPIDO
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA adicional */}
              <div className="text-center">
                <p className="text-red-400 text-sm font-semibold mb-2">
                  ⚠️ No seas el que se queda fuera
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Tipos de Entrada - Rediseñado */}
      <section
        id="entradas"
        className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
      >
        {/* Efectos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              style={{ fontFamily: "'Nosifer', cursive" }}
            >
              Tipos de <span className="text-white">Entrada</span>
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-4 md:mb-6" />
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
              Elige cómo quieres vivir la noche más terrorífica del año
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* ENTRADA LIBRE */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 hover:border-gray-600 transition-all relative">
              <CardContent className="p-4 sm:p-6 md:p-8 pt-4 sm:pt-6 md:pt-8">
                <div className="text-center mb-4 md:mb-6">
                  <Badge className="mb-3 md:mb-4 bg-gray-700 text-white text-xs md:text-sm px-3 md:px-4 py-1">
                    ENTRADA BÁSICA
                  </Badge>
                  <Skull className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-400" />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    Entrada Libre
                  </h3>
                </div>

                <div className="text-center mb-4 md:mb-6 p-3 md:p-4 bg-green-950/30 border border-green-800/50 rounded-lg">
                  <div className="text-3xl md:text-4xl font-bold text-green-500 mb-1">
                    GRATIS
                  </div>
                  <div className="text-xs md:text-sm text-green-400 font-semibold">
                    hasta las 12:00 AM
                  </div>
                  <div className="text-xs text-gray-400 mt-2">Luego: S/20</div>
                </div>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-green-500 font-bold text-sm">✓</span>
                    <span className="text-gray-300 text-xs md:text-sm">
                      Acceso gratuito hasta medianoche
                    </span>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-green-500 font-bold text-sm">✓</span>
                    <span className="text-gray-300 text-xs md:text-sm">
                      Participación en todos los concursos
                    </span>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-yellow-500 font-bold text-sm">⚠</span>
                    <span className="text-gray-300 text-xs md:text-sm">
                      Sin reserva previa
                    </span>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-yellow-500 font-bold text-sm">⚠</span>
                    <span className="text-gray-300 text-xs md:text-sm">
                      Sujeto a disponibilidad de aforo
                    </span>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-red-500 font-bold text-sm">⚠</span>
                    <span className="text-gray-300 text-xs md:text-sm">
                      A partir de 12AM: <span className="font-bold">S/20</span>{" "}
                      sin beneficios
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-yellow-400 text-xs md:text-sm font-semibold">
                    Llega temprano o paga S/20 después
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* PAQUETE JUERGÓN - DESTACADO */}
            <Card className="bg-gradient-to-br from-red-950/80 to-red-900/40 border-2 md:border-4 border-red-600 hover:border-red-500 transition-all relative shadow-2xl shadow-red-600/50 md:hover:shadow-red-600/70 md:hover:scale-105">
              {/* Badge destacado superior */}
              <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs md:text-sm px-4 md:px-6 py-1.5 md:py-2 font-bold shadow-xl animate-pulse">
                  MEJOR OPCIÓN
                </Badge>
              </div>

              {/* Efecto glow interno */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-orange-600/20 pointer-events-none" />

              <CardContent className="p-4 sm:p-6 md:p-8 pt-8 sm:pt-10 md:pt-12 relative">
                <div className="text-center mb-4 md:mb-6">
                  <Badge className="mb-3 md:mb-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs md:text-sm px-3 md:px-4 py-1 shadow-lg">
                    PAQUETE VIP
                  </Badge>
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                    JUERGÓN
                  </h3>
                  <Badge className="bg-red-700 text-white text-xs px-3 py-1 animate-pulse">
                    Solo 90 cupos
                  </Badge>
                </div>

                {/* Precio con anclaje */}
                <div className="text-center mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-br from-red-900/60 to-orange-900/40 border-2 border-red-500 rounded-lg">
                  <div className="flex items-center justify-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <span className="text-xl md:text-2xl text-gray-400 line-through">
                      S/20
                    </span>
                    <Badge className="bg-orange-600 text-white font-bold text-xs">
                      AHORRA S/5
                    </Badge>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-1 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                    S/15
                  </div>
                  <div className="text-xs md:text-sm text-orange-400 font-semibold">
                    Valor real: S/20 | Pagas solo: S/15
                  </div>
                </div>

                {/* Beneficios destacados */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex items-start gap-2 md:gap-3 bg-black/30 p-2 rounded">
                    <span className="text-green-500 font-bold text-base md:text-lg">
                      ✓
                    </span>
                    <div>
                      <span className="text-white font-bold text-xs md:text-sm">
                        Entrada garantizada
                      </span>
                      <p className="text-gray-300 text-xs">
                        Sin riesgo de quedarte fuera
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3 bg-black/30 p-2 rounded">
                    <span className="text-green-500 font-bold text-base md:text-lg">
                      ✓
                    </span>
                    <div>
                      <span className="text-white font-bold text-xs md:text-sm">
                        S/10 en crédito de bebidas
                      </span>
                      <p className="text-gray-300 text-xs">
                        Úsalo como quieras
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3 bg-black/30 p-2 rounded">
                    <span className="text-green-500 font-bold text-base md:text-lg">
                      ✓
                    </span>
                    <div>
                      <span className="text-white font-bold text-xs md:text-sm">
                        Shot de bienvenida GRATIS
                      </span>
                      <p className="text-gray-300 text-xs">Regalo al entrar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3 bg-black/30 p-2 rounded">
                    <span className="text-green-500 font-bold text-base md:text-lg">
                      ✓
                    </span>
                    <div>
                      <span className="text-white font-bold text-xs md:text-sm">
                        Acceso desde 9:30 PM
                      </span>
                      <p className="text-gray-300 text-xs">
                        Empieza la fiesta temprano
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparación de valor */}
                <div className="bg-gradient-to-r from-green-950/40 to-emerald-950/40 border border-green-700/50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <p className="text-green-400 text-xs md:text-sm font-semibold text-center">
                    💰 Con ENTRADA LIBRE pagas S/20 después de 12AM sin nada
                    <br />
                    <span className="text-white">
                      Con JUERGÓN pagas S/15 y obtienes TODO
                    </span>
                  </p>
                </div>

                {/* CTA WhatsApp */}
                <a
                  href="https://wa.me/51957961418?text=Deseo%20obtener%20la%20entrada%20JUERGON%20para%20Dulce%20Juerga%2C%20por%20favor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 md:py-6 text-base md:text-lg font-bold shadow-2xl shadow-red-600/50 hover:shadow-red-600/80 transition-all hover:scale-105 border-2 border-orange-500">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Obtener Entrada JUERGÓN
                  </Button>
                </a>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Click para reservar por WhatsApp
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mensaje de urgencia adicional */}
          <div className="text-center mt-12">
            <div className="inline-block bg-gradient-to-r from-red-950/50 to-orange-950/50 border border-red-600 rounded-lg px-8 py-4">
              <p className="text-red-400 font-bold text-lg mb-1">
                ⚠️ Los paquetes JUERGÓN se agotan rápido
              </p>
              <p className="text-gray-300 text-sm">
                No te arriesgues a pagar S/20 sin beneficios. Asegura tu entrada
                por S/15.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Ofertas Especiales - Descuentos Progresivos */}
      <section
        id="ofertas"
        className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-black via-red-950/10 to-black relative overflow-hidden"
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              style={{ fontFamily: "'Nosifer', cursive" }}
            >
              Ofertas <span className="text-white">Especiales</span>
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-4 md:mb-6" />
            <p className="text-gray-300 text-sm md:text-base font-semibold">
              Descuentos en bebidas toda la noche
            </p>
          </div>

          {/* Descuentos Progresivos - Destacado */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-gradient-to-br from-red-950/60 to-orange-950/40 border-4 border-red-600 shadow-2xl shadow-red-600/30 relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-orange-600/10 pointer-events-none" />

              <CardContent className="p-10 pt-10 relative">
                <div className="text-center mb-8">
                  <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg px-6 py-2 mb-4 animate-pulse shadow-lg">
                    PARA TODOS LOS ASISTENTES
                  </Badge>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    Descuentos Progresivos
                  </h3>
                  <p className="text-gray-300">En todos los tragos</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Primera etapa */}
                  <div className="bg-gradient-to-br from-black/50 to-red-950/30 p-6 rounded-xl border-2 border-red-700 relative overflow-hidden group hover:border-red-500 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-10 h-10 text-red-500" />
                        <div>
                          <div className="text-2xl font-bold text-white">
                            Hasta las 11:00 PM
                          </div>
                          <div className="text-sm text-gray-400">Temprano</div>
                        </div>
                      </div>
                      <div className="text-center py-4 bg-red-900/30 rounded-lg border border-red-700">
                        <div className="text-5xl font-bold text-red-500 mb-1">
                          10%
                        </div>
                        <div className="text-gray-300 text-sm">
                          de descuento
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segunda etapa - Destacada */}
                  <div className="bg-gradient-to-br from-black/50 to-orange-950/30 p-6 rounded-xl border-2 border-orange-600 relative overflow-hidden group hover:border-orange-500 transition-all hover:scale-105">
                    <Badge className="absolute -top-[-10px] -right-[-6px] bg-orange-600 text-white animate-bounce">
                      MEJOR
                    </Badge>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl group-hover:bg-orange-600/20 transition-all" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-10 h-10 text-orange-500" />
                        <div>
                          <div className="text-2xl font-bold text-white">
                            Desde las 11:00 PM
                          </div>
                          <div className="text-sm text-gray-400">
                            Toda la noche
                          </div>
                        </div>
                      </div>
                      <div className="text-center py-4 bg-orange-900/30 rounded-lg border border-orange-600">
                        <div className="text-5xl font-bold text-orange-500 mb-1">
                          20%
                        </div>
                        <div className="text-gray-300 text-sm">
                          de descuento
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-300 text-sm">
                    ✨ Mientras más tarde llegues, más ahorras en bebidas ✨
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Beneficios Adicionales JUERGÓN */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                💰 Beneficios Adicionales{" "}
                <span className="text-orange-500">Paquete JUERGÓN</span>
              </h3>
              <p className="text-gray-400">
                Si compraste el paquete VIP también obtienes:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 hover:border-orange-600 transition-all group">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-600/20 p-3 rounded-lg group-hover:bg-orange-600/30 transition-all">
                      <Wine className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        S/10 en Crédito
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Úsalo en cualquier bebida, como quieras
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 hover:border-orange-600 transition-all group">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-600/20 p-3 rounded-lg group-hover:bg-orange-600/30 transition-all">
                      <Gift className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        Shot de Bienvenida
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Gratis apenas entras al evento
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 hover:border-orange-600 transition-all group">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-600/20 p-3 rounded-lg group-hover:bg-orange-600/30 transition-all">
                      <PartyPopper className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        Acceso Garantizado
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Sin filas, sin riesgo de quedarte fuera
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 hover:border-orange-600 transition-all group">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-600/20 p-3 rounded-lg group-hover:bg-orange-600/30 transition-all">
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        Desde 9:30 PM
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Disfruta desde el inicio de la fiesta
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block bg-gradient-to-r from-green-950/50 to-emerald-950/50 border border-green-700 rounded-lg px-8 py-4">
                <p className="text-green-400 font-semibold">
                  ✅ TODOS tienen descuentos, pero JUERGÓN tiene beneficios
                  EXTRA
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Premios - 4 Concursos Cronológicos */}
      <section
        id="premios"
        className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden"
      >
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(234,179,8,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(220,38,38,0.05),transparent_70%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]"
              style={{ fontFamily: "'Nosifer', cursive" }}
            >
              Concursos y Premios
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-4 md:mb-6" />
            <p className="text-gray-300 text-sm md:text-base font-semibold">
              Engagement, diversión y premios reales toda la noche
            </p>
          </div>

          {/* Timeline de concursos */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Concurso 1 - Primer Grupo */}
            <Card className="bg-gradient-to-br from-green-950/40 to-black border-2 border-green-700 hover:border-green-600 transition-all group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-emerald-600" />
              <CardContent className="p-8 pt-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600/20 p-4 rounded-xl border-2 border-green-600">
                      <Users className="w-12 h-12 text-green-500" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <Badge className="bg-green-600 text-white mb-3">
                      INICIO DEL EVENTO
                    </Badge>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      🎃 Primer Grupo en Llegar
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Incentiva la llegada temprana
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span className="text-green-400 font-semibold">
                        Apenas inicia el evento (9:30 PM)
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-green-950/60 to-black/40 p-4 rounded-lg border border-green-800">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <div>
                          <div className="text-yellow-400 font-bold text-lg">
                            Premio: JARRA GRATIS 🍺
                          </div>
                          <div className="text-gray-400 text-sm">
                            Para grupos de 5 a 7 personas
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concurso 2 - Disfraz Más Creativo */}
            <Card className="bg-gradient-to-br from-purple-950/40 to-black border-2 border-purple-700 hover:border-purple-600 transition-all group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
              <CardContent className="p-8 pt-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-600/20 p-4 rounded-xl border-2 border-purple-600">
                      <Ghost className="w-12 h-12 text-purple-500" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <Badge className="bg-purple-600 text-white mb-3">
                      DURANTE LA FIESTA
                    </Badge>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      👻 Disfraz Más Creativo/Original
                    </h3>
                    <p className="text-gray-400 mb-4">Individual o grupal</p>
                    <div className="flex items-center gap-4 mb-4">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span className="text-purple-400 font-semibold">
                        Se evalúa originalidad y creatividad
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-950/60 to-black/40 p-4 rounded-lg border border-purple-800">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <div>
                          <div className="text-yellow-400 font-bold text-lg">
                            Premio: BOTELLA GRATIS 🍾
                          </div>
                          <div className="text-gray-400 text-sm">
                            Para el disfraz más original
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concurso 3 - Mejor Grupo/Bailarín */}
            <Card className="bg-gradient-to-br from-orange-950/40 to-black border-2 border-orange-700 hover:border-orange-600 transition-all group relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-red-600" />
              <CardContent className="p-8 pt-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-orange-600/20 p-4 rounded-xl border-2 border-orange-600">
                      <PartyPopper className="w-12 h-12 text-orange-500" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <Badge className="bg-orange-600 text-white mb-3">
                      MITAD DE LA NOCHE
                    </Badge>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      💃 Mejor Grupo/Barra/Bailarín
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Competencia de baile grupal
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      <span className="text-orange-400 font-semibold">
                        Aumenta la participación y energía
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-orange-950/60 to-black/40 p-4 rounded-lg border border-orange-800">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <div>
                          <div className="text-yellow-400 font-bold text-lg">
                            Premio: JARRA DOBLE 🍺🍺
                          </div>
                          <div className="text-gray-400 text-sm">
                            Para el mejor grupo o bailarín
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concurso 4 - GRAN PREMIO FINAL */}
            <Card className="bg-gradient-to-br from-yellow-950/60 to-red-950/40 border-4 border-yellow-500 hover:border-yellow-400 transition-all group relative shadow-2xl shadow-yellow-600/30">
              {/* Badge destacado */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-sm md:text-lg px-4 md:px-8 py-2 font-bold shadow-2xl animate-pulse">
                  GRAN PREMIO FINAL
                </Badge>
              </div>

              {/* Efecto glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-transparent to-red-600/10" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />

              <CardContent className="p-10 pt-14">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 p-5 rounded-xl border-4 border-yellow-500 animate-pulse">
                      <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <Badge className="bg-red-600 text-white mb-3 text-sm">
                      3:30 AM - CIERRE DEL EVENTO
                    </Badge>
                    <h3 className="text-4xl font-bold text-yellow-400 mb-3 drop-shadow-lg">
                      🎁 Gran Premio Final
                    </h3>
                    <p className="text-gray-300 mb-4 text-lg">
                      Retiene a todos hasta el final • Votación acumulada de
                      toda la noche
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <Clock className="w-6 h-6 text-yellow-500" />
                      <span className="text-yellow-400 font-bold text-lg">
                        3:30 AM - ¡No te vayas antes!
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-900/80 to-red-900/60 p-6 rounded-xl border-4 border-yellow-500 shadow-xl">
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <Trophy className="w-12 h-12 text-yellow-400" />
                        <div className="text-center md:text-left">
                          <div className="text-yellow-300 font-bold text-3xl mb-1">
                            💵 S/400 EN EFECTIVO 💵
                          </div>
                          <div className="text-gray-300 text-sm">
                            Votación en vivo • Instagram, aplausos o sistema
                            digital
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center md:text-left">
                      <p className="text-gray-400 text-sm italic">
                        &ldquo;El premio más esperado de la noche. ¡Quédate
                        hasta el final para ser parte!&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de inversión */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 rounded-xl px-10 py-6">
              <p className="text-gray-400 text-sm mb-2">Total en premios</p>
              <p className="text-yellow-400 font-bold text-3xl">
                S/400 en efectivo + Jarras + Botella
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Premios reales, diversión garantizada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final antes del Footer */}
      <section className="py-12 md:py-16 lg:py-20 px-4 bg-gradient-to-b from-black via-red-950/20 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),transparent_70%)]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <Ghost className="w-20 h-20 mx-auto mb-6 text-red-600 animate-pulse drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" />
          </div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            style={{ fontFamily: "'Nosifer', cursive" }}
          >
            ¿Listo para la noche más{" "}
            <span className="text-red-600">terrorífica</span>?
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            No te quedes fuera. Los cupos se agotan rápido y esta noche será
            inolvidable.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-6 md:mb-8">
            <Badge className="bg-red-600/90 text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold border border-red-400 shadow-lg shadow-red-600/50">
              Solo 90 paquetes VIP
            </Badge>
            <Badge className="bg-red-600/90 text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold border border-red-400 shadow-lg shadow-red-600/50">
              Cupos limitados
            </Badge>
          </div>

          <a
            href="https://wa.me/51957961418?text=Deseo%20obtener%20la%20entrada%20JUERGON%20para%20Dulce%20Juerga%2C%20por%20favor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-8 text-lg md:text-4xl font-bold shadow-2xl shadow-red-600/50 hover:shadow-red-600/80 transition-all hover:scale-105 border-4 border-red-400">
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              ¡Asegura tu Entrada Ahora!
            </Button>
          </a>

          <p className="text-gray-500 text-sm mt-6">
            Última oportunidad • Reserva por WhatsApp en segundos
          </p>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-gradient-to-b from-black to-red-950/30 py-16 px-4 border-t border-red-900/50 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,0,0,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(220,38,38,0.1),transparent_50%)]" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="inline-block relative">
              <div className="absolute inset-0 blur-2xl bg-red-600/20 animate-pulse" />
              <Skull className="w-20 h-20 mx-auto text-red-600 relative drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" />
            </div>
          </div>

          {/* Título */}
          <h3
            className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            style={{ fontFamily: "'Creepster', cursive" }}
          >
            Dulce Juerga
          </h3>

          {/* Info del evento */}
          <div className="mb-8 space-y-2">
            <p className="text-gray-300 text-lg font-semibold">
              🎃 La Fiesta de Halloween Más Terrorífica del Año 🎃
            </p>
            <p className="text-red-400 text-xl font-bold">
              31 de Octubre, 2025 • 9:30 PM
            </p>
            <p className="text-gray-400">
              Aforo limitado • Solo 90 paquetes VIP
            </p>
          </div>

          {/* Divider */}
          <div className="w-64 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mb-8" />

          {/* Enlaces sociales o contacto */}
          <div className="mb-8">
            <a
              href="https://wa.me/51957961418"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="font-semibold">WhatsApp: 957961418</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">
              © 2025 Dulce Juerga. Todos los derechos reservados.
            </p>
            <p className="text-gray-600 text-xs">
              Evento para mayores de 18 años • Consumo responsable
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

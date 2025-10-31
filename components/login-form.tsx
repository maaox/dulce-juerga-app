"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { toast } from "sonner";

function LoginFormContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciales inválidas", {
          description: "Por favor verifica tu email y contraseña.",
        });
      } else {
        toast.success("¡Bienvenido!", {
          description: "Inicio de sesión exitoso.",
        });
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al iniciar sesión. Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">🎃 Halloween Party</h1>
                <p className="text-balance text-muted-foreground">
                  Sistema de Gestión de Eventos
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@halloween.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-semibold">Credenciales de prueba:</p>
                <p className="text-xs mt-1">Admin: admin@halloween.com / admin123</p>
                <p className="text-xs">Bartender: carlos@halloween.com / bartender123</p>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-gradient-to-br from-red-900 to-black md:flex md:items-center md:justify-center">
            <div className="text-center text-white p-8">
              <h2 className="text-3xl font-bold mb-4">🎃</h2>
              <h3 className="text-xl font-semibold mb-2">Halloween Party 2024</h3>
              <p className="text-sm opacity-90">
                Sistema completo de gestión de eventos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground">
        Acceso seguro con NextAuth.js
      </div>
    </div>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando...</div>}>
      <LoginFormContent className={className} {...props} />
    </Suspense>
  );
}

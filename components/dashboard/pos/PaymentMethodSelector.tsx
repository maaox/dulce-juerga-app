"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UseCartReturn } from "@/src/hooks/useCart";
import {
  Banknote,
  Smartphone,
  Building2,
  Watch,
  DollarSign,
} from "lucide-react";
import { EfectivoModal } from "./PaymentModals/EfectivoModal";
import { YapePlinModal } from "./PaymentModals/YapePlinModal";
import { TarjetaModal } from "./PaymentModals/TarjetaModal";
import { PulseraModal } from "./PaymentModals/PulseraModal";

interface PaymentMethodSelectorProps {
  cart: UseCartReturn;
  onPaymentComplete?: () => void;
}

type PaymentMethod = "EFECTIVO" | "YAPE" | "PLIN" | "TARJETA" | "PULSERA" | null;

export function PaymentMethodSelector({
  cart,
  onPaymentComplete,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleCloseModal = () => {
    setSelectedMethod(null);
  };

  const handlePaymentSuccess = () => {
    cart.clearCart();
    setSelectedMethod(null);
    onPaymentComplete?.();
  };

  const paymentMethods = [
    {
      id: "EFECTIVO" as const,
      label: "Efectivo",
      icon: Banknote,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "YAPE" as const,
      label: "Yape",
      icon: Smartphone,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "PLIN" as const,
      label: "Plin",
      icon: DollarSign,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "TARJETA" as const,
      label: "Transferencia",
      icon: Building2,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "PULSERA" as const,
      label: "Pulsera",
      icon: Watch,
      color: "bg-pink-500 hover:bg-pink-600",
    },
  ];

  const isCartEmpty = cart.items.length === 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  disabled={isCartEmpty}
                  className={`h-20 flex-col gap-2 ${method.color} text-white`}
                  variant="default"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-semibold">{method.label}</span>
                </Button>
              );
            })}
          </div>

          {isCartEmpty && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Agrega productos al carrito para continuar
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payment Modals */}
      <EfectivoModal
        open={selectedMethod === "EFECTIVO"}
        onOpenChange={(open) => !open && handleCloseModal()}
        cart={cart}
        onSuccess={handlePaymentSuccess}
      />

      <YapePlinModal
        open={selectedMethod === "YAPE" || selectedMethod === "PLIN"}
        onOpenChange={(open) => !open && handleCloseModal()}
        cart={cart}
        metodo={selectedMethod === "YAPE" ? "YAPE" : "PLIN"}
        onSuccess={handlePaymentSuccess}
      />

      <TarjetaModal
        open={selectedMethod === "TARJETA"}
        onOpenChange={(open) => !open && handleCloseModal()}
        cart={cart}
        onSuccess={handlePaymentSuccess}
      />

      <PulseraModal
        open={selectedMethod === "PULSERA"}
        onOpenChange={(open) => !open && handleCloseModal()}
        cart={cart}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}

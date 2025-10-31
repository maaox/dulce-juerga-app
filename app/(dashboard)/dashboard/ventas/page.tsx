"use client";

import { useState } from "react";
import { ProductSelector } from "@/components/dashboard/pos/ProductSelector";
import { SaleCart } from "@/components/dashboard/pos/SaleCart";
import { PaymentMethodSelector } from "@/components/dashboard/pos/PaymentMethodSelector";
import { useCart } from "@/src/hooks/useCart";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, History } from "lucide-react";
import { SalesHistory } from "@/components/dashboard/pos/SalesHistory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function VentasPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const cart = useCart();

  return (
    <div className="flex h-full flex-col gap-4 px-4 pb-20 md:px-6 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Punto de Venta</h1>
          <p className="text-muted-foreground">
            Gestiona las ventas de productos del evento
          </p>
        </div>
      </div>

      <Tabs defaultValue="pos" className="flex-1">
        <TabsList>
          <TabsTrigger value="pos" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Realizar Venta
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Product Selector - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <ProductSelector cart={cart} />
              </Card>
            </div>

            {/* Shopping Cart - Takes 1 column on large screens, hidden on mobile */}
            <div className="hidden lg:col-span-1 lg:block">
              <div className="sticky top-4 space-y-4">
                <Card>
                  <SaleCart cart={cart} />
                </Card>
                <PaymentMethodSelector
                  cart={cart}
                  onPaymentComplete={() => {
                    // Refresh products if needed
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Cart Button - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 lg:hidden">
            <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
              <SheetTrigger asChild>
                <Button className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ver Carrito
                  {cart.items.length > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {cart.items.length}
                    </Badge>
                  )}
                  {cart.total > 0 && (
                    <span className="ml-auto font-bold">
                      S/{cart.total.toFixed(2)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Carrito de Compras
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <Card>
                    <SaleCart cart={cart} />
                  </Card>
                  <PaymentMethodSelector
                    cart={cart}
                    onPaymentComplete={() => {
                      setCartSheetOpen(false);
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <SalesHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

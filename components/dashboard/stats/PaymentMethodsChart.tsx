"use client";

import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { CreditCard } from "lucide-react";

interface PaymentMethodsChartProps {
  data: {
    efectivo: number;
    yape: number;
    plin: number;
    tarjeta: number;
    pulsera: number;
  };
}

const COLORS = {
  efectivo: "hsl(var(--chart-1))",
  yape: "hsl(var(--chart-2))",
  plin: "hsl(var(--chart-3))",
  tarjeta: "hsl(var(--chart-4))",
  pulsera: "hsl(var(--chart-5))",
};

const chartConfig = {
  efectivo: { label: "Efectivo", color: COLORS.efectivo },
  yape: { label: "Yape", color: COLORS.yape },
  plin: { label: "Plin", color: COLORS.plin },
  tarjeta: { label: "Tarjeta", color: COLORS.tarjeta },
  pulsera: { label: "Pulsera", color: COLORS.pulsera },
};

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      fill: COLORS[name as keyof typeof COLORS],
    }));

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pago
          </h3>
          <p className="text-sm text-muted-foreground">
            Total: S/{total.toFixed(2)}
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos disponibles
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </Card>
  );
}

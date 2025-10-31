"use client";

import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface SalesChartProps {
  data: Array<{
    hora: string;
    cantidad: number;
    monto: number;
  }>;
}

const chartConfig = {
  monto: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
};

export function SalesChart({ data }: SalesChartProps) {
  const totalMonto = data.reduce((sum, item) => sum + item.monto, 0);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ventas por Hora</h3>
            <p className="text-sm text-muted-foreground">
              Total: S/{totalMonto.toFixed(2)}
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>

        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillMonto" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-monto)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-monto)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="hora"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="monto"
                stroke="var(--color-monto)"
                strokeWidth={2}
                fill="url(#fillMonto)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
}

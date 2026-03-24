// src/components/dashboard/EvolucaoFaturamentoChart.tsx
import { useMemo } from "react";
import { formatCurrency, formatExcelDate } from "@/lib/format";
import type { DadosBoletim } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  dados: DadosBoletim[];
}

export function EvolucaoFaturamentoChart({ dados }: Props) {
  // Transformar dados para o Recharts
  const chartData = useMemo(() => {
    return dados
      .filter(d => d.valorFatura > 0) // Consideramos apenas as linhas que já tem fatura para o gráfico de faturamento
      .map(d => ({
        // Usamos a data inicial do periodo como XAxis name
        periodo: formatExcelDate(d.periodoInicio),
        valorFatura: d.valorFatura,
      }));
  }, [dados]);

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col border-border/60 h-full w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Evolução de Faturamento</CardTitle>
          <CardDescription>Sem dados suficientes faturados.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Linha de tendência simplificada: calcular a média se as faturas fossem constantes (apenas visual)
  const mediaVal = chartData.reduce((acc, curr) => acc + curr.valorFatura, 0) / chartData.length;
  // Injeta campo media p/ renderizar a trend line estatica
  const dataWithTrend = chartData.map(d => ({ ...d, tendencia: mediaVal }));

  return (
    <Card className="flex flex-col border-border/60 h-[380px] w-full">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-base text-foreground">Evolução do Faturamento Faturado</CardTitle>
        <CardDescription>Valor da fatura por início de período medido</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataWithTrend} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="periodo"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={70}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg border shadow-sm p-3 text-sm">
                      <p className="font-semibold mb-1 pb-1 border-b border-border">Período Início: {label}</p>
                      <div className="flex flex-col gap-1 mt-2">
                        <span className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          <span className="text-muted-foreground">Fatura:</span>
                          <span className="font-medium">{formatCurrency(payload[0].value as number)}</span>
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Linha Principal (Faturamento) */}
            <Line
              type="monotone"
              dataKey="valorFatura"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
            />
            {/* Linha de Tendência (Média Pura) */}
            <Line
              type="monotone"
              dataKey="tendencia"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
              name="Média Faturada"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

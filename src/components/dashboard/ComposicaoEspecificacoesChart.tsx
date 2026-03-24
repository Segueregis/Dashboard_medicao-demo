// src/components/dashboard/ComposicaoEspecificacoesChart.tsx
import { useMemo } from "react";
import { formatCurrency } from "@/lib/format";
import type { DadosEspecificacao } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface Props {
  especificacoes: DadosEspecificacao[];
}

// Cores para as barras empilhadas (paleta predefinida)
const COLORS = [
  "hsl(var(--primary))",
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
  "#14b8a6", // teal-500
];

export function ComposicaoEspecificacoesChart({ especificacoes }: Props) {
  // Transforma os dados no formato: [{ mes: "Jul/2025", "Servico A": 100, "Servico B": 200 }, ...]
  const chartData = useMemo(() => {
    if (especificacoes.length === 0) return [];

    // Ignora a linha de totais se houver uma linha que contém "Valor total" sem especificação real
    // Mas conforme o excel, todas as linhas têm nome. Vamos pegar os meses da primeira.
    const meses = especificacoes[0].valoresPorMes.map(v => v.mes);
    
    // Ignorar a linha de "Valor total geral" pois distorce o empilhamento
    const specsToStack = especificacoes.filter(e => 
      !e.tipoServico.toLowerCase().includes("valor total da medição") &&
      !e.tipoServico.toLowerCase().includes("valor total geral")
    );

    return meses.map(mes => {
      const point: any = { mes };
      let hasData = false;
      specsToStack.forEach(spec => {
        const val = spec.valoresPorMes.find(v => v.mes === mes)?.valor || 0;
        point[spec.tipoServico] = val;
        if (val > 0) hasData = true;
      });
      point.hasData = hasData;
      return point;
    }).filter(p => p.hasData); // Opcional: esconder barras zeradas globalmente
  }, [especificacoes]);

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col border-border/60 h-full w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Composição por Especificação</CardTitle>
          <CardDescription>Sem dados disponíveis.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Obter as chaves (tipos de serviço) para gerar as barras
  const keys = Object.keys(chartData[0]).filter(k => k !== "mes" && k !== "hasData");

  return (
    <Card className="flex flex-col border-border/60 h-[380px] w-full">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-base text-foreground">Distribuição Mensal das Medições</CardTitle>
        <CardDescription>Composição do valor por tipo de serviço (ESPECIFICAÇÕES)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 pt-4 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              width={65}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted)/0.3)" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  // Calcular total do mês
                  const total = payload.reduce((acc, p) => acc + (p.value as number), 0);
                  
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg border shadow-sm p-3 text-sm max-w-[300px]">
                      <p className="font-semibold mb-2 pb-1 border-b border-border text-xs break-words">
                        {label}
                      </p>
                      <div className="flex flex-col gap-1.5 mt-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {payload.map((entry: any, index: number) => {
                          if (entry.value === 0) return null;
                          return (
                            <div key={`item-${index}`} className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5 line-clamp-2">
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-[10px] text-muted-foreground leading-tight">
                                  {entry.name}
                                </span>
                              </div>
                              <span className="font-medium text-xs pl-3.5">
                                {formatCurrency(entry.value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-2 border-t border-border flex justify-between items-center text-xs font-semibold">
                        <span>Total do Mês:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
               wrapperStyle={{ fontSize: "10px" }}
               iconType="circle"
               iconSize={8}
               formatter={(value) => <span className="text-muted-foreground truncate max-w-[150px] inline-block align-bottom">{value}</span>}
            />
            {keys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                radius={index === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

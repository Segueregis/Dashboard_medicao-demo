// src/components/dashboard/TopServicosDonut.tsx
import { useMemo } from "react";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { DadosEspecificacao } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface Props {
  especificacoes: DadosEspecificacao[];
}

const COLORS = [
  "hsl(var(--primary))",
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

export function TopServicosDonut({ especificacoes }: Props) {
  // Transforma os dados para ter o total de cada serviço isolado.
  // Ignoramos linhas que funcionam como totais ou subtotais agrupados no Boletim
  const chartData = useMemo(() => {
    // Filtramos nomes que não são serviços concretos
    const specsToUse = especificacoes.filter(e => 
      !e.tipoServico.toLowerCase().includes("valor total da medição") &&
      !e.tipoServico.toLowerCase().includes("valor total geral") &&
      e.total > 0
    );

    const totalEspec = specsToUse.reduce((acc, curr) => acc + curr.total, 0);

    return specsToUse.map((spec) => ({
      name: spec.tipoServico,
      value: spec.total,
      percentStr: formatPercent(spec.total / totalEspec)
    })).sort((a,b) => b.value - a.value); // Ordenar do maior pro menor
  }, [especificacoes]);

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col border-border/60 h-full w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Proporção por Serviço</CardTitle>
          <CardDescription>Sem dados disponíveis.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-border/60 h-[530px] w-full shadow-md">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-base text-foreground">Proporção das Especificações</CardTitle>
        <CardDescription>Resumo dos valores totais por tipo principal</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 pt-4 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, bottom: 20 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={145}
              paddingAngle={2}
              dataKey="value"
              stroke="transparent"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg border shadow-sm p-3 text-sm max-w-[280px]">
                      <div className="flex items-start gap-2 max-w-full overflow-hidden">
                        <div 
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0" 
                          style={{ backgroundColor: payload[0].payload.fill }}
                        />
                        <p className="font-semibold text-xs leading-tight whitespace-normal break-words">
                          {data.name}
                        </p>
                      </div>
                      <div className="mt-2 pl-5 flex justify-between gap-4 font-medium border-t border-border pt-2">
                        <span>Valor:</span>
                        <span>{formatCurrency(data.value)}</span>
                      </div>
                      <div className="pl-5 flex justify-between gap-4 text-xs text-muted-foreground mt-0.5">
                        <span>% do Total (Especificações):</span>
                        <span>{data.percentStr}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Custom Legend to handle extremely long names */}
            <Legend 
              verticalAlign="bottom" 
              height={90} 
              iconType="circle"
              iconSize={8}
              content={(props) => {
                const { payload } = props;
                if (!payload) return null;
                return (
                  <ul className="grid grid-cols-1 gap-1 text-[10px] text-muted-foreground mt-2 max-h-[80px] overflow-y-auto custom-scrollbar pr-2">
                    {payload.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-start gap-1.5">
                        <div className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="truncate" title={entry.value} style={{ maxWidth: '100%' }}>
                          {entry.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

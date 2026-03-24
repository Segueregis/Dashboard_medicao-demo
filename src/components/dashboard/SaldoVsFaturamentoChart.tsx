// src/components/dashboard/SaldoVsFaturamentoChart.tsx
import { useMemo } from "react";
import { formatCurrency, formatExcelDate } from "@/lib/format";
import type { DadosBoletim, ContratoInfo } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface Props {
  dados: DadosBoletim[];
  contrato: ContratoInfo;
}

export function SaldoVsFaturamentoChart({ dados }: Props) {
  // Transforma os dados. A lógica: Saldo pode vir do próprio boletim (saldoContrato) 
  // Ou calculado (Total - acumulado). Vamos usar o oficial do boletim quando disponível.
  const chartData = useMemo(() => {
    let acumulado = 0;
    
    return dados
      .filter(d => d.valorFatura > 0 || d.valorMedido > 0)
      .map(d => {
        acumulado += d.valorFatura;
        return {
          periodo: formatExcelDate(d.periodoInicio),
          faturamentoAcumulado: acumulado,
          // Se o saldoContrato do boletim for 0, decrescemos do valor total
          saldo: d.saldoContrato > 0 ? d.saldoContrato : (150000000 - acumulado),
        };
      });
  }, [dados]);

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col border-border/60 h-full w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Saldo Remanescente</CardTitle>
          <CardDescription>Sem dados suficientes faturados.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-border/60 h-[380px] w-full">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-base text-foreground">Saldo vs Faturamento Acumulado</CardTitle>
        <CardDescription>Consumo do contrato ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            {/* Gradientes para a área */}
            <defs>
              <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis
              dataKey="periodo"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickMargin={10}
            />
            {/* Custom Y Axis formater to show values inside constraints */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(0)}M`}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={50}
            />
            
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg border shadow-sm p-3 text-sm">
                      <p className="font-semibold mb-2 pb-1 border-b border-border">{label}</p>
                      
                      <div className="flex flex-col gap-2">
                        {payload.map((entry, idx) => (
                           <div key={idx} className="flex justify-between gap-4">
                             <div className="flex items-center gap-1.5">
                               <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}/>
                               <span className="text-muted-foreground">{entry.name}</span>
                             </div>
                             <span className="font-medium">{formatCurrency(entry.value as number)}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}/>
            
            <Area
              type="monotone"
              dataKey="saldo"
              name="Saldo Restante Oficial"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSaldo)"
            />
            <Area
              type="monotone"
              dataKey="faturamentoAcumulado"
              name="Total Faturado (Acumulado)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFaturamento)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

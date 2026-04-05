// src/components/dashboard/KpiCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { ContratoInfo, FaturamentoProcessado } from "@/lib/types";
import { Wallet, CheckCircle, Target, TrendingUp, CalendarDays } from "lucide-react";

interface Props {
  dados: FaturamentoProcessado;
  contrato: ContratoInfo;
}

export function KpiCards({ dados, contrato }: Props) {
  // 1. Total Contratos
  const totalContratos = contrato.valorBase;

  // 2. Total Faturado
  const totalFaturado = dados.boletim.reduce((acc, b) => acc + (b.valorFatura || 0), 0);

  // 3. Saldo Remanescente
  // Em vez de subtrair diretamente, podemos pegar do saldo oficial mais recente no boletim se preferir,
  // mas o prompt pediu (Total Contratos - Total Faturado)
  const saldoRemanescente = totalContratos - totalFaturado;

  // 4. % Executado
  const percentExecutado = totalContratos > 0 ? totalFaturado / totalContratos : 0;

  // 5. Última Medição
  // Ordenar boletim cronologicamente assumindo que os que estao no final do array sao os mais recentes,
  // ou simplesmente pegar o último com valor medido > 0
  const boletinsComMedicao = dados.boletim.filter(b => b.valorMedido > 0);
  const ultimaMedicao = boletinsComMedicao.length > 0
    ? boletinsComMedicao[boletinsComMedicao.length - 1].valorMedido
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Valor do Contrato
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(totalContratos)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Valor base acordado
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Faturado
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(totalFaturado)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Soma de todas as faturas
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo Remanescente
          </CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(saldoRemanescente)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Disponível para faturar
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            % Executado
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-foreground">
            {formatPercent(percentExecutado)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Do valor total
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/60">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Última Medição
          </CardTitle>
          <CalendarDays className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-foreground">
            {formatCurrency(ultimaMedicao)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Valor do último período
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

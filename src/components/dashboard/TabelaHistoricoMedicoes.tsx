// src/components/dashboard/TabelaHistoricoMedicoes.tsx
import { formatCurrency, formatExcelDate } from "@/lib/format";
import type { DadosBoletim } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  boletim: DadosBoletim[];
}

export function TabelaHistoricoMedicoes({ boletim }: Props) {
  if (boletim.length === 0) {
    return (
      <Card className="flex flex-col border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Histórico de Medições</CardTitle>
          <CardDescription>Sem dados disponíveis.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-border/60 w-full overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="text-base text-foreground">Boletim Mensal</CardTitle>
        <CardDescription>Histórico detalhado de faturamento e medições</CardDescription>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Período</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Envio Medição</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">Valor Medido</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Data Liberação</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Nº Pedido</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">Valor Fatura</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Nº Fatura</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">Saldo Contrato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {boletim.map((linha, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">
                    {formatExcelDate(linha.periodoInicio)} a {formatExcelDate(linha.periodoFim)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatExcelDate(linha.dataEnvio)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-foreground">
                    {formatCurrency(linha.valorMedido)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatExcelDate(linha.dataLiberacao)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {linha.numeroPedido || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-primary">
                    {formatCurrency(linha.valorFatura)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground font-medium">
                    {linha.numeroFatura || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(linha.saldoContrato)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

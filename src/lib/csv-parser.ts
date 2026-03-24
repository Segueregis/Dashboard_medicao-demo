import Papa from "papaparse";

// Interface base para os dados do CSV de faturamento
// Os campos serão refinados após receber a planilha Excel com as colunas definitivas
export interface FaturamentoRow {
  mes?: string;
  descricao?: string;
  valor?: string; // Raw string, será convertida para number na importação
}

// Mapeamento de colunas do CSV → campos internos
// Será atualizado após receber a planilha com os cabeçalhos reais
const COLUMN_MAP: Record<string, keyof FaturamentoRow> = {
  "mês": "mes",
  "mes": "mes",
  "month": "mes",
  "descrição": "descricao",
  "descricao": "descricao",
  "description": "descricao",
  "valor": "valor",
  "value": "valor",
  "amount": "valor",
};

export function parseCSV(file: File): Promise<FaturamentoRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      encoding: "UTF-8",
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: FaturamentoRow[] = [];

          for (const row of results.data as Record<string, string>[]) {
            const mapped: Partial<FaturamentoRow> = {};

            for (const [rawCol, value] of Object.entries(row)) {
              const col = rawCol.trim();
              if (!col || col.toLowerCase().startsWith("unnamed")) continue;

              const key = COLUMN_MAP[col.toLowerCase()];
              if (!key) continue;

              if (value && value.trim()) {
                (mapped as any)[key] = value.trim();
              }
            }

            // Adiciona somente linhas com ao menos um campo
            if (Object.keys(mapped).length > 0) {
              data.push(mapped as FaturamentoRow);
            }
          }

          resolve(data);
        } catch (e) {
          reject(e);
        }
      },
      error: (err) => reject(err),
    });
  });
}

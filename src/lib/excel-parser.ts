import * as XLSX from "xlsx";
import type { SheetData } from "@/contexts/ExcelContext";

export interface ParsedFile {
  sheets: Record<string, SheetData>;
  rawSheets: Record<string, any[][]>; // Abas em formato grid [linha][coluna] puro
}

/**
 * Lê um arquivo Excel ou CSV e retorna todas as abas como um objeto.
 * Cada aba é um array de objetos, com as propriedades = cabeçalhos da planilha.
 */
export function parseExcelFile(file: File): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: false }); // Não formatar datas em obj pois queremos raw

        const result: ParsedFile = { sheets: {}, rawSheets: {} };

        for (const sheetName of workbook.SheetNames) {
          const ws = workbook.Sheets[sheetName];
          
          // Formato JSON padrão (com chaves)
          const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
            raw: false,
            defval: "",
            blankrows: false,
          });

          // Formato Matriz 2D puro (usado pelo faturamento-parser)
          const rawRows = XLSX.utils.sheet_to_json<any[]>(ws, {
            header: 1, // Retorna array de arrays
            defval: ""
          });

          if (rows.length > 0) {
            result.sheets[sheetName] = rows;
            result.rawSheets[sheetName] = rawRows;
          }
        }

        if (Object.keys(result.sheets).length === 0) {
          reject(new Error("Nenhuma aba com dados encontrada no arquivo."));
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsArrayBuffer(file);
  });
}

/** Verifica se a extensão do arquivo é suportada */
export function isSupportedFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ["xlsx", "xls", "csv"].includes(ext ?? "");
}

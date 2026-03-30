import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react";
import { processarFaturamentoExcel } from "@/lib/faturamento-parser";
import type { FaturamentoProcessado } from "@/lib/types";
import { supabase } from "@/lib/supabase";

// Cada aba é um array de objetos (linhas), com chaves = cabeçalhos do Excel
export type SheetData = Record<string, unknown>[];

export interface ExcelState {
  // Todas as abas padrao: { "Aba 1": [...linhas], "Aba 2": [...linhas] }
  sheets: Record<string, SheetData>;
  rawSheets: Record<string, any[][]>;
  // Nome da aba atualmente selecionada
  activeSheet: string;
  // Nome do arquivo carregado
  fileName: string;
  // Dados processados específicos do faturamento (se houver as abas certas)
  faturamento: FaturamentoProcessado | null;
}

interface ExcelContextType extends ExcelState {
  setSheets: (sheets: Record<string, SheetData>, rawSheets: Record<string, any[][]>, fileName: string) => void;
  setActiveSheet: (name: string) => void;
  clearSheets: () => void;
  // Dados da aba ativa (atalho conveniente)
  activeData: SheetData;
  // Lista de nomes das abas
  sheetNames: string[];
}

const ExcelContext = createContext<ExcelContextType | null>(null);

export function ExcelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExcelState>({
    sheets: {},
    rawSheets: {},
    activeSheet: "",
    fileName: "",
    faturamento: null,
  });

  useEffect(() => {
    const loadFromDB = async () => {
      try {
        const { data, error } = await supabase.from('medicoes').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          setState(prev => ({
            ...prev,
            faturamento: {
              ...(prev.faturamento || { especificacoes: [], mesesEspecificacoes: [] }),
              boletim: data
            }
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
      }
    };
    
    // Solo carregar se não houver um boletim recém-processado
    if (!state.faturamento?.boletim?.length) {
      loadFromDB();
    }
  }, []);

  const setSheets = useCallback((sheets: Record<string, SheetData>, rawSheets: Record<string, any[][]>, fileName: string) => {
    const firstSheet = Object.keys(sheets)[0] ?? "";
    
    let faturamento = null;
    try {
      faturamento = processarFaturamentoExcel(rawSheets);
    } catch (e) {
      console.log("Arquivo carregado não tem o formato esperado de faturamento", e);
    }
    
    setState({ sheets, rawSheets, activeSheet: firstSheet, fileName, faturamento });
  }, []);

  const setActiveSheet = useCallback((name: string) => {
    setState(prev => ({ ...prev, activeSheet: name }));
  }, []);

  const clearSheets = useCallback(() => {
    setState({ sheets: {}, rawSheets: {}, activeSheet: "", fileName: "", faturamento: null });
  }, []);

  const sheetNames = Object.keys(state.sheets);
  const activeData = state.sheets[state.activeSheet] ?? [];

  return (
    <ExcelContext.Provider
      value={{ ...state, setSheets, setActiveSheet, clearSheets, activeData, sheetNames }}
    >
      {children}
    </ExcelContext.Provider>
  );
}

export function useExcel(): ExcelContextType {
  const ctx = useContext(ExcelContext);
  if (!ctx) throw new Error("useExcel deve ser usado dentro de <ExcelProvider>");
  return ctx;
}

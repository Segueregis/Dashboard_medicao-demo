import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { processarFaturamentoExcel } from "@/lib/faturamento-parser";
import type { FaturamentoProcessado } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchFaturamentoCompleto } from "@/services/dataService";
import { isDemoMode } from "@/config/demo-mode";

// Cada aba é um array de objetos (linhas), com chaves = cabeçalhos do Excel
export type SheetData = Record<string, unknown>[];

export interface ExcelState {
  sheets: Record<string, SheetData>;
  rawSheets: Record<string, any[][]>;
  activeSheet: string;
  fileName: string;
  faturamento: FaturamentoProcessado | null;
}

interface ExcelContextType extends ExcelState {
  setSheets: (sheets: Record<string, SheetData>, rawSheets: Record<string, any[][]>, fileName: string) => void;
  setActiveSheet: (name: string) => void;
  clearSheets: () => void;
  activeData: SheetData;
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
    const loadData = async () => {
      try {
        const faturamentoData = await fetchFaturamentoCompleto();
        
        if (faturamentoData && faturamentoData.boletim.length > 0) {
          setState(prev => ({
            ...prev,
            faturamento: faturamentoData
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    
    // Carregar se (Supabase configurado OU Modo Demo ativo) E se não houver um boletim recém-processado
    const shouldLoad = (isSupabaseConfigured || isDemoMode) && !state.faturamento?.boletim?.length;
    
    if (shouldLoad) {
      loadData();
    }
  }, [state.faturamento?.boletim?.length]);

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
    <ExcelContext.Provider value={{ ...state, setSheets, setActiveSheet, clearSheets, activeData, sheetNames }}>
      {children}
    </ExcelContext.Provider>
  );
}

export function useExcel(): ExcelContextType {
  const ctx = useContext(ExcelContext);
  if (!ctx) throw new Error("useExcel deve ser usado dentro de <ExcelProvider>");
  return ctx;
}

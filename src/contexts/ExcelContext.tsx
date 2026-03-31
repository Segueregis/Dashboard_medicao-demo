import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react";
import { processarFaturamentoExcel } from "@/lib/faturamento-parser";
import type { FaturamentoProcessado } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
        const [medicoesRes, mesesRes, valoresRes] = await Promise.all([
          supabase.from('medicoes').select('*'),
          supabase.from('especificacoes_meses').select('*').order('ordem', { ascending: true }),
          supabase.from('especificacoes_valores').select('*')
        ]);

        if (medicoesRes.error) throw medicoesRes.error;
        if (mesesRes.error) throw mesesRes.error;
        if (valoresRes.error) throw valoresRes.error;
        
        if (medicoesRes.data && medicoesRes.data.length > 0) {
          const meses = mesesRes.data?.map(m => m.mes_nome) || [];
          const valoresRaw = valoresRes.data || [];
          
          // Reconstruir array de especificações agrupando por tipoServico
          const specsMap = new Map<string, any>();
          
          valoresRaw.forEach(v => {
            if (!specsMap.has(v.tipo_servico)) {
              specsMap.set(v.tipo_servico, {
                tipoServico: v.tipo_servico,
                valoresPorMes: [],
                total: 0
              });
            }
            const spec = specsMap.get(v.tipo_servico)!;
            spec.valoresPorMes.push({ mes: v.mes_nome, valor: v.valor });
            spec.total += v.valor;
          });

          setState(prev => ({
            ...prev,
            faturamento: {
              boletim: medicoesRes.data,
              especificacoes: Array.from(specsMap.values()),
              mesesEspecificacoes: meses
            }
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
      }
    };
    
    // Solo carregar se não houver um boletim recém-processado e se o Supabase estiver configurado
    if (isSupabaseConfigured && !state.faturamento?.boletim?.length) {
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

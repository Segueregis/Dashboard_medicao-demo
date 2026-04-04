import { supabase } from "@/lib/supabase";
import { isDemoMode, demoData } from "@/config/demo-mode";
import { FaturamentoProcessado, DadosBoletim, DadosEspecificacao, CONTRATOS_DISPONIVEIS } from "@/lib/types";

/**
 * Serviço centralizado para busca de dados, tratando a alternância entre
 * o modo de demonstração e a conexão real com o Supabase.
 */

export const getMedicoes = async (): Promise<DadosBoletim[]> => {
  if (isDemoMode) {
    return demoData.boletim;
  }

  const { data, error } = await supabase
    .from('medicoes')
    .select('*')
    .order('periodoInicio', { ascending: true });

  if (error) {
    console.error("Erro ao buscar medições:", error);
    return [];
  }

  return data || [];
};

export const getEspecificacoes = async (): Promise<{ 
  especificacoes: DadosEspecificacao[], 
  meses: string[] 
}> => {
  if (isDemoMode) {
    return {
      especificacoes: demoData.especificacoes,
      meses: demoData.mesesEspecificacoes
    };
  }

  try {
    const [mesesRes, valoresRes] = await Promise.all([
      supabase.from('especificacoes_meses').select('*').order('ordem', { ascending: true }),
      supabase.from('especificacoes_valores').select('*')
    ]);

    if (mesesRes.error) throw mesesRes.error;
    if (valoresRes.error) throw valoresRes.error;

    const meses = mesesRes.data?.map(m => m.mes_nome) || [];
    const valoresRaw = valoresRes.data || [];
    
    const specsMap = new Map<string, DadosEspecificacao>();
    
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

    return {
      especificacoes: Array.from(specsMap.values()),
      meses
    };
  } catch (err) {
    console.error("Erro ao buscar especificações:", err);
    return { especificacoes: [], meses: [] };
  }
};

export const getTotalFaturado = async (): Promise<number> => {
  const medicoes = await getMedicoes();
  return medicoes.reduce((acc, m) => acc + (m.valorFatura || 0), 0);
};

export const getSaldoContrato = async (): Promise<number> => {
  const medicoes = await getMedicoes();
  if (medicoes.length === 0) return 0;
  // Retorna o saldo da medição mais recente
  return medicoes[medicoes.length - 1].saldoContrato || 0;
};

export const getContratos = () => {
  return CONTRATOS_DISPONIVEIS;
};

/**
 * Função utilitária para carregar todo o estado inicial do faturamento
 */
export const fetchFaturamentoCompleto = async (): Promise<FaturamentoProcessado> => {
  const [boletim, specsData] = await Promise.all([
    getMedicoes(),
    getEspecificacoes()
  ]);

  return {
    boletim,
    especificacoes: specsData.especificacoes,
    mesesEspecificacoes: specsData.meses
  };
};

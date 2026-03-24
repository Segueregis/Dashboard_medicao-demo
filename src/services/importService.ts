import { supabase } from '../lib/supabase';

// Estrutura dos dados importados do CSV/Excel.
// Será atualizada após receber a planilha com as colunas definitivas.
export interface FaturamentoData {
  mes: string;
  descricao?: string;
  valor?: number;
}

/**
 * Insere/atualiza registros na tabela public.faturamento.
 * @param data Array de objetos com os dados de faturamento
 */
export async function importFaturamento(data: FaturamentoData[]) {
  try {
    const { data: result, error } = await supabase
      .from('faturamento')
      .upsert(data, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Erro ao importar dados de faturamento:', error);
      return { success: false, error };
    }

    return { success: true, count: data.length, data: result };
  } catch (err) {
    console.error('Erro inesperado durante importação:', err);
    return { success: false, error: err };
  }
}

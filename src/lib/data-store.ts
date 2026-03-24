import { supabase } from './supabase';
import { importFaturamento } from '@/services/importService';
import type { RegistroFaturamento } from './types';

const PAGE_SIZE = 1000;

function mapRow(item: Record<string, unknown>): RegistroFaturamento {
  return {
    id: (item.id as string) ?? undefined,
    mes: (item.mes as string) ?? '',
    descricao: (item.descricao as string) ?? '',
    valor: Number(item.valor) || 0,
  };
}

export async function loadData(): Promise<RegistroFaturamento[]> {
  try {
    const allRows: RegistroFaturamento[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('faturamento')
        .select('*')
        .order('id', { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      allRows.push(...data.map(mapRow));
      offset += data.length;
      if (data.length < PAGE_SIZE) hasMore = false;
    }

    return allRows;
  } catch (error) {
    console.error('Falha ao carregar dados do Supabase', error);
    return [];
  }
}

export async function clearData(): Promise<void> {
  try {
    const { error } = await supabase
      .from('faturamento')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  } catch (error) {
    console.error('Falha ao limpar dados do Supabase', error);
  }
}

export async function saveData(data: RegistroFaturamento[]): Promise<void> {
  try {
    const mappedData = data.map(item => ({
      mes: item.mes,
      descricao: item.descricao,
      valor: item.valor,
    }));
    await importFaturamento(mappedData);
  } catch (error) {
    console.error('Falha ao salvar dados no Supabase', error);
  }
}

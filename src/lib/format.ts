export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Converte serial do Excel (número) para data BR
export function formatExcelDate(serial: number | string | undefined | null): string {
  if (!serial) return "-";
  
  if (typeof serial === 'number') {
    // 25569 = dias entre 1/1/1900 e 1/1/1970
    const unixTimestamp = (serial - 25569) * 86400 * 1000;
    // O Excel trata 1900 como bissexto (bug histórico), precisamos ajustar 1 dia para datas após fev 1900
    // Como estamos no seculo 21, sempre ajustamos
    const data = new Date(unixTimestamp + (24 * 60 * 60 * 1000) * 0); // Ajuste de fuso pode ser necessário
    // Uma forma mais segura para evitar problemas de timezone com dias exatos:
    const utcDate = new Date(Math.round((serial - 25569) * 86400 * 1000));
    return new Intl.DateTimeFormat('pt-BR', {timeZone: 'UTC'}).format(utcDate);
  }
  
  // Se já for string "DD/MM/YYYY", retorna como está
  return String(serial);
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "0%";
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}

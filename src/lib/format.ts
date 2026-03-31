export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Converte serial do Excel (número ou string numérica) para data BR
export function formatExcelDate(serial: number | string | undefined | null): string {
  if (!serial && serial !== 0) return "-";

  // Se for string que representa um número (ex: "45859" vindo do banco), converte para number
  const asNumber = typeof serial === 'number' ? serial : Number(serial);

  if (!isNaN(asNumber) && asNumber > 1000) {
    // 25569 = dias entre 1/1/1900 e 1/1/1970 (origem Unix)
    const utcDate = new Date(Math.round((asNumber - 25569) * 86400 * 1000));
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(utcDate);
  }

  // Se já for string de data legível, retorna como está
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

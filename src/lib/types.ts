// Tipos específicos para o Dashboard de Faturamento Baseado no Excel

export interface DadosBoletim {
  periodoInicio: number | string; // Serial Excel
  periodoFim: number | string;
  dataEnvio: number | string;
  valorMedido: number;
  dataLiberacao: number | string;
  numeroPedido: string;
  numeroFatura: number | string;
  valorFatura: number;
  saldoContrato: number;
}

export interface SpecData {
  mes: string;
  valor: number;
}

export interface DadosEspecificacao {
  tipoServico: string;
  valoresPorMes: SpecData[];
  total: number;
}

export interface FaturamentoProcessado {
  boletim: DadosBoletim[];
  especificacoes: DadosEspecificacao[];
  mesesEspecificacoes: string[]; // Cabeçalhos dos meses encontrados na aba ESPECIFICAÇÕES
}

export interface ContratoInfo {
  id: string;
  nome: string;
  valorBase: number;
}

export const CONTRATOS_DISPONIVEIS: ContratoInfo[] = [
  {
    id: "SPO_00023_25",
    nome: "Contrato SPO 00023/25",
    valorBase: 150000000, // R$ 150M assumidos no prompt ou da planilha
  },
  {
    id: "4600172787",
    nome: "Contrato 4600172787",
    valorBase: 1572480, // R$ 1.57M assumidos do prompt
  }
];

// O estado que armazena os dados processados globalmente
export interface FaturamentoState {
  dados: FaturamentoProcessado | null;
  contratoAtivo: string;
}

import { FaturamentoProcessado } from "@/lib/types";

// Lê a variável de ambiente VITE_DEMO_MODE (deve ser 'true' ou '1')
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || import.meta.env.VITE_DEMO_MODE === '1';

// Dados fictícios mas realistas (Total faturado ~ R$ 15-20 milhões)
export const demoData: FaturamentoProcessado = {
  boletim: [
    {
      periodoInicio: "Jan/24",
      periodoFim: "Jan/24",
      dataEnvio: "2024-01-15",
      valorMedido: 1250000.50,
      dataLiberacao: "2024-01-20",
      numeroPedido: "4600001",
      numeroFatura: "FAT-001",
      valorFatura: 1250000.50,
      saldoContrato: 148749999.50
    },
    {
      periodoInicio: "Fev/24",
      periodoFim: "Fev/24",
      dataEnvio: "2024-02-15",
      valorMedido: 1350400.75,
      dataLiberacao: "2024-02-22",
      numeroPedido: "4600002",
      numeroFatura: "FAT-002",
      valorFatura: 1350400.75,
      saldoContrato: 147399598.75
    },
    {
      periodoInicio: "Mar/24",
      periodoFim: "Mar/24",
      dataEnvio: "2024-03-15",
      valorMedido: 1450200.00,
      dataLiberacao: "2024-03-25",
      numeroPedido: "4600003",
      numeroFatura: "FAT-003",
      valorFatura: 1450200.00,
      saldoContrato: 145949398.75
    },
    {
      periodoInicio: "Abr/24",
      periodoFim: "Abr/24",
      dataEnvio: "2024-04-15",
      valorMedido: 1550800.25,
      dataLiberacao: "2024-04-30",
      numeroPedido: "4600004",
      numeroFatura: "FAT-004",
      valorFatura: 1550800.25,
      saldoContrato: 144398598.50
    },
    {
      periodoInicio: "Mai/24",
      periodoFim: "Mai/24",
      dataEnvio: "2024-05-15",
      valorMedido: 1650300.50,
      dataLiberacao: "2024-05-25",
      numeroPedido: "4600005",
      numeroFatura: "FAT-005",
      valorFatura: 1650300.50,
      saldoContrato: 142748298.00
    },
    {
      periodoInicio: "Jun/24",
      periodoFim: "Jun/24",
      dataEnvio: "2024-06-15",
      valorMedido: 1750100.00,
      dataLiberacao: "2024-06-30",
      numeroPedido: "4600006",
      numeroFatura: "FAT-006",
      valorFatura: 1750100.00,
      saldoContrato: 140998198.00
    }
  ],
  especificacoes: [
    {
      tipoServico: "Manutenção Preventiva",
      valoresPorMes: [
        { mes: "Jan/24", valor: 450000 },
        { mes: "Fev/24", valor: 460000 },
        { mes: "Mar/24", valor: 470000 },
        { mes: "Abr/24", valor: 480000 },
        { mes: "Mai/24", valor: 490000 },
        { mes: "Jun/24", valor: 500000 }
      ],
      total: 2850000
    },
    {
      tipoServico: "Manutenção Corretiva",
      valoresPorMes: [
        { mes: "Jan/24", valor: 550000 },
        { mes: "Fev/24", valor: 600000 },
        { mes: "Mar/24", valor: 650000 },
        { mes: "Abr/24", valor: 700000 },
        { mes: "Mai/24", valor: 750000 },
        { mes: "Jun/24", valor: 800000 }
      ],
      total: 4050000
    },
    {
      tipoServico: "Atendimento Emergencial",
      valoresPorMes: [
        { mes: "Jan/24", valor: 250000 },
        { mes: "Fev/24", valor: 290000 },
        { mes: "Mar/24", valor: 330000 },
        { mes: "Abr/24", valor: 370000 },
        { mes: "Mai/24", valor: 410000 },
        { mes: "Jun/24", valor: 450000 }
      ],
      total: 2100000
    }
  ],
  mesesEspecificacoes: ["Jan/24", "Fev/24", "Mar/24", "Abr/24", "Mai/24", "Jun/24"]
};

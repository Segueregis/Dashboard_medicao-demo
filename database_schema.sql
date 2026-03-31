-- Schema base para acompanhamento de faturamento
-- Drop da tabela antiga de faturamento (se existir)
DROP TABLE IF EXISTS public.faturamento;

-- Drop da tabela nova (se precisar resetar)
DROP TABLE IF EXISTS public.medicoes;

-- Criação da tabela medicoes (Boletim Mensal)
CREATE TABLE public.medicoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "periodoInicio" TEXT,
    "periodoFim" TEXT,
    "dataEnvio" TEXT,
    "valorMedido" NUMERIC,
    "dataLiberacao" TEXT,
    "numeroPedido" TEXT,
    "numeroFatura" TEXT,
    "valorFatura" NUMERIC,
    "saldoContrato" NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ativar segurança em nível de linha (RLS)
ALTER TABLE public.medicoes ENABLE ROW LEVEL SECURITY;

-- Política: Apenas o ADMIN pode INSERIR / DELETAR
CREATE POLICY "Admin pode inserir" ON public.medicoes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin pode deletar" ON public.medicoes FOR DELETE TO authenticated USING (true);

-- Política: Qualquer usuário pode LER os dados
CREATE POLICY "Leitura pública" ON public.medicoes FOR SELECT TO anon, authenticated USING (true);

-- Drop tabelas de especificações (se precisar resetar)
DROP TABLE IF EXISTS public.especificacoes_meses;
DROP TABLE IF EXISTS public.especificacoes_valores;

-- Tabela para os nomes e ordem dos meses das especificações
CREATE TABLE public.especificacoes_meses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mes_nome TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para os valores detalhados de cada serviço por mês
CREATE TABLE public.especificacoes_valores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_servico TEXT NOT NULL,
    mes_nome TEXT NOT NULL,
    valor NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ativar RLS para especificacoes
ALTER TABLE public.especificacoes_meses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.especificacoes_valores ENABLE ROW LEVEL SECURITY;

-- Políticas para especificacoes_meses
CREATE POLICY "Admin pode inserir meses" ON public.especificacoes_meses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin pode deletar meses" ON public.especificacoes_meses FOR DELETE TO authenticated USING (true);
CREATE POLICY "Leitura pública meses" ON public.especificacoes_meses FOR SELECT TO anon, authenticated USING (true);

-- Políticas para especificacoes_valores
CREATE POLICY "Admin pode inserir valores" ON public.especificacoes_valores FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin pode deletar valores" ON public.especificacoes_valores FOR DELETE TO authenticated USING (true);
CREATE POLICY "Leitura pública valores" ON public.especificacoes_valores FOR SELECT TO anon, authenticated USING (true);

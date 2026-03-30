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

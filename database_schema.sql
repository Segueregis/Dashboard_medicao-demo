-- Schema base para acompanhamento de faturamento
-- Os campos serão refinados após receber a planilha Excel com as colunas definitivas

-- Drop da tabela antiga de ordens de serviço (se existir)
DROP TABLE IF EXISTS public.ordens_servico;

-- Drop da tabela de faturamento (se existir)
DROP TABLE IF EXISTS public.faturamento;

-- Criação da tabela de faturamento
CREATE TABLE public.faturamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mes TEXT NOT NULL,           -- ex: "Janeiro/2025"
    descricao TEXT,              -- descrição do lançamento
    valor NUMERIC(15, 2),        -- valor faturado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Nota: Campos adicionais serão definidos após análise da planilha Excel.
-- Exemplo de campos futuros: contrato, unidade, tipo_faturamento, etc.

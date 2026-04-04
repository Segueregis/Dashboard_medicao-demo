# 📊 Dashboard de Análise de Contratos - Demo

(https://dashboard-medicao-demo.vercel.app)

## 🎯 Bem-vindo ao meu projeto!

Este é um **Dashboard de Análise de Dados de Contratos** desenvolvido para gestão e monitoramento de medições contratuais. O sistema permite visualizar métricas importantes, evolução de faturamento e distribuição de custos por tipo de serviço.

> ⚠️ **Versão de Demonstração**  
> Esta é uma versão pública com **dados fictícios** para demonstração. O código original é privado e contém dados reais.

---

## ✨ Funcionalidades

- 📈 **Dashboard interativo** com gráficos dinâmicos
- 📊 **Evolução do faturamento** ao longo do tempo
- 🥧 **Distribuição por tipo de serviço** (Preventivas, Corretivas, Emergenciais, Obras)
- 💰 **KPIs em tempo real** (Total faturado, Saldo do contrato, % executado)
- 📂 **Upload de planilhas Excel** para visualização temporária
- 🔒 **Modo Demo seguro** (dados fictícios, sem persistência)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| **React 18** | Biblioteca para construção da UI |
| **TypeScript** | Tipagem estática e maior segurança |
| **Vite** | Build tool rápida e moderna |
| **Tailwind CSS** | Estilização utilitária |
| **shadcn/ui** | Componentes acessíveis e customizáveis |
| **Recharts** | Biblioteca de gráficos |
| **Supabase** | Backend e autenticação (bloqueado na demo) |
| **Vercel** | Hospedagem e deploy |

---

## 🚀 Como executar localmente

```bash
# Clone o repositório
git clone https://github.com/Seguealex/Dashboard-medicao-demostra-o.git

# Entre na pasta
cd Dashboard-medicao-demostra-o

# Instale as dependências
npm install

# Execute em modo demo
npm run dev:demo
A aplicação estará disponível em http://localhost:5173

📁 Estrutura do Projeto

text
src/
├── components/       # Componentes reutilizáveis
│   └── dashboard/    # Componentes do dashboard
├── contexts/         # Contextos React (ExcelContext)
├── config/           # Configurações (modo demo)
├── lib/              # Utilitários e cliente Supabase
├── pages/            # Páginas (Admin, Dashboard)
├── services/         # Serviços de dados
├── types/            # Definições TypeScript
└── hooks/            # Hooks customizados

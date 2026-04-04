// src/pages/Admin.tsx — Admin com upload Excel multi-abas
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Trash2, LogOut, AlertTriangle, AlertCircle } from "lucide-react";
import { ExcelUpload } from "@/components/ExcelUpload";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useExcel } from "@/contexts/ExcelContext";
import { isDemoMode } from "@/config/demo-mode";

const Admin = () => {
  const navigate = useNavigate();
  const { sheetNames, sheets, clearSheets } = useExcel();

  const totalRows = sheetNames.reduce((acc, s) => acc + (sheets[s]?.length ?? 0), 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const handleClearData = async () => {
    if (isDemoMode) {
      alert("⚠️ Ação bloqueada no Modo Demo: Você não pode apagar os dados do banco real nesta versão.");
      return;
    }
    
    if (!window.confirm("Tem certeza que deseja apagar todos os dados do sistema e do banco?")) return;
    
    try {
      // Apagar Medições
      await supabase.from('medicoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Apagar Especificações
      await supabase.from('especificacoes_meses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('especificacoes_valores').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      clearSheets();
      alert("Dados apagados com sucesso.");
    } catch (err: any) {
      alert("Erro ao apagar dados do banco: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner de Modo Demo */}
      {isDemoMode && (
        <div className="bg-amber-500 py-3 px-6 flex items-center justify-center gap-3 text-black font-bold">
          <AlertTriangle className="h-5 w-5" />
          <span>Você está no AMBIENTE DE DEMONSTRAÇÃO. As alterações aqui não afetam o banco de dados real.</span>
        </div>
      )}

      <header className="dashboard-header px-6 py-4 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Administração</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-8 border-border text-xs"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            Importar Dados de Faturamento
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Faça upload de uma planilha Excel (<strong>.xlsx</strong> ou <strong>.xls</strong>) ou{" "}
            <strong>.csv</strong>. Todas as abas da planilha serão carregadas automaticamente.
          </p>

          {isDemoMode && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p className="text-xs font-medium">
                MODO DEMO: O upload permitirá apenas a visualização temporária no gráfico. 
                Os dados serão descartados ao recarregar a página.
              </p>
            </div>
          )}

          <ExcelUpload />
        </div>

        {/* Resumo das abas carregadas */}
        {sheetNames.length > 0 && (
          <div className="kpi-card bg-muted/20 border border-border/40 p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dados carregados no Dashboard</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalRows.toLocaleString("pt-BR")} linhas
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sheetNames.length} aba(s): {sheetNames.join(", ")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearData}
                disabled={isDemoMode}
                className={`text-destructive hover:text-destructive hover:bg-destructive/10 ${isDemoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Limpar banco
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

// src/pages/Admin.tsx — Admin com upload Excel multi-abas
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Trash2, LogOut } from "lucide-react";
import { ExcelUpload } from "@/components/ExcelUpload";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useExcel } from "@/contexts/ExcelContext";

const Admin = () => {
  const navigate = useNavigate();
  const { sheetNames, sheets, clearSheets } = useExcel();

  const totalRows = sheetNames.reduce((acc, s) => acc + (sheets[s]?.length ?? 0), 0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const handleClearData = async () => {
    if (!window.confirm("Tem certeza que deseja apagar todos os dados do sistema e do banco?")) return;
    try {
      const { error } = await supabase
        .from('medicoes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      clearSheets();
      alert("Dados apagados com sucesso.");
    } catch (err: any) {
      alert("Erro ao apagar dados do banco: " + err.message);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="dashboard-header px-6 py-4 flex items-center justify-between">
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
          <ExcelUpload />
        </div>

        {/* Resumo das abas carregadas */}
        {sheetNames.length > 0 && (
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dados carregados</p>
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
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Limpar dados
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

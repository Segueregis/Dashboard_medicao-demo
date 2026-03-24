// src/components/dashboard/Sidebar.tsx
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart2, 
  Settings,
  TableProperties,
  FileSpreadsheet
} from "lucide-react";

export type SidebarTab = "dashboard" | "especificacoes" | "boletim";

interface Props {
  activeTab: SidebarTab;
  onChangeTab: (tab: SidebarTab) => void;
  className?: string;
}

export function Sidebar({ activeTab, onChangeTab, className }: Props) {
  return (
    <aside className={cn("w-16 sm:w-20 bg-background border-r border-border/40 flex flex-col items-center py-6 h-screen sticky top-0 shrink-0", className)}>
      {/* Ícone fixo de navegação / logo superior */}
      <div 
        className={cn(
          "mb-10 cursor-pointer transition-colors px-2 relative group",
           activeTab === "dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onChangeTab("dashboard")}
      >
        <Home className="w-6 h-6" />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border border-border">
          Home / Visualização Ativa
        </span>
      </div>

      {/* Divisor Visual */}
      <div className="w-8 h-[1px] bg-border/50 mb-6" />

      {/* Abas dinâmicas selecionáveis (conforme pedido na imagem e na interface) */}
      <div className="flex flex-col gap-4 w-full items-center flex-1">
        
        {/* Gráficos / Dashboard */}
        <div 
          onClick={() => onChangeTab("dashboard")}
          className={cn(
            "w-full flex justify-center py-3 border-l-2 cursor-pointer transition-all relative group",
            activeTab === "dashboard" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border border-border">
            Gráficos e KPIs
          </span>
        </div>

        {/* Especificações */}
        <div 
          onClick={() => onChangeTab("especificacoes")}
          className={cn(
            "w-full flex justify-center py-3 border-l-2 cursor-pointer transition-all relative group",
            activeTab === "especificacoes" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <TableProperties className="w-6 h-6" />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border border-border">
            Detalhamento por Tipo de Serviço
          </span>
        </div>

        {/* Boletim Mensal */}
        <div 
          onClick={() => onChangeTab("boletim")}
          className={cn(
            "w-full flex justify-center py-3 border-l-2 cursor-pointer transition-all relative group",
            activeTab === "boletim" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <FileSpreadsheet className="w-6 h-6" />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md border border-border">
            Boletim Mensal
          </span>
        </div>

      </div>

      {/* Ícone Infeior (Settings) */}
      <div className="mt-auto text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-2 pt-6 relative group">
        <Settings className="w-6 h-6" />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Configurações
        </span>
      </div>
    </aside>
  );
}

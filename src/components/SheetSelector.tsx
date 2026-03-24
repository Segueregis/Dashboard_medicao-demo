// src/components/SheetSelector.tsx
// Dropdown para o usuário escolher qual aba do Excel visualizar
import { useExcel } from "@/contexts/ExcelContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSpreadsheet } from "lucide-react";

export function SheetSelector() {
  const { sheetNames, activeSheet, setActiveSheet, sheets, fileName } = useExcel();

  if (sheetNames.length === 0) return null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline truncate max-w-[180px]" title={fileName}>
          {fileName}
        </span>
      </div>

      <Select value={activeSheet} onValueChange={setActiveSheet}>
        <SelectTrigger className="w-[220px] h-8 text-sm">
          <SelectValue placeholder="Selecionar aba..." />
        </SelectTrigger>
        <SelectContent>
          {sheetNames.map((name) => (
            <SelectItem key={name} value={name}>
              <span className="flex items-center gap-2">
                {name}
                <span className="text-xs text-muted-foreground">
                  ({(sheets[name]?.length ?? 0).toLocaleString("pt-BR")} linhas)
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

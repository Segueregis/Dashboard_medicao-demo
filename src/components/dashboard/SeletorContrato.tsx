// src/components/dashboard/SeletorContrato.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContratoInfo } from "@/lib/types";
import { Briefcase } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface Props {
  activeId: string;
  onChange: (id: string) => void;
  contratos: ContratoInfo[];
}

export function SeletorContrato({ activeId, onChange, contratos }: Props) {
  const activeContrato = contratos.find((c) => c.id === activeId);

  return (
    <div className="flex items-center gap-2">
      <Briefcase className="w-4 h-4 text-muted-foreground hidden sm:block" />
      <Select value={activeId} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-[280px] h-9 text-sm font-medium">
          <SelectValue placeholder="Selecione um contrato...">
            <span className="truncate">
              {activeContrato?.nome}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {contratos.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <div className="flex flex-col text-left w-full pr-4">
                <span className="font-medium text-sm">{c.nome}</span>
                <span className="text-xs text-muted-foreground">
                  Valor base: {formatCurrency(c.valorBase)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

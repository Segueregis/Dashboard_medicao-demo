import { FaturamentoProcessado } from "@/lib/types";

export interface DemoConfig {
  isDemoMode: boolean;
  demoData: FaturamentoProcessado;
}

export interface DemoActionResponse {
  success: boolean;
  message: string;
}

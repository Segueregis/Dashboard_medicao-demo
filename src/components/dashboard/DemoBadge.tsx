import { isDemoMode } from "@/config/demo-mode";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function DemoBadge() {
  if (!isDemoMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 animate-bounce-subtle">
      <Badge 
        variant="outline" 
        className="bg-amber-500 text-black border-amber-600 font-bold px-4 py-2 shadow-2xl flex items-center gap-2"
      >
        <Info className="h-4 w-4" />
        ESTE É O MODO DEMO
      </Badge>
    </div>
  );
}

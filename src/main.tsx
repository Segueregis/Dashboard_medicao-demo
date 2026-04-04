import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isDemoMode } from "./config/demo-mode.ts";

/**
 * Lógica de inicialização específica para o Modo Demo.
 * Limpa o localStorage para garantir que a experiência de demonstração
 * comece sempre de um estado limpo.
 */
if (isDemoMode) {
  localStorage.clear();
  console.log("🛠️ Modo Demo: LocalStorage limpo para inicialização.");
}

createRoot(document.getElementById("root")!).render(<App />);

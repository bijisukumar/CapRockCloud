import { createContext, useContext, useState } from "react";
import GatedContentModal from "./GatedContentModal.jsx";

const GateContext = createContext(null);

export function GateProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <GateContext.Provider value={{ openGate: () => setOpen(true) }}>
      {children}
      <GatedContentModal open={open} onClose={() => setOpen(false)} />
    </GateContext.Provider>
  );
}

export function useGate() {
  const ctx = useContext(GateContext);
  if (!ctx) throw new Error("useGate must be used within a GateProvider");
  return ctx;
}

import { createContext, useContext, ReactNode } from "react";
import useActions from "../../hooks/data/useActions";
import { ActionsContextType } from "../../types";

// Acts as a shared Data slice for the app

// 1. Create the context
const ActionsContext = createContext<ActionsContextType | null>(null);

// 2. Provider wraps children and exposes shared logic
export function ActionsProvider({ children }: { children: ReactNode }) {
  const actionsState = useActions(); // contains actions, addAction, etc.

  return (
    <ActionsContext.Provider value={actionsState}>
      {children}
    </ActionsContext.Provider>
  );
}

// 3. Consumer hook
export function useActionsContext() {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error("useActionsContext must be used inside <ActionsProvider>");
  }
  return context;
}

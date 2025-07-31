import { createContext, useContext } from "react";
import useActions from "../../hooks/useActions";

// Acts as a shared Data slice for the app

// 1. Create the context
const ActionsContext = createContext();

// 2. Provider wraps children and exposes shared logic
export function ActionsProvider({ children }) {
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

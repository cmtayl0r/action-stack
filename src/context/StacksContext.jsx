import { createContext, useContext } from "react";
import useStacks from "../hooks/useStacks";

// Acts as a shared Data slice for the app

// 1. Create the context
const StacksContext = createContext();

// 2. Provider wraps children and exposes shared logic
export function StacksProvider({ children }) {
  const stacks = useStacks(); // Contains stacks, addStack from hook etc
  return (
    <StacksContext.Provider value={stacks}>{children}</StacksContext.Provider>
  );
}

// 3. Consumer hook
export function useStacksContext() {
  const context = useContext(StacksContext);
  if (!context)
    throw new Error("useStacksContext must be used inside <StacksProvider>");
  return context;
}

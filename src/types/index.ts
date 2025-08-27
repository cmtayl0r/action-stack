// This file re-exports everything so you can import from one place
export * from "./component";
// export * from './api';     // When you add API types later
// export * from './utils';   // When you add utility types later

// Stack and Action types
// TODO: Move to own dedicated type files

export type Action = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  stackId?: string;
};

export type ActionsContextType = {
  actions: Action[];
  addAction: (
    title: string,
    priority: "low" | "medium" | "high",
    stackId: string
  ) => void;
  removeAction: (id: string) => void;
  updateAction: (id: string, updatedData: Partial<Action>) => void;
  toggleComplete: (id: string) => void;
  getCompletedCount: () => number;
  getIncompleteCount: () => number;
};

export type Stack = {
  id: string;
  name: string;
};

export type StacksContextType = {
  stacks: Stack[];
  addStack: (stack: Partial<Stack>) => Promise<Stack>;
};

export type ToastContextType = {
  success: (message: string) => void;
  error: (message: string) => void;
};

export type AppState = {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  toast: { message: string; type: "success" | "error" } | null;
  currentStackId: string;
};

export type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_CURRENT_STACK_ID"; payload: string };

export type AppContextType = {
  state: AppState;
  toggleSidebar: () => void;
  toggleTheme: () => void;
};


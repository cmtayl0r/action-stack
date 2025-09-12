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

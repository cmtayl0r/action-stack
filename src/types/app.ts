// ===============================================================
// APP STATE TYPES
// ===============================================================
// Application-wide state management types for React Context

export interface AppState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  toast: { message: string; type: "success" | "error" } | null;
}

export type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_THEME" };

export interface AppContextType {
  state: AppState;
  toggleSidebar: () => void;
  toggleTheme: () => void;
}

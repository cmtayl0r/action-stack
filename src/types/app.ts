// =============================================================================
// APP STATE TYPES
// =============================================================================
// Application-wide state management types for React Context

export type Theme = "light" | "dark";

// State shape - what the app context holds
export interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  highContrast: boolean;
}

// Action types for state updates in reducer
export type AppAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "TOGGLE_THEME" }
  | { type: "SET_CONTRAST"; payload: boolean }
  | { type: "TOGGLE_CONTRAST" };

// Context value type - what the context provides to components
export interface AppContextType {
  state: AppState;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setContrast: (enabled: boolean) => void;
  toggleContrast: () => void;
}

export interface ThemeTransitionOptions {
  duration?: number; // in ms
  easing?: string; // CSS easing function
}

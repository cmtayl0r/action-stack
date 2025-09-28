import {
  createContext,
  useReducer,
  useMemo,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { AppContextType, AppAction, AppState, Theme } from "@/types/app";
import { applyTheme, getInitialTheme, getInitialContrast } from "@/lib/theme";
import { stat } from "fs";

// =============================================================================
// REDUCER & INITIAL STATE
// =============================================================================

const initialState: AppState = {
  theme: getInitialTheme(),
  highContrast: getInitialContrast(),
  sidebarOpen: true,
};

// 🔄 Pure state update function - handles all app state changes
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      // Open/close sidebar - commonly used for mobile responsive layouts
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "SET_THEME":
      // Set specific theme - useful for saved preferences
      return { ...state, theme: action.payload };

    case "TOGGLE_THEME":
      const newTheme = state.theme === "dark" ? "light" : "dark";
      // Quick theme switcher - most common user interaction
      return {
        ...state,
        theme: newTheme,
      };

    case "SET_CONTRAST":
      return { ...state, highContrast: action.payload };

    case "TOGGLE_CONTRAST":
      return { ...state, highContrast: !state.highContrast };

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT & PROVIDER
// =============================================================================

// 🌟 Create context with null default (enforces provider usage)
const AppContext = createContext<AppContextType | null>(null);

// 📱 Provider component - wraps your entire app
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // 🔄 useReducer for predictable state updates
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 🎨 Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(state.theme, state.highContrast);
  }, [state.theme, state.highContrast]);

  // ⚡ Action functions - these are what components actually call
  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const toggleContrast = () => dispatch({ type: "TOGGLE_CONTRAST" });

  const setTheme = (theme: Theme) => {
    // if (theme === state.theme) return; // No change
    if (theme === "light" || theme === "dark") return;
    dispatch({ type: "SET_THEME", payload: theme });
  };

  const setContrast = (enabled: boolean) => {
    dispatch({ type: "SET_CONTRAST", payload: enabled });
  };

  // 🚀 Memoize context value to prevent unnecessary re-renders
  // Only re-creates when state changes, not on every render
  const contextValue = useMemo(
    () => ({
      state,
      toggleSidebar,
      toggleTheme,
      toggleContrast,
      setTheme,
      setContrast,
    }),
    [state] // Only dependency is state - functions are stable
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// =============================================================================
// 🪝 HOOK
// =============================================================================

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

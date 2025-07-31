import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { appReducer, initialState } from "./appReducer";
import * as actions from "./appActions";

//1️⃣  Create a context for global state
const AppContext = createContext();

//2️⃣  Create a provider component
export const AppProvider = ({ children }) => {
  // 2A: 🧠 useReducer handles state logic
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 2B: 🧠 Memoized helper methods
  const toggleSidebar = useCallback(() => {
    dispatch(actions.toggleSidebar());
  }, []);

  const toggleTheme = useCallback(() => {
    const next = state.theme === "light" ? "dark" : "light";
    dispatch(actions.setTheme(next));
  }, [state.theme]);

  // 2C: ♻️ Memoize the context value
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      toggleSidebar,
      toggleTheme,
    }),
    [state, toggleSidebar, toggleTheme]
  );

  // 2D: 🌍 Provide the context
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

//3️⃣  Create a custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

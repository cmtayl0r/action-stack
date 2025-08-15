import {
  createContext,
  useReducer,
  useMemo,
  useContext,
  ReactNode,
} from "react";
import { appReducer, initialState } from "./appReducer";
import * as actions from "./appActions";
import { AppContextType } from "../../types";

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const toggleSidebar = () => {
    dispatch(actions.toggleSidebar());
  };

  const contextValue = useMemo(
    () => ({
      state,
      toggleSidebar,
    }),
    [state]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

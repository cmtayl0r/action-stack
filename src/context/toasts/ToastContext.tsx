import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { toastReducer, initialToastState } from "./toastReducer";
import * as actions from "./toastActions";
import { ToastContextType } from "../../types";

// -----------------------------------------------------------------------------
// 1️⃣ Context for sharing context
// -----------------------------------------------------------------------------

const ToastContext = createContext<ToastContextType | null>(null);

// -----------------------------------------------------------------------------
// 2️⃣ Create a provider component
// -----------------------------------------------------------------------------

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  // 2A: 🧠 useReducer handles state logic
  const [state, dispatch] = useReducer(toastReducer, initialToastState);

  // 2B: 🧠 Memoized helper methods
  const showToast = useCallback(
    (
      message: string,
      type: "info" | "success" | "error" | "warning" = "info",
      duration = 3000
    ) => {
      dispatch(actions.showToast(message, type, duration));
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    dispatch(actions.hideToast(id));
  }, []);

  const clearAllToasts = useCallback(() => {
    dispatch(actions.clearAllToasts());
  }, []);

  // Convenience methods for different toast types
  const success = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  );

  const error = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast]
  );

  // 2C: ♻️ Memoize the context value
  const contextValue = useMemo(
    () => ({
      state,
      toasts: state.toasts,
      showToast,
      hideToast,
      clearAllToasts,
      success,
      error,
    }),
    [state, showToast, hideToast, clearAllToasts, success, error]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

// -----------------------------------------------------------------------------
// 3️⃣ Custom hook to use the Toast context
// -----------------------------------------------------------------------------
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { toastReducer, initialToastState } from "./toastReducer";
import * as actions from "./toastActions";

// -----------------------------------------------------------------------------
// 1️⃣ Context for sharing context
// -----------------------------------------------------------------------------

const ToastContext = createContext();

// -----------------------------------------------------------------------------
// 2️⃣ Create a provider component
// -----------------------------------------------------------------------------

export const ToastProvider = ({ children }) => {
  // 2A: 🧠 useReducer handles state logic
  const [state, dispatch] = useReducer(toastReducer, initialToastState);

  // 2B: 🧠 Memoized helper methods
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    dispatch(actions.showToast(message, type, duration));
  }, []);

  const hideToast = useCallback((id) => {
    dispatch(actions.hideToast(id));
  }, []);

  const clearAllToasts = useCallback(() => {
    dispatch(actions.clearAllToasts());
  }, []);

  // Convenience methods for different toast types
  const success = useCallback(
    (message, duration) => showToast(message, "success", duration),
    [showToast]
  );

  const error = useCallback(
    (message, duration) => showToast(message, "error", duration),
    [showToast]
  );

  const info = useCallback(
    (message, duration) => showToast(message, "info", duration),
    [showToast]
  );

  const warning = useCallback(
    (message, duration) => showToast(message, "warning", duration),
    [showToast]
  );

  // 2C: ♻️ Memoize the context value
  const contextValue = useMemo(
    () => ({
      state,
      toast: state.toasts,
      showToast,
      hideToast,
      clearAllToasts,
      success,
      error,
      info,
      warning,
    }),
    [state, showToast, hideToast, clearAllToasts, success, error, info, warning]
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

import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
  ReactNode,
} from "react";
import { toastReducer, initialToastState } from "./reducer";
import * as actions from "./actions";
import { ToastContextValue, Toast } from "@/context/toasts/types";

// ! Voiceover does not announce toasts

// =============================================================================
// 🏗️ CONTEXT CREATION
// =============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

// =============================================================================
// 🎯 TOAST PROVIDER COMPONENT
// =============================================================================

interface ToastProviderProps {
  children: ReactNode;
  /** Maximum number of toasts to show at once (default: 5) */
  maxToasts?: number;
}

export const ToastProvider = ({
  children,
  maxToasts = 5,
}: ToastProviderProps) => {
  // 🧠 State management using reducer pattern
  const [state, dispatch] = useReducer(toastReducer, initialToastState);

  // 🎬 ACTION DISPATCHERS - Memoized for performance
  /**
   * Shows a new toast notification
   * Automatically enforces maximum toast limit
   */
  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 3000) => {
      // If at max capacity, remove oldest toast first
      if (state.toasts.length >= maxToasts) {
        const oldestToastId = state.toasts[0]?.id;
        if (oldestToastId) {
          dispatch(actions.hideToast(oldestToastId));
        }
      }

      dispatch(actions.showToast(message, type, duration));
    },
    [state.toasts.length, maxToasts]
  );

  /**
   * Hides a specific toast by ID
   */
  const hideToast = useCallback((id: string) => {
    dispatch(actions.hideToast(id));
  }, []);

  /**
   * Clears all visible toasts
   */
  const clearAllToasts = useCallback(() => {
    dispatch(actions.clearAllToasts());
  }, []);

  // 🎨 CONVENIENCE METHODS - Pre-configured toast types

  const success = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  );

  const error = useCallback(
    (message: string) => showToast(message, "error", 5000),
    [showToast]
  );

  const warning = useCallback(
    (message: string) => showToast(message, "warning", 4000),
    [showToast]
  );

  const info = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast]
  );

  // 2C: ♻️ Memoize the context value
  const contextValue = useMemo(
    () => ({
      // State
      state,
      toasts: state.toasts,

      // Actions
      showToast,
      hideToast,
      clearAllToasts,

      // Convenience methods
      success,
      error,
      warning,
      info,

      // Utility
      hasToasts: state.toasts.length > 0,
      toastCount: state.toasts.length,
    }),
    [state, showToast, hideToast, clearAllToasts, success, error, warning, info]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

// =============================================================================
// 🪝 CUSTOM HOOK - Safe context consumption
// =============================================================================

/**
 * Hook to access toast functionality
 * Must be used within a ToastProvider
 *
 * @example
 * const { showToast, success, error } = useToastContext();
 *
 * // Show basic toast
 * showToast('Hello world!');
 *
 * // Show success toast
 * success('Operation completed!');
 *
 * // Show error toast
 * error('Something went wrong');
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToastContext must be used within a ToastProvider. " +
        "Wrap your component tree with <ToastProvider>."
    );
  }

  return context;
};

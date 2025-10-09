import {
  createContext,
  useMemo,
  useCallback,
  useContext,
  ReactNode,
  useState,
} from "react";

// ! Voiceover does not announce toasts

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
  duration: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  /** Maximum number of toasts to show at once (default: 5) */
  maxToasts?: number;
}

// =============================================================================
// UTILITY FUNCTION
// =============================================================================

const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

// =============================================================================
// TOAST PROVIDER
// =============================================================================

export const ToastProvider = ({
  children,
  maxToasts = 5,
}: ToastProviderProps) => {
  // 📦 State management using useState
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ⚡ ACTION FUNCTIONS - Direct state updates
  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration = 3000) => {
      setToasts((prev) => {
        // If at max capacity, remove oldest toast first
        const updatedToasts = prev.length >= maxToasts ? prev.slice(1) : prev;

        // Create new toast
        const newToast = {
          id: generateToastId(),
          message: message.trim(),
          type,
          duration,
        };

        return [...updatedToasts, newToast];
      });
    },
    [maxToasts]
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 🎨 CONVENIENCE METHODS - Pre-configured toast types
  const success = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast]
  );

  const error = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast]
  );

  const warning = useCallback(
    (message: string) => showToast(message, "warning"),
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
      toasts,

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
      hasToasts: toasts.length > 0,
      toastCount: toasts.length,
    }),
    [
      toasts,
      showToast,
      hideToast,
      clearAllToasts,
      success,
      error,
      warning,
      info,
    ]
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

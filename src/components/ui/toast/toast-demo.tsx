// =============================================================================
// Toast Store with Zustand
// =============================================================================

import { create } from "zustand";
import { nanoid } from "nanoid";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  dismissible?: boolean;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Convenience methods
  success: (message: string, options?: Partial<Toast>) => void;
  error: (message: string, options?: Partial<Toast>) => void;
  warning: (message: string, options?: Partial<Toast>) => void;
  info: (message: string, options?: Partial<Toast>) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = nanoid();
    const newToast = { id, ...toast };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration || 5000);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  // Convenience methods
  success: (message, options = {}) =>
    get().addToast({
      message,
      type: "success",
      duration: 4000,
      dismissible: true,
      ...options,
    }),

  error: (message, options = {}) =>
    get().addToast({
      message,
      type: "error",
      duration: 6000,
      dismissible: true,
      ...options,
    }),

  warning: (message, options = {}) =>
    get().addToast({
      message,
      type: "warning",
      duration: 5000,
      dismissible: true,
      ...options,
    }),

  info: (message, options = {}) =>
    get().addToast({
      message,
      type: "info",
      duration: 4000,
      dismissible: true,
      ...options,
    }),
}));

// =============================================================================
// Toast Component
// =============================================================================

import { X } from "lucide-react";
import { Button } from "@/components/ui";
import clsx from "clsx";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const typeStyles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between p-4 border rounded-lg shadow-sm",
        "min-w-[320px] max-w-[500px]",
        "animate-in slide-in-from-top-2 fade-in duration-200",
        typeStyles[toast.type]
      )}
      role="alert"
      aria-live={toast.type === "error" ? "assertive" : "polite"}
    >
      <p className="text-sm font-medium">{toast.message}</p>

      {toast.dismissible && (
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          icon={X}
          onClick={() => onRemove(toast.id)}
          aria-label="Dismiss notification"
          className="ml-4 opacity-70 hover:opacity-100"
        />
      )}
    </div>
  );
}

// =============================================================================
// Toast Container
// =============================================================================

function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-2"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// =============================================================================
// Usage Examples
// =============================================================================

function ExampleUsage() {
  const { success, error, warning, info } = useToastStore();

  return (
    <div className="space-y-2">
      <Button onClick={() => success("Action completed successfully!")}>
        Success Toast
      </Button>

      <Button onClick={() => error("Something went wrong")}>Error Toast</Button>

      <Button onClick={() => warning("Please check your input")}>
        Warning Toast
      </Button>

      <Button onClick={() => info("New feature available")}>Info Toast</Button>
    </div>
  );
}

// =============================================================================
// App Integration
// =============================================================================

function App() {
  return (
    <div className="app">
      {/* Your app content */}
      <Sidebar />
      <main>{/* content */}</main>

      {/* Toast container - add once at app level */}
      <ToastContainer />
    </div>
  );
}

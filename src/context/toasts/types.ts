export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
  duration: number;
}

export interface ToastState {
  toasts: Toast[];
}

export type ToastAction =
  | { type: "SHOW_TOAST"; payload: Omit<Toast, "id"> }
  | { type: "HIDE_TOAST"; payload: string }
  | { type: "CLEAR_ALL_TOASTS" };

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

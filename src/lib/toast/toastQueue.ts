import { UNSTABLE_ToastQueue as ToastQueue } from "react-aria-components";
import type { ToastContent, ToastOptions } from "@/context/toasts/types";

export const globalToastQueue = new ToastQueue<ToastContent>({
  // 🔄 Integrate with Framer Motion animations
  wrapUpdate(fn) {
    // Wrap state updates for smooth animations
    if ("startViewTransition" in document) {
      document.startViewTransition(() => fn());
    } else {
      fn();
    }
  },
  // ⏱️ Default timeout with accessibility compliance (5s minimum)
  defaultTimeout: 5000,
  // 🎚️ Maximum visible toasts to prevent screen clutter
  maxVisibleToasts: 5,
});

export const toast = {
  // ✅ Success notifications
  success: (title: string, description?: string, options?: ToastOptions) =>
    globalToastQueue.add(
      { title, description, type: "success" },
      { timeout: 4000, ...options }
    ),

  // ❌ Error notifications (no auto-dismiss for accessibility)
  error: (title: string, description?: string, options?: ToastOptions) =>
    globalToastQueue.add(
      { title, description, type: "error" },
      { timeout: 0, ...options } // Errors don't auto-dismiss
    ),

  // ⚠️ Warning notifications
  warning: (title: string, description?: string, options?: ToastOptions) =>
    globalToastQueue.add(
      { title, description, type: "warning" },
      { timeout: 6000, ...options }
    ),

  // ℹ️ Info notifications
  info: (title: string, description?: string, options?: ToastOptions) =>
    globalToastQueue.add(
      { title, description, type: "info" },
      { timeout: 5000, ...options }
    ),

  // 🗑️ Dismiss specific toast
  dismiss: (key: string) => globalToastQueue.close(key),

  // 🧹 Clear all toasts
  clear: () => globalToastQueue.clear(),
};

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BadgeInfo, CircleCheck, TriangleAlert, X } from "lucide-react";
import styles from "./Toast.module.css";
import { useToast } from "@/context/toasts/ToastContext";
import type { Toast as ToastType } from "@/context/toasts/types";
import { Button } from "@/components";

/*
  Toast Component
  - Displays a toast notification with an icon, message, and close button.
  - Automatically dismisses after a specified duration.
  - Uses icons from lucide-react for different toast types.
  - Stacks toasts in a container.
  - Uses createPortal to render the toast container in a different part of the DOM.
  - props sent to component via the provider using the context API
*/

const ICONS = {
  info: BadgeInfo,
  success: CircleCheck,
  error: TriangleAlert,
  warning: TriangleAlert,
} as const;

interface ToastItemProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

// -----------------------------------------------------------------------------
// 🍞 Individual Toast Component
// -----------------------------------------------------------------------------

export const Toast = ({ toast, onClose }: ToastItemProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const Icon = ICONS[toast.type];

  // ⏰ Auto-dismiss timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => onClose(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, isPaused, onClose]);

  // ⏸️ Pause timer on hover/focus for accessibility
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  // ⌨️ Keyboard support - Escape key to dismiss
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose(toast.id);
  };

  // 🔊 Get appropriate ARIA live region setting
  const getAriaLive = () => {
    return toast.type === "error" ? "assertive" : "polite";
  };

  return (
    <div
      className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}
      role="alertdialog"
      aria-live={getAriaLive()}
      aria-atomic="true"
      aria-labelledby={`toast-message-${toast.id}`}
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <Icon className={styles.toast__icon} size={32} aria-hidden="true" />
      <div className={styles["toast__message"]}>{toast.message}</div>
      <Button
        variant="ghost"
        size="md"
        isIconOnly
        icon={X}
        onClick={() => onClose(toast.id)}
        aria-label="Dismiss notification"
      />
    </div>
  );
};

// -----------------------------------------------------------------------------
// 🪣 ToastContainer Component
// -----------------------------------------------------------------------------

export const ToastContainer = () => {
  const { toasts, hideToast } = useToast();
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("toast-root");
    if (root) {
      setPortalRoot(root);
    }
  }, []);

  if (!toasts.length || !portalRoot) return null;

  return createPortal(
    <div
      className={styles["toast-container"]}
      aria-label="Notifications"
      role="region"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={hideToast} />
      ))}
    </div>,
    portalRoot
  );
};

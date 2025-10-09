import { useEffect, useState } from "react";
import { BadgeInfo, CircleCheck, TriangleAlert, X } from "lucide-react";
import styles from "./Toast.module.css";
import type { Toast as ToastType } from "@/context/toasts/ToastContext";
import { Button } from "@/components";
import { motion } from "motion/react";

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

const Toast = ({ toast, onClose }: ToastItemProps) => {
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
    <motion.div
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
      // Motion animation props
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{
        duration: 0.3,
        ease: "easeOut", // Use easeOut for both enter/exit for consistency
      }}
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
    </motion.div>
  );
};

export default Toast;

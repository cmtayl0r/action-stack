import { useEffect } from "react";
import styles from "./Toast.module.css";
import { BadgeInfo, CircleCheck, TriangleAlert, X } from "lucide-react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/*
  Toast Component
  - Displays a toast notification with an icon, message, and close button.
  - Automatically dismisses after a specified duration.
  - Uses icons from lucide-react for different toast types.
  - Stacks toasts in a container.
  - Uses createPortal to render the toast container in a different part of the DOM.
  - props sent to component via the provider using the context API
*/

// -----------------------------------------------------------------------------
// 1️⃣ Individual Toast Component
// -----------------------------------------------------------------------------

export function Toast({ id, message, type, duration, onClose }) {
  // Debug
  // console.log("Toast rendered:", { id, message, type });

  // Clear toast after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    // Clean up the timer when the component unmounts or when toast changes
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Determine the icon based on the type of toast
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CircleCheck />;
      case "error":
        return <TriangleAlert />;
      case "info":
        return <BadgeInfo />;
      case "warning":
        return <TriangleAlert />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`
          ${styles.toast} 
          ${type ? styles[`toast--${type}`] : ""}
        `}
      aria-live="polite"
      initial={{ opacity: 0, y: 30, x: 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
    >
      <span className={styles["toast__icon"]}>{getIcon()}</span>
      <div className={styles["toast__message"]}>{message}</div>
      <button
        onClick={() => onClose(id)}
        aria-label="Dismiss Toast"
        className={styles["toast__close"]}
      >
        <X size={20} />
      </button>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// 2️⃣ ToastContainer Component
// -----------------------------------------------------------------------------

export function ToastContainer({ toasts, onClose }) {
  return createPortal(
    <div className={styles["toast-container"]}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

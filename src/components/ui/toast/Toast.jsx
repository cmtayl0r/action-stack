import { useEffect, useState } from "react";
import styles from "./Toast.module.css";
import { BadgeInfo, CircleCheck, TriangleAlert, X } from "lucide-react";
import { createPortal } from "react-dom";

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
  const [isExiting, setIsExiting] = useState(false);
  // Debug
  // console.log("Toast rendered:", { id, message, type });

  // Clear toast after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true); // Triggers exit animation via CSS class

      // Remove after animation completes
      setTimeout(() => {
        onClose(id);
      }, duration); // Using duration here will delay removal by the same duration as the initial display
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
    <div
      data-toast-id={id}
      className={`
          ${styles.toast}
          ${type ? styles[`toast--${type}`] : ""}
          ${isExiting ? styles["toast--exiting"] : ""}
        `}
      aria-live="polite"
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
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2️⃣ ToastContainer Component
// -----------------------------------------------------------------------------

export function ToastContainer({ toasts, onClose }) {
  return createPortal(
    <div className={styles["toast-container"]}>
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
    </div>,
    document.body
  );
}

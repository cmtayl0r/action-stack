import { useEffect, useState } from "react";
import styles from "./Toast.module.css";
import { createPortal } from "react-dom";
import Toast from "./Toast";
import { useToast } from "@/context/toasts/ToastContext";
import { AnimatePresence } from "motion/react";

const ToastContainer = () => {
  const { toasts, hideToast } = useToast();
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("toast-root");
    if (root) {
      setPortalRoot(root);
    }
  }, []);

  // Keep the container mounted to allow exit animations
  if (!portalRoot) return null;

  return createPortal(
    <div
      className={styles["toast-container"]}
      aria-label="Notifications"
      role="region"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={hideToast} />
        ))}
      </AnimatePresence>
    </div>,
    portalRoot
  );
};

export default ToastContainer;

import { createPortal } from "react-dom";
import { useToastContext } from "../../../context/toasts/ToastContext";
import { ToastContainer } from "./Toast"; // assumes UI component

const ToastHost = () => {
  const { state, hideToast } = useToastContext();

  // Don't render anything if there are no toasts
  if (!state.toasts?.length) return null;

  return createPortal(
    <ToastContainer toasts={state.toasts} onClose={hideToast} />,
    document.getElementById("toast-root")
  );
};

export default ToastHost;

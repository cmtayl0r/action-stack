import { createPortal } from "react-dom";
import { useModalContext } from "../../../context/modals/ModalContext";

// -----------------------------------------------------------------------------
// Modal Host
// -----------------------------------------------------------------------------

/*
 * ModalHost component is responsible for rendering the modal component.
 * It uses the useModalContext to get the current modalId and modalProps.
 * It retrieves the modal component from a registry and renders it.
 * This allows for lazy loading of several modals in the app.
 * based on the modalId and modalProps provided by the ModalContext.
 * It uses createPortal to render the modal in a different part of the DOM.
 */

export const ModalHost = () => {
  const { modalId, modalProps, registry, closeModal } = useModalContext();

  // If no modal is open, return null
  if (!modalId) return null;
  // Get the component from the registry
  const ModalComponent = registry[modalId];
  // If the component is not registered, return null
  if (!ModalComponent) return null;

  return createPortal(
    <ModalComponent {...modalProps} closeModal={closeModal} />,
    document.getElementById("modal-root")
  );
};

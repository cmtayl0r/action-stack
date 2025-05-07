import { createPortal } from "react-dom";
import { useModalContext } from "../../../context/ModalContext";

// -----------------------------------------------------------------------------
// Modals management
// -----------------------------------------------------------------------------

// // Create lazy-loaded components
// const AddActionModal = lazy(() => import("../../../features/AddActionModal"));
// const AddStackModal = lazy(() => import("../../../features/AddStackModal"));
// const SearchActionsModal = lazy(() =>
//   import("../../../features/SearchActionsModal")
// );

// // Mapping of modal names to components
// const MODAL_COMPONENTS = {
//   "add-action": AddActionModal,
//   "add-stack": AddStackModal,
//   "search-actions": SearchActionsModal,
// };

// -----------------------------------------------------------------------------
// Modal Host
// -----------------------------------------------------------------------------

function ModalHost() {
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
}

export default ModalHost;

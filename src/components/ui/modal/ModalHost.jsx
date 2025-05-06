import { lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { useModalContext } from "../../../context/ModalContext";

// -----------------------------------------------------------------------------
// Modals management
// -----------------------------------------------------------------------------

// Create lazy-loaded components
const AddActionModal = lazy(() => import("../../../features/AddActionModal"));
const AddStackModal = lazy(() => import("../../../features/AddStackModal"));
const SearchActionsModal = lazy(() =>
  import("../../../features/SearchActionsModal")
);

// Mapping of modal names to components
const MODAL_COMPONENTS = {
  "add-action": AddActionModal,
  "add-stack": AddStackModal,
  "search-actions": SearchActionsModal,
};

// -----------------------------------------------------------------------------
// Modal Host
// -----------------------------------------------------------------------------

function ModalHost() {
  const { current, props, closeModal } = useModalContext();

  if (!current) return null;
  const ModalComponent = MODAL_COMPONENTS[current];
  if (!ModalComponent) return null;

  return createPortal(
    <Suspense fallback={null}>
      <ModalComponent {...props} closeModal={closeModal} />
    </Suspense>,
    document.getElementById("modal-root")
  );
}

export default ModalHost;

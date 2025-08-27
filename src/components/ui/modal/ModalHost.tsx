import { useModal } from "@/context/modals/ModalContext";

// Import modal components directly - no registry needed
import AddActionModal from "@/components/features/actions/AddActionModal";
import AddStackModal from "@/components/features/stacks/AddStackModal";
import SearchActionsModal from "@/components/features/search/SearchActionsModal";

/**
 * Purpose:
 * This component is the "stage" where our active modals appear.
 * It's a single, central component that listens for instructions from the ModalContext
 * then displays the correct modal when asked.
 * You place this component once in your main App layout. <ModalHost />
 */

// =============================================================================
// SIMPLE REGISTRY
// Purpose: Simple mapping object. Maps modal IDs to their corresponding components.
// =============================================================================

const MODAL_COMPONENTS = {
  addAction: AddActionModal,
  addStack: AddStackModal,
  search: SearchActionsModal,
} as const;

// =============================================================================
// MODAL HOST COMPONENT
// Purpose: Renders the active modal component based on the current modal state.
// =============================================================================

export function ModalHost() {
  const { currentModal, hideModal } = useModal();

  // No modal to render
  if (!currentModal.id) {
    return null;
  }

  // Get the component to render
  const ModalComponent =
    MODAL_COMPONENTS[currentModal.id as keyof typeof MODAL_COMPONENTS];

  // Handle unknown modal IDs
  if (!ModalComponent) {
    console.warn(`Unknown modal: ${currentModal.id}`);
    return null;
  }

  return (
    <ModalComponent isOpen={true} onClose={hideModal} {...currentModal.props} />
  );
}

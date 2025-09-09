import { useModal } from "@/context/modals/ModalContext";

// Import modal components directly - no registry needed
import AddActionModal from "@/components/features/actions/AddActionModal";
import AddStackModal from "@/components/features/stacks/AddStackModal";
import SearchActionsModal from "@/components/features/search/SearchActionsModal";

/**
 * MODAL SYSTEM: Renderer
 *
 * Purpose: The "stage" where modals appear - renders the currently active modal
 *
 * Flow:
 * 1. Listens to ModalContext for which modal should be shown
 * 2. Maps modal IDs to their components (addAction → AddActionModal)
 * 3. Renders the correct modal component with its props
 * 4. Handles unknown modal IDs gracefully
 *
 * Usage: Place <ModalHost /> once in your app layout (like App.tsx or AppLayout.tsx)
 */

// =============================================================================
// SIMPLE REGISTRY
// Purpose: Simple mapping object. Maps modal IDs to their corresponding components.
// =============================================================================

// Simple mapping object - readable and maintainable
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

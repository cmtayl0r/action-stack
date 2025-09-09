import { useModal } from "@/context/modals/ModalContext";

// 🗂️ Import all modal components - clean and simple
import AddActionModal from "@/components/features/actions/AddActionModal";
import AddStackModal from "@/components/features/stacks/AddStackModal";
import SearchActionsModal from "@/components/features/search/SearchActionsModal";

/**
 * MODAL HOST: Simplified modal management
 *
 * Purpose: Single responsibility for modal rendering
 * Benefits: Less complex types, easier to maintain, cleaner imports
 *
 * Pattern: Direct component mapping without complex type gymnastics
 */

// =============================================================================
// MODAL IDS - Type-safe modal identifiers
// =============================================================================

export const MODAL_IDS = {
  ADD_ACTION: "addAction",
  SEARCH: "search",
  ADD_STACK: "addStack",
  // CONFIRM_DELETE: "confirmDelete",
  // USER_PROFILE: "userProfile",
} as const;

// =============================================================================
// TYPE DEFINITIONS - Modal prop interfaces
// =============================================================================

/**
 * Simple registry: modal ID maps directly to component
 * No complex prop interfaces needed - each component handles its own props
 */
const MODAL_COMPONENTS = {
  [MODAL_IDS.ADD_ACTION]: AddActionModal,
  [MODAL_IDS.SEARCH]: SearchActionsModal,
  [MODAL_IDS.ADD_STACK]: AddStackModal,
} as const;

// =============================================================================
// MODAL HOST COMPONENT
// Purpose: Renders the active modal component based on the current modal state.
// =============================================================================

export function ModalHost() {
  const { modalState } = useModal();

  // Early return if no modal is open
  if (!modalState.id) {
    return null;
  }

  // Get the modal component - simple lookup
  const ModalComponent =
    MODAL_COMPONENTS[modalState.id as keyof typeof MODAL_COMPONENTS];

  // Error handling for missing modals
  if (!ModalComponent) {
    console.error(`Modal component not found for ID: "${modalState.id}"`);
    return null;
  }

  // Render the modal with its props from the registry
  return <ModalComponent {...modalState.props} />;
}

// =============================================================================
// TYPE HELPERS - Optional, only if you need type safety
// =============================================================================

export type ModalId = keyof typeof MODAL_COMPONENTS;

// Simple typed hook - no complex generics needed
export function useTypedModal() {
  const modal = useModal();

  return {
    ...modal,
    // Simple overload for type safety
    openModal: (id: ModalId, props?: any) => modal.openModal(id, props),
  };
}

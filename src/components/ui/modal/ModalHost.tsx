import { useModal } from "@/context/modals/ModalContext";
import AddActionModal from "@/components/features/actions/AddActionModal";
import AddStackModal from "@/components/features/stacks/AddStackModal";
import SearchActionsModal from "@/components/features/search/SearchActionsModal";
import { AnimatePresence } from "motion/react";

/**
 * MODAL HOST: Central modal registry and renderer
 *
 * Purpose: Single component responsible for rendering the active modal
 *
 * Benefits:
 * - Central registry - see all modals in one place
 * - Single modal instance (better performance)
 * - Easy to add/remove modals (update MODAL_IDS + register)
 * - Lazy loading ready (can use React.lazy)
 * - Type-safe modal IDs with autocomplete
 *
 * Pattern: Registry + Dynamic Component Rendering
 * - MODAL_IDS constant defines all available modals
 * - MODAL_COMPONENTS maps IDs to components
 * - Renders active modal based on context state
 * - Returns null when no modal is open
 *
 * Usage:
 * 1. Add modal ID to MODAL_IDS
 * 2. Import modal component
 * 3. Register in MODAL_COMPONENTS
 * 4. Place <ModalHost /> in AppLayout
 *
 * Location: Should be rendered once in your root layout (AppLayout.tsx)
 */

// =============================================================================
// MODAL IDS
// =============================================================================
/**
 * Type-safe identifiers for all modals
 * Add new modal IDs here as you create them
 */

export const MODAL_IDS = {
  ADD_ACTION: "addAction",
  SEARCH: "search",
  ADD_STACK: "addStack",
  // CONFIRM_DELETE: "confirmDelete",
  // USER_PROFILE: "userProfile",
} as const;

// Type helper - ensures only valid modal IDs are used
export type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS];

// =============================================================================
// MODAL HOST COMPONENT
// =============================================================================
/**
 * Modal Host Component
 * Renders whichever modal is currently active
 * Place this at the root of your app (in AppLayout or layout.tsx)
 */

export function ModalHost() {
  const { activeModalId } = useModal();

  // Map of modal IDs to their components
  // Add new modals here as you create them
  const MODAL_COMPONENTS: Record<string, React.ComponentType> = {
    [MODAL_IDS.ADD_ACTION]: AddActionModal,
    [MODAL_IDS.SEARCH]: SearchActionsModal,
    [MODAL_IDS.ADD_STACK]: AddStackModal,
  };

  // 🔍 Get modal component (can be null/undefined)
  const ModalComponent = activeModalId ? MODAL_COMPONENTS[activeModalId] : null;

  // ⚠️ Error check BEFORE rendering (optional - only for dev warnings)
  if (activeModalId && !ModalComponent) {
    console.error(`Modal component not found for ID: "${activeModalId}"`);
  }

  // Render the active modal
  return ModalComponent && <ModalComponent key={activeModalId} />;
}

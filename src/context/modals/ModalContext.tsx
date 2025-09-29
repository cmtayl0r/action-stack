import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

/**
 * MODAL CONTEXT: Global modal state management
 *
 * Purpose: Provides centralized control for opening/closing modals throughout the app
 *
 * Benefits:
 * - Single source of truth for modal state
 * - No prop drilling - access from any component
 * - Type-safe modal IDs and props
 * - Prevents multiple modals from conflicting
 *
 * Pattern: Context + Provider + Custom Hook
 * - ModalProvider wraps your app (in main.tsx)
 * - useModal() hook provides access anywhere
 * - Tracks activeModalId and modalProps in state
 *
 * Usage:
 * const { openModal, closeModal } = useModal();
 * openModal(MODAL_IDS.ADD_ACTION, { stackId: 1 });
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Context value shape - what useModal() returns
 * This is our public API boundary, so we type it explicitly
 */
interface ModalContextValue {
  activeModalId: string | null; // Currently active modal ID
  modalProps: Record<string, any>; // Props to pass to the active modal
  openModal: (modalId: string, props?: Record<string, any>) => void;
  closeModal: () => void;
  isModalOpen: (modalId: string) => boolean;
}

// =============================================================================
// CONTEXT
// =============================================================================

const ModalContext = createContext<ModalContextValue | null>(null);

// =============================================================================
// MODAL PROVIDER
// =============================================================================

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  // 📦 Track which modal is open (null = none)
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  // 📦 Store props to pass to active modal
  const [modalProps, setModalProps] = useState<Record<string, any>>({});

  // ⚡ Open a modal by ID with optional props
  const openModal = useCallback(
    (modalId: string, props: Record<string, any> = {}) => {
      setActiveModalId(modalId);
      setModalProps(props);
    },
    []
  );

  // ⚡ Close the currently active modal
  const closeModal = useCallback(() => {
    setActiveModalId(null);
    setModalProps({});
  }, []);

  // ⚡ Check if a specific modal is currently open
  const isModalOpen = useCallback(
    (modalId: string) => {
      return activeModalId === modalId;
    },
    [activeModalId]
  );

  const contextValue: ModalContextValue = useMemo(
    () => ({
      activeModalId,
      modalProps, // Props could be anything
      openModal,
      closeModal,
      isModalOpen,
    }),
    [activeModalId, modalProps, openModal, closeModal, isModalOpen]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

// =============================================================================
// PUBLIC HOOK TO ACCESS CONTEXT
// =============================================================================

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

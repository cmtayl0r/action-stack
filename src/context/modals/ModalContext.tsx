import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * MODAL REGISTRY: Centralized modal state management
 *
 * Purpose: Single source of truth for which modal is open and modal data
 * Benefits: Type-safe, clean separation, easy to extend
 *
 * Flow: Component calls openModal(id, props) → Registry updates → BaseModal renders → Focus management handled by React Aria
 */

// =============================================================================
// 1. CONTEXT
// =============================================================================

interface ModalState<T = any> {
  id: string | null;
  props: T;
}
interface ModalContextValue {
  // Current modal state
  modalState: ModalState;
  // Core actions - simple and focused
  openModal: <T = any>(id: string, props?: T) => void;
  closeModal: () => void;
  // Helper to check if specific modal is open
  isModalOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

// =============================================================================
// 2. MODAL PROVIDER
// =============================================================================

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  // 🎛️ State for Modal
  const [modalState, setModalState] = useState<ModalState>({
    id: null,
    props: {},
  });

  // 🔧 Open any modal with optional props
  const openModal = <T = any,>(id: string, props: T = {} as T) => {
    setModalState({ id, props });
  };

  // 🔧 Close modal and clear state
  const closeModal = () => {
    setModalState({ id: null, props: {} });
  };

  // 🔧 Helper to check if specific modal is open
  const isModalOpen = (id: string) => modalState.id === id;

  const contextValue: ModalContextValue = {
    modalState,
    openModal,
    closeModal,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

// =============================================================================
// 3. PUBLIC HOOK
// =============================================================================

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

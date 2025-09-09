import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";

/**
 * MODAL SYSTEM: Context & State Management
 *
 * Purpose: Central brain that tracks which modal is open and provides controls
 *
 * Flow:
 * 1. ModalProvider wraps your app and holds modal state
 * 2. Components call showModal(id, props) to open a specific modal
 * 3. Components call hideModal() to close the current modal
 * 4. Automatically manages focus restoration to the trigger element
 *
 * Usage: Wrap your app with <ModalProvider>, then use useModal() hook anywhere
 */

/*
SYSTEM FLOW SUMMARY:
Trigger (Button) → useModal().showModal('addAction', {stackId}) → ModalContext updates state → ModalHost renders AddActionModal → Modal components handle UI/UX → onClose() → ModalContext clears state → focus returns to trigger
*/

// =============================================================================
// 1. CONTEXT
// =============================================================================

interface ModalState {
  id: string | null;
  props: Record<string, any>;
}

interface ModalContextValue {
  showModal: (id: string, props?: Record<string, any>) => void;
  hideModal: () => void;
  currentModal: ModalState;
  triggerRef: React.RefObject<HTMLElement | null>;
}

// The actual React Context object
const ModalContext = createContext<ModalContextValue | null>(null);

// =============================================================================
// 2. MODAL PROVIDER
// =============================================================================

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  // 🎛️ Simple state - no complex generics
  const [currentModal, setCurrentModal] = useState<ModalState>({
    id: null,
    props: {},
  });

  // 🏷️ Ref to store the element that triggered the modal, for focus restoration
  const triggerRef = useRef<HTMLElement | null>(null);

  // 🔧 function to open a specific modal with optional props
  const showModal = (id: string, props: Record<string, any> = {}) => {
    // Save the currently focused element before opening modal
    triggerRef.current = document.activeElement as HTMLElement;
    setCurrentModal({ id, props });
  };

  // 🔧 function to Close modal and restore focus
  const hideModal = () => {
    setCurrentModal({ id: null, props: {} });

    // Restore focus to the element that opened the modal
    setTimeout(() => {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }, 10);
  };

  const contextValue: ModalContextValue = {
    showModal,
    hideModal,
    currentModal,
    triggerRef,
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

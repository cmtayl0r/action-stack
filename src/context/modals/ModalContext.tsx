import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";

/**
 * Purpose:
 * This file is the brain behind the modal system. It's a central place that manages which modal is currently shown on the screen.
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
  triggerRef: React.RefObject<HTMLElement>;
}

// The actual React Context object
const ModalContext = createContext<ModalContextValue | null>(null);

// =============================================================================
// 2. MODAL PROVIDER
// Purpose: Provides the modal context to the application
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
// Purpose: Allows components to open/close modals and access trigger ref.
// =============================================================================

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

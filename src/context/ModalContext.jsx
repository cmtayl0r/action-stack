import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { modalReducer, initialModalState } from "./modalReducer";
import * as actions from "./modalActions";
import { modalRegistry } from "../utils/modalRegistry";

// -----------------------------------------------------------------------------
// 1️⃣ Context for sharing context
// -----------------------------------------------------------------------------

const ModalContext = createContext();

// -----------------------------------------------------------------------------
// 2️⃣ Create a provider component
// -----------------------------------------------------------------------------

export const ModalProvider = ({ children }) => {
  // 2A: 🧠 useReducer handles state logic
  const [state, dispatch] = useReducer(modalReducer, initialModalState);

  // 2B: 🧠 Memoized helper methods
  const openModal = useCallback((id, props) => {
    dispatch(actions.openModal(id, props));
  }, []);

  const closeModal = useCallback(() => {
    dispatch(actions.closeModal());
  }, []);

  const registerModal = useCallback((id, component) => {
    dispatch(actions.registerModal(id, component));
  }, []);

  // ✅ Register all modals in the registry when the component mounts
  // This is a one-time operation, so we can use useMemo to avoid re-registering
  useMemo(() => {
    modalRegistry.forEach(({ id, component }) => {
      registerModal(id, component);
    });
  }, [registerModal]);

  // 2C: ♻️ Memoize the context value
  const contextValue = useMemo(
    () => ({
      ...state, // Send all state values (modalId, modalProps, registry)
      openModal,
      closeModal,
    }),
    [state, openModal, closeModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

// -----------------------------------------------------------------------------
// 3️⃣  Create a custom hook to use the ModalContext
// -----------------------------------------------------------------------------

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

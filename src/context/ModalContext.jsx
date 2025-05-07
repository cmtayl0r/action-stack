import {
  createContext,
  useReducer,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { modalReducer, initialModalState } from "./modalReducer";
import * as actions from "./modalActions";

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

  // 2C: ♻️ Memoize the context value
  const contextValue = useMemo(
    () => ({
      ...state,
      openModal,
      closeModal,
      registerModal,
    }),
    [state, openModal, closeModal, registerModal]
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

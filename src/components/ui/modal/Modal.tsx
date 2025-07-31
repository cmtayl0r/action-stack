import React, {
  useRef,
  useContext,
  createContext,
  cloneElement,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

// -----------------------------------------------------------------------------
// 1 - Context and Custom Hook
// -----------------------------------------------------------------------------

const ModalContext = createContext();

// -----------------------------------------------------------------------------
// 2 - Parent Component to manage shared state and provide context
// -----------------------------------------------------------------------------

function Modal({
  children,
  title,
  onClose = () => {}, // Optional prop to handle close event
}) {
  // 🔖 Refs for DOM elements
  const dialogRef = useRef(null); // Ref to the modal dialog element
  const triggerRef = useRef(null); // Ref to the trigger element (button or link that opens the modal)

  // 🛠️ Helper Methods

  // Open modal
  const open = useCallback(() => {
    if (dialogRef.current) dialogRef.current?.showModal();
  }, [dialogRef]);

  // Close modal
  const close = useCallback(() => {
    // If dialogRef exists, close modal
    if (dialogRef.current) dialogRef.current?.close();
    // Call the onClose prop if provided
    onClose();
  }, [dialogRef, onClose]);

  const contextValue = {
    open,
    close,
    dialogRef,
    triggerRef,
    title,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// 3 - Child Components
// -----------------------------------------------------------------------------

// 🔘 Modal.Trigger — optional for local modals
const ModalTrigger = ({ children, ...props }) => {
  const { open, triggerRef, id } = useContext(ModalContext);

  // A: If there is no children, return a button element
  // Replace with primary button from design system
  if (!React.isValidElement(children)) {
    return (
      <button ref={triggerRef} onClick={open}>
        {children}
      </button>
    );
  }

  // Or B: Add props to existing element (e.g., button or link)
  return cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e);
      open();
    },
    ref: triggerRef,
    "aria-haspopup": "dialog",
    "aria-controls": id,
    ...props,
  });
};

// 🪟 Modal.Dialog — handles backdrop, Escape key, and animation
const ModalDialog = ({
  children,
  showCloseButton = true,
  size = "medium",
  closeOnOutsideClick = true,
  ...props
}) => {
  const { close, dialogRef, id } = useContext(ModalContext);

  // Show the modal after it's rendered in the DOM
  useEffect(() => {
    // Show the modal after it's rendered in the DOM
    if (dialogRef.current) {
      setTimeout(() => {
        dialogRef.current.showModal();
      }, 0);
    }
    // Cleanup function - close the dialog when component unmounts
    return () => {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    };
  }, [dialogRef]);

  // Handle click outside to close modal
  const handleBackdropClick = (e) => {
    // if (e.target === dialogRef.current) close();
    if (closeOnOutsideClick && e.target === dialogRef.current) close();
  };

  return createPortal(
    <dialog
      className={`${styles.modal} ${styles[`modal--${size}`]}`}
      ref={dialogRef}
      onClick={handleBackdropClick}
      id={id}
      aria-modal="true"
      aria-labelledby={`${id}-heading`}
      {...props} // Spread any other props
    >
      <div className={styles["modal__wrapper"]}>
        {showCloseButton && (
          <button
            aria-label="Close modal"
            className={styles["modal__close-button"]}
            onClick={close}
          >
            <X aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </dialog>,
    document.body
  );
};

// Heading
const ModalHeading = ({ children, ...props }) => {
  const { id } = useContext(ModalContext);

  return (
    <h2 id={`${id}-heading`} className={styles["modal__heading"]} {...props}>
      {children}
    </h2>
  );
};

// Content
const ModalContent = ({ children, ...props }) => {
  return (
    <main className={styles["modal__content"]} {...props}>
      {children}
    </main>
  );
};

// Footer
const ModalFooter = ({ children, ...props }) => {
  return (
    <footer className={styles["modal__footer"]} {...props}>
      {children}
    </footer>
  );
};

// Close button
const ModalCloseButton = ({ children, ...props }) => {
  const { close } = useContext(ModalContext);

  // A: Create a new button element
  // Replace with secondary button from design system
  if (!React.isValidElement(children)) {
    return (
      <button
        className={styles["modal__close-button"]}
        onClick={close}
        {...props} // Spread any other props
      >
        {children || "Cancel"}
      </button>
    );
  }

  // or B: Add props to existing element (e.g., button or link)
  return cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e);
      close();
    },
    ...props, // Spread any other props
  });
};

// -----------------------------------------------------------------------------
// 4 - Export
// -----------------------------------------------------------------------------

Modal.Trigger = ModalTrigger;
Modal.Dialog = ModalDialog;
Modal.Heading = ModalHeading;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
Modal.CloseButton = ModalCloseButton;

export default Modal;

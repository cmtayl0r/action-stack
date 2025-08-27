import {
  useEffect,
  useId,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components";
import { useFocusManagement } from "@/lib/accessibility/focus-management";
import styles from "./Modal.module.css";
import clsx from "clsx";

// !: At >768 click outside the wrapper in fullscreen closes the modal/dialog
// ? Understand why my BaseHTMLProps cant be used, and the AI wanted to use HTML Attributes directly

// =============================================================================
// Base modal props for all modals
// =============================================================================

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
}

// =============================================================================
// CONTEXT & HOOK
// =============================================================================

// Types in context given to Modal components
interface ModalContextType {
  onClose: () => void;
  titleId: string;
  descriptionId: string;
}

const ModalContext = createContext<ModalContextType | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "Modal compound components must be used within a Modal component"
    );
  }
  return context;
};

// =============================================================================
// PARENT/ROOT COMPONENT
// =============================================================================

function ModalRoot({ children, isOpen, onClose }: BaseModalProps) {
  // Generate unique IDs for ARIA labeling
  const titleId = useId();
  const descriptionId = useId();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store original overflow to restore later
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const contextValue = { onClose, titleId, descriptionId };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

// =============================================================================
// MODAL DIALOG
// =============================================================================

// ModalDialogProps extends BaseModalProps and DialogHTMLAttributes
interface ModalDialogProps
  extends Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    "children" | "className" | "onClose" | "onClick" | "onCancel"
  > {
  size?: "sm" | "md" | "lg" | "full";
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  children: ReactNode; // Explicitly add children as it's a compound component's purpose
  className?: string; // Explicitly add className for styling
}

const ModalDialog = ({
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  className,
  ...props
}: ModalDialogProps) => {
  const { onClose, titleId, descriptionId } = useModalContext();
  const { containerRef, saveFocus, restoreFocus, trapFocus, focusFirstInput } =
    useFocusManagement<HTMLDialogElement>();

  // Show modal and manage focus
  useEffect(() => {
    const dialog = containerRef.current;
    if (!dialog) return;

    // Save focus before opening
    saveFocus();

    // Show the modal
    dialog.showModal();

    // Enable focus trap
    trapFocus(true);

    // Focus first input field (not close button) - better accessibility
    setTimeout(() => {
      focusFirstInput();
    }, 100);

    // Cleanup when component unmounts
    return () => {
      trapFocus(false);
      restoreFocus();
    };
  }, [saveFocus, restoreFocus, trapFocus, focusFirstInput]);

  // 🛠️ Handle backdrop click
  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (closeOnBackdropClick && e.target === containerRef.current) {
      onClose();
    }
  };

  // 🛠️ Handle escape key (native dialog behavior)
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    e.preventDefault();
    onClose();
  };

  const dialogClasses = clsx(styles.modal, styles[`modal--${size}`], className);

  return createPortal(
    <dialog
      ref={containerRef}
      className={dialogClasses}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClick={handleClick} // Handles closing via backdrop click
      onCancel={handleCancel}
      {...props}
    >
      <div className={styles["modal__wrapper"]}>
        {showCloseButton && (
          <Button
            iconOnly
            onClick={onClose}
            variant="ghost"
            icon={X}
            aria-label="Close modal"
            className={styles["modal__close-button"]}
          />
        )}
        {children}
      </div>
    </dialog>,
    document.getElementById("modal-root") ?? document.body
  );
};

// =============================================================================
// MODAL HEADER
// =============================================================================

const ModalHeader = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  const { titleId } = useModalContext();
  const headerClasses = clsx(styles["modal__header"], className);

  return (
    <header className={headerClasses}>
      <h2 id={titleId} className={styles["modal__title"]} {...props}>
        {children}
      </h2>
    </header>
  );
};

// =============================================================================
// MODAL BODY
// =============================================================================

const ModalBody = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  const { descriptionId } = useModalContext();
  const bodyClasses = clsx(styles["modal__body"], className);

  return (
    <main id={descriptionId} className={bodyClasses} {...props}>
      {children}
    </main>
  );
};

// =============================================================================
// MODAL FOOTER
// =============================================================================

const ModalFooter = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  const footerClasses = clsx(
    styles["modal__footer"],
    "cluster",
    "cluster--end",
    className
  );

  return (
    <footer className={footerClasses} {...props}>
      {children}
    </footer>
  );
};

// =============================================================================
// MODAL CLOSE BUTTON
// =============================================================================

const ModalClose = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { onClose } = useModalContext();

  return (
    <Button
      onClick={onClose}
      variant="outline"
      aria-label={"Cancel and close modal"}
      {...props}
    >
      {children || "Cancel"}
    </Button>
  );
};

// =============================================================================
// 5. COMPOUND COMPONENT ASSIGNMENT
// =============================================================================

export const Modal = {
  Root: ModalRoot,
  Dialog: ModalDialog,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
};

export default Modal;

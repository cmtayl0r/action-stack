import { type ReactNode } from "react";
import { Modal, ModalOverlay, Dialog, Heading } from "react-aria-components";
import { useModal } from "@/context/modals/ModalContext";
import { Button } from "@/components";
import { X } from "lucide-react";
import styles from "./Modal.module.css";
import clsx from "clsx";

// ? can isDismissable just be applied to ModalOverlay?
// ? can isKeyboardDismissDisabled just be applied to ModalOverlay?

/**
 * =============================================================================
 * BASE MODAL
 * =============================================================================
 *
 * PURPOSE & CONTEXT:
 * - Core modal component for the application
 *
 * COMPONENT ARCHITECTURE:
 * - Layer: Styled (Layer 2) - Wraps React Aria headless with design system
 * - Design Pattern: Controlled component
 * - Reusability: Foundation for all modals in application
 *
 * @see ModalHost.tsx for portal rendering
 * @see ModalContext.tsx for state management
 * @see Modal.module.css for base styles
 * =============================================================================
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface BaseModalProps {
  id: string; // Unique modal ID
  children: ReactNode; // Modal content
  title?: string; // Optional title/header
  isDismissable?: boolean; // Click outside or close button
  isKeyboardDismissDisabled?: boolean; // Disable Esc key
  size?: "sm" | "md" | "lg" | "full"; // Size variants
  className?: string; // Custom CSS classes
}

// =============================================================================
// COMPONENT
// =============================================================================

export function BaseModal({
  id,
  children,
  title,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  size = "md",
  className,
  ...props
}: BaseModalProps) {
  const { closeModal, isModalOpen } = useModal();
  const isOpen = isModalOpen(id);

  // if modal is not open, return null
  // if (!isOpen) return null;

  // 🎨 Build CSS classes with size variant and custom overrides
  const modalClasses = clsx(styles.modal, styles[`modal--${size}`], className);

  console.log("Rendering BaseModal:", { id, isOpen });

  return (
    <ModalOverlay
      className={styles["modal__overlay"]}
      isOpen={isOpen}
      onOpenChange={(open) => !open && closeModal()}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <Modal className={modalClasses} {...props}>
        <Dialog>
          <div className="stack">
            {title && (
              <Heading level={2} slot="title">
                {title}
              </Heading>
            )}
            {children}
          </div>
          <Button
            isIconOnly
            variant="ghost"
            onPress={closeModal}
            icon={X}
            aria-label="Close modal"
            className={styles["modal__close-button"]}
          />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export default BaseModal;

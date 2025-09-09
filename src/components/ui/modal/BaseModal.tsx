import { type ReactNode } from "react";
import { Modal, ModalOverlay, Dialog, Heading } from "react-aria-components";
import { useModal } from "@/context/modals/ModalContext";
import { Button } from "@/components";
import { X } from "lucide-react";
import styles from "./Modal.module.css";
import clsx from "clsx";

/**
 * BASE MODAL: Foundation component using modern React Aria Components
 *
 * Purpose: Provides consistent structure, accessibility, and styling base
 * Benefits:
 * - Modern React Aria Components v1.14+ (no legacy hooks)
 * - Automatic focus management, ARIA, keyboard navigation
 * - Built-in animation states and styling hooks
 * - Clean separation between modal logic and content
 * - Reusable across different modal types
 *
 * Usage: Wrap your modal content with BaseModal and pass modalId
 */

interface BaseModalProps {
  // Modal identification - must match MODAL_IDS constant
  modalId: string;
  // Modal content and configuration
  children: ReactNode;
  title?: string;
  // Behavior options
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  // Size variants for different content types
  size?: "sm" | "md" | "lg" | "full";
  // Additional styling
  className?: string;
}
export function BaseModal({
  modalId,
  children,
  title,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  size = "md",
  className,
  ...props
}: BaseModalProps) {
  // 🎯 Connect to modal registry - get current state and controls
  const { modalState, closeModal, isModalOpen } = useModal();
  const isOpen = isModalOpen(modalId);

  // Early return if modal isn't open - prevents unnecessary DOM rendering
  if (!isOpen) return null;

  // 🎨 Build CSS classes with size variant and custom overrides
  const modalClasses = clsx(styles.modal, styles[`modal--${size}`], className);

  return (
    <ModalOverlay
      className={styles["modal__overlay"]}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      isOpen={isOpen}
      onOpenChange={(open) => {
        // React Aria calls this when user closes modal (ESC, click outside, etc.)
        if (!open) closeModal();
      }}
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

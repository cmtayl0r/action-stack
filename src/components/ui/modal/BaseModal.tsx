import { type ReactNode } from "react";
import { Modal, ModalOverlay, Dialog, Heading } from "react-aria-components";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/context/modals/ModalContext";
import { Button } from "@/components";
import { X } from "lucide-react";
import styles from "./Modal.module.css";
import clsx from "clsx";

/**
 * BASE MODAL: Foundation component with Framer Motion animations
 *
 * Purpose: Provides consistent structure, accessibility, and smooth animations
 * Benefits:
 * - React Aria for accessibility (focus management, ARIA, keyboard navigation)
 * - Framer Motion for reliable, smooth animations
 * - AnimatePresence handles mount/unmount animations
 * - Clean separation between modal logic and content
 * - Reusable across different modal types
 *
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

// Create motion components from React Aria components
const MotionModalOverlay = motion(ModalOverlay);
const MotionModal = motion(Modal);

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
    <AnimatePresence>
      {isOpen && (
        <MotionModalOverlay
          className={styles["modal__overlay"]}
          isDismissable={isDismissable}
          isKeyboardDismissDisabled={isKeyboardDismissDisabled}
          isOpen={isOpen}
          onOpenChange={(open) => {
            // React Aria calls this when user closes modal (ESC, click outside, etc.)
            if (!open) closeModal();
          }}
          // Backdrop Motion animation
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MotionModal
            className={modalClasses}
            {...props}
            // Modal Motion animations
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          >
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
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  );
}

export default BaseModal;

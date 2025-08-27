// Component-Level Indices

// Main modal compound component
export { Modal as default } from "./Modal";
export { Modal } from "./Modal";

// Export props interface for other modal components
export type { ModalProps } from "./Modal";

// Modal system components
export { ModalHost } from "./ModalHost";
export { ModalProvider, useModal } from "@/context/modals/ModalContext";

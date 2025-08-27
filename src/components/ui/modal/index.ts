// Component-Level Indices

// Main modal compound component
export { Modal as default } from "./Modal";
export { Modal } from "./Modal";

// Modal system components
export { ModalHost } from "./ModalHost";
export { ModalProvider, useModal } from "@/context/modals/ModalContext";

// Re-export types for consumers who need them
// export type {
//   ModalRootProps,
//   ModalContentProps,
//   ModalHeaderProps,
//   ModalCloseProps,
// } from "./Modal";

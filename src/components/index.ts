// Top-level components barrel
// Follow root index rules:
// - Named exports only (no `export *`)
// - Re-export specific items from category barrels (ui, layout, features) to keep imports clean

/*
================================================================================
UI
================================================================================
*/

export { default as BaseModal } from "./ui/modal/BaseModal";
export { ModalHost } from "./ui/modal/ModalHost";
export { MODAL_IDS } from "./ui/modal/ModalHost";
export { default as Button } from "./ui/button/Button";
export { Toast, ToastContainer } from "./ui/toast/Toast";
export { default as LoadingSpinner } from "./ui/loading-spinner/LoadingSpinner";
export { default as ThemeSelector } from "./ui/theme-selector/ThemeSelector";
export type { ButtonProps } from "./ui/button/Button";

/*
================================================================================
LAYOUT
================================================================================
*/

export { default as AppLayout } from "./layout/app-layout/AppLayout";
export { default as Sidebar } from "./layout/sidebar/Sidebar";
export { default as Header } from "./layout/header/Header";
export { default as StackView } from "./layout/stack-view/StackView";
export { default as ErrorView } from "./layout/error-view/ErrorView";

/*
================================================================================
FEATURES
================================================================================
*/
// Actions
export { default as ActionListItem } from "./features/actions/ActionListItem";
export { default as AddActionModal } from "./features/actions/AddActionModal";
// export { default as EditActionFoundation } from "./features/actions/EditAction-foundation";

// Search
export { default as SearchActionsModal } from "./features/search/SearchActionsModal";

// Stacks
export { default as StackFilter } from "./features/stacks/StackFilter";
export { default as StackList } from "./features/stacks/StackList";
export { default as AddStackModal } from "./features/stacks/AddStackModal";

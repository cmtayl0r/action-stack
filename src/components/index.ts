// Top-level components barrel
// Follow root index rules:
// - Named exports only (no `export *`)
// - Re-export specific items from category barrels (ui, layout, features) to keep imports clean

/*
================================================================================
UI
================================================================================
*/

export {
  Modal,
  ModalHost,
  Toast,
  ToastHost,
  LoadingSpinner,
  Button,
} from "./ui";
export type { ModalProps } from "./ui";

/*
================================================================================
LAYOUT (add when layout index exists)
================================================================================
*/

// export { Sidebar, AppLayout } from './layout';

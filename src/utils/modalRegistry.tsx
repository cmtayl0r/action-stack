import AddActionModal from "../components/features/AddActionModal";
import AddStackModal from "../components/features/AddStackModal";
import SearchActionsModal from "../components/features/SearchActionsModal";

// ✅ Export as a flat list for easy mapping
export const modalRegistry = [
  { id: "add-action", component: AddActionModal },
  { id: "add-stack", component: AddStackModal },
  { id: "search-actions", component: SearchActionsModal },
];

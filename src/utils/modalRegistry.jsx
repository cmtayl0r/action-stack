import AddActionModal from "@/features/AddActionModal";
import AddStackModal from "@/features/AddStackModal";
import SearchActionsModal from "@/features/SearchActionsModal";

// ✅ Export as a flat list for easy mapping
export const modalRegistry = [
  { id: "add-action", component: AddActionModal },
  { id: "add-stack", component: AddStackModal },
  { id: "search-actions", component: SearchActionsModal },
];

import AddActionModal from "../components/features/actions/AddActionModal";
import AddStackModal from "../components/features/stacks/AddStackModal";
import SearchActionsModal from "../components/features/search/SearchActionsModal";

// ✅ Export as a flat list for easy mapping
export const modalRegistry = [
  { id: "add-action", component: AddActionModal },
  { id: "add-stack", component: AddStackModal },
  { id: "search-actions", component: SearchActionsModal },
];

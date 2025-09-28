import type { Action } from "@/types/database";
import type { StackFilters } from "@/types/filters";

// 🛠️ Apply filters to actions array
export function applyFiltersToActions(
  actions: Action[],
  filters: StackFilters
) {
  // Start with all actions by destructuring to avoid mutating original array
  let filtered = [...actions];

  // Search filter
  if (filters.search?.trim()) {
    const searchTerm = filters.search.trim().toLowerCase();
    filtered = filtered.filter((action) =>
      action.name.toLowerCase().includes(searchTerm)
    );
  }

  // Completed filter
  if (!filters.show_completed) {
    filtered = filtered.filter((action) => !action.completed);
  }

  // Sort
  filtered.sort((a, b) => {
    let aValue: string | number | null, bValue: string | number | null;

    switch (filters.sort_by) {
      case "priority":
        aValue = a.priority;
        bValue = b.priority;
        break;
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "due_date":
        aValue = a.due_date || "9999-12-31";
        bValue = b.due_date || "9999-12-31";
        break;
      default:
        aValue = a.created_at;
        bValue = b.created_at;
    }

    if (aValue < bValue) return filters.sort_direction === "asc" ? -1 : 1;
    if (aValue > bValue) return filters.sort_direction === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
}

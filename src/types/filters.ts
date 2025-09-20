// ===============================================================
// FILTERS TYPES AND CONSTANTS
// ===============================================================
// Centralized types for managing stack filters and sorting

// 🔍 Filter types for URL query params and search
export interface StackFilters {
  search?: string; // Search actions by name
  sort_by?: "priority" | "name" | "due_date" | "created_at";
  sort_direction?: "asc" | "desc";
  show_completed?: boolean; // Include completed actions
}

// 📊 Default filter values to ensure consistent behavior
export const DEFAULT_FILTERS: StackFilters = {
  search: "",
  sort_by: "created_at",
  sort_direction: "desc",
  show_completed: true,
};

// 🔄 Sort options for UI dropdowns
export const SORT_OPTIONS = [
  { value: "created_at", label: "Date Created" },
  { value: "priority", label: "Priority" },
  { value: "name", label: "Name" },
  { value: "due_date", label: "Due Date" },
] as const;

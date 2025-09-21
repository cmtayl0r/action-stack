// ===============================================================
// URL FILTERS HOOK - URL Query Parameter Management
// ===============================================================
// Manages filter state in URL query params for bookmarkable filters
// Follows best practice of keeping filter state in URL for user experience

import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import type { StackFilters } from "@/types/filters";
import { DEFAULT_FILTERS } from "@/types/filters";

// 🪝 Main hook for managing filter state in URL query parameters
export const useUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🧠 Parse current filters from URL query params
  const filters: StackFilters = useMemo(() => {
    return {
      search: searchParams.get("search") || DEFAULT_FILTERS.search,
      show_completed: searchParams.has("show_completed")
        ? searchParams.get("show_completed") === "true"
        : DEFAULT_FILTERS.show_completed,
      sort_by:
        (searchParams.get("sort_by") as StackFilters["sort_by"]) ||
        DEFAULT_FILTERS.sort_by,
      sort_direction:
        (searchParams.get(
          "sort_direction"
        ) as StackFilters["sort_direction"]) || DEFAULT_FILTERS.sort_direction,
    };
  }, [searchParams]);

  // 🧠 Update a specific filter
  // K parameter is a key of StackFilters, ONLY allowing valid keys
  // value parameter is the corresponding value type
  // This ensures type safety when updating filters
  const updateFilter = useCallback(
    <K extends keyof StackFilters>(key: K, value: StackFilters[K]) => {
      setSearchParams((prev) => {
        // Create a new URLSearchParams object to modify
        const newParams = new URLSearchParams(prev);
        // If the value is default/empty, remove the parameter
        // Otherwise, set/update the parameter
        // This keeps the URL clean and only includes active filters
        if (
          value === DEFAULT_FILTERS[key] ||
          value === "" ||
          value === null ||
          value === undefined
        ) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  // ⚡️ Convenience methods for each filter type
  // (Optional, can be used for more explicit updates)
  // Example: setSearch("new search term")
  const setSearch = useCallback(
    (search: string) => {
      updateFilter("search", search);
    },
    [updateFilter]
  );

  const setShowCompleted = useCallback(
    (show_completed: boolean) => {
      updateFilter("show_completed", show_completed);
    },
    [updateFilter]
  );

  const setSortBy = useCallback(
    (sort_by: StackFilters["sort_by"]) => {
      updateFilter("sort_by", sort_by);
    },
    [updateFilter]
  );

  const setSortDirection = useCallback(
    (sort_direction: StackFilters["sort_direction"]) => {
      updateFilter("sort_direction", sort_direction);
    },
    [updateFilter]
  );

  // 🛠️ Clear all filters (back to defaults)
  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // 🛠️ Check if any filters are active (different from defaults)
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== DEFAULT_FILTERS.search ||
      filters.show_completed !== DEFAULT_FILTERS.show_completed ||
      filters.sort_by !== DEFAULT_FILTERS.sort_by ||
      filters.sort_direction !== DEFAULT_FILTERS.sort_direction
    );
  }, [filters]);

  return {
    // Current filter state
    filters,

    // Individual setters for convenience
    setSearch,
    setSortBy,
    setSortDirection,
    setShowCompleted,

    // Utility functions
    clearFilters,
    hasActiveFilters,

    // Generic updater for advanced use cases
    updateFilter,
  };
};

// ===============================================================
// FILTER UTILITIES - Helper functions for working with filters
// ===============================================================

// 🛠️ Generate filter summary for debugging/display
export function getFilterSummary(filters: StackFilters): string {
  // Create an array to hold filter parts
  const parts: string[] = [];

  // Add parts only if they differ from defaults
  if (filters.search) parts.push(`search: "${filters.search}"`);
  if (filters.sort_by !== DEFAULT_FILTERS.sort_by)
    parts.push(`sort: ${filters.sort_by}`);
  if (filters.sort_direction !== DEFAULT_FILTERS.sort_direction)
    parts.push(`direction: ${filters.sort_direction}`);
  if (!filters.show_completed) parts.push("hide completed");

  // Join parts with commas, or return 'no filters' if none active
  return parts.length > 0 ? parts.join(", ") : "no filters";
}

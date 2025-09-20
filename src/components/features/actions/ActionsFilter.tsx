import styles from "./actions.module.css";
import type { StackFilters } from "@/types/filters";
import { SORT_OPTIONS } from "@/types/filters";
import { useUrlFilters, getFilterSummary } from "@/hooks/data/useUrlFilters";
import { useState } from "react";

// TODO: Debounce search input for better performance

interface ActionsFilterProps {
  filters: StackFilters;
}

function ActionsFilter({ filters }: ActionsFilterProps) {
  // 🔍 URL filter management hook
  const {
    setSearch,
    setSortBy,
    setSortDirection,
    setShowCompleted,
    clearFilters,
    hasActiveFilters,
  } = useUrlFilters();

  // 📝 Local search input state for controlled input
  const [searchInput, setSearchInput] = useState(filters.search || "");

  // 🔍 Handle search input changes with debouncing
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // 🚀 Immediate update to URL (you might want to debounce this)
    setSearch(value);
  };

  // 🔄 Handle sort direction toggle
  // const toggleSortDirection = () => {
  //   setSortDirection(filters.sort_direction === "asc" ? "desc" : "asc");
  // };

  return (
    <div className={styles["actions-filter"]}>
      <div className={styles["actions-filter__group"]}>
        <strong>Filters:</strong> {getFilterSummary(filters) || "None"}
      </div>

      <div className={styles["actions-filter__group"]}>
        <label htmlFor="search-actions">Search actions</label>
        <input
          type="text"
          id="search-actions"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search actions..."
        />
        {/* 🧹 Clear search button */}
        {searchInput && (
          <button onClick={() => handleSearchChange("")}>✕</button>
        )}
      </div>

      <div className={styles["actions-filter__group"]}>
        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          value={filters.sort_by || "created_at"}
          onChange={(e) => setSortBy(e.target.value as StackFilters["sort_by"])}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="sort-direction">Direction</label>
        <select
          id="sort-direction"
          value={filters.sort_direction || "desc"}
          onChange={(e) =>
            setSortDirection(e.target.value as StackFilters["sort_direction"])
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Show all actions including completed ones */}
      <div className={styles["actions-filter__group"]}>
        <label>
          <input
            type="checkbox"
            onChange={(e) => setShowCompleted(e.target.checked)}
            checked={filters.show_completed}
          />
          Show completed actions
        </label>
      </div>

      <div className={styles["actions-filter__group"]}>
        {hasActiveFilters && (
          <button onClick={clearFilters}>Clear all filters</button>
        )}
      </div>
    </div>
  );
}

export default ActionsFilter;

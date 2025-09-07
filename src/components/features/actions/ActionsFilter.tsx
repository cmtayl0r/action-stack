import styles from "./actions.module.css";

function ActionsFilter({ filter, onFilterChange }) {
  return (
    <div className={styles["actions-filter"]}>
      <div className={styles["actions-filter__group"]}>
        <label htmlFor="title">Search actions</label>
        <input
          type="text"
          id="title"
          value={filter.title}
          onChange={(e) => onFilterChange("title", e.target.value)}
        />
      </div>

      <div className={styles["actions-filter__group"]}>
        <label htmlFor="sort">Sort by</label>
        <select
          id="sort"
          value={filter.sort}
          onChange={(e) => onFilterChange("priority", e.target.value)}
        >
          <option value="priority">Priority</option>
          <option value="dateCreated">Date created</option>
        </select>
        <label htmlFor="sort-direction">Direction</label>
        <select
          id="sort-direction"
          value={filter.sortDirection}
          onChange={(e) => onFilterChange("sortDirection", e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className={styles["actions-filter__group"]}>
        <label>
          <input
            type="checkbox"
            onChange={(e) => onFilterChange("completed", e.target.checked)}
            checked={filter.completed}
          />
          Hide completed
        </label>
      </div>
    </div>
  );
}

export default ActionsFilter;

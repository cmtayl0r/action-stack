import styles from "./ActionsList.module.css";

function ActionsFilter({
  filterName,
  setFilterName,
  filterCompleted,
  setFilterCompleted,
}) {
  return (
    <div className={styles["actions-filter"]}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </div>
      <label>
        <input
          type="checkbox"
          onChange={(e) => setFilterCompleted(e.target.checked)}
          checked={filterCompleted}
        />
        Hide completed
      </label>
    </div>
  );
}

export default ActionsFilter;

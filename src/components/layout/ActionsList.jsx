import styles from "./ActionsList.module.css";

function ActionsList({
  stackId,
  actions,
  onAddAction,
  onRemoveAction,
  onToggleComplete,
}) {
  // use your action hook here if needed (addAction, updateAction, etc.)
  return (
    <div className={styles["actions-list"]}>
      <ul>
        {actions.map((action) => (
          <li key={action.id}>
            <input
              type="checkbox"
              checked={action.completed}
              onChange={() => onToggleComplete(action.id)}
            />
            {action.title}
            <button onClick={() => onRemoveAction(action.id)}>🗑</button>
          </li>
        ))}
      </ul>
      <small>{stackId}</small>
    </div>
  );
}

export default ActionsList;

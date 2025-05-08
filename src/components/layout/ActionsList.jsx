import styles from "./ActionsList.module.css";
import { useActionsContext } from "../../context/ActionsContext";

function ActionsList({ stackId, actions }) {
  const { addAction, removeAction, updateAction, toggleComplete } =
    useActionsContext(); // Get action management functions

  // use your action hook here if needed (addAction, updateAction, etc.)
  return (
    <div className={styles["actions-list"]}>
      <ul>
        {actions.map((action) => (
          <li key={action.id}>
            <input
              type="checkbox"
              checked={action.completed}
              onChange={() => toggleComplete(action.id)}
            />
            {action.title}
            <button onClick={() => removeAction(action.id)}>🗑</button>
          </li>
        ))}
      </ul>
      <small>{stackId}</small>
    </div>
  );
}

export default ActionsList;

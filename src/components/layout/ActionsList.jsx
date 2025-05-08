import styles from "./ActionsList.module.css";
import { useActionsContext } from "../../context/ActionsContext";
import { useState } from "react";

function ActionsList({ stackId, actions }) {
  const { addAction, removeAction, updateAction, toggleComplete } =
    useActionsContext(); // Get action management functions

  const [filterName, setFilterName] = useState(""); // Track action title
  const [filterCompleted, setFilterCompleted] = useState(false); // Track hide completed state

  const filteredActions = actions.filter((action) => {
    // If filterCompleted is true, hide completed actions
    // If filterCompleted is false, show all actions
    // If filterCompleted is true and action is completed, skip it
    if (filterCompleted && action.completed) return false;
    // If filterName is empty, show all actions
    // If filterName is not empty, check if action title includes it
    return action.title.toLowerCase().includes(filterName.toLowerCase());
  });

  // use your action hook here if needed (addAction, updateAction, etc.)
  return (
    <div className={styles["actions-list"]}>
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
      <hr />
      <ul>
        {filteredActions.map((action) => (
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

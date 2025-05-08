import styles from "./ActionsList.module.css";
import { useActionsContext } from "../../context/ActionsContext";
import { useState } from "react";
import ActionListItem from "./ActionListItem";
import ActionsFilter from "./ActionsFilter";

function ActionsList({ stackId, actions }) {
  const { addAction } = useActionsContext(); // Get action management functions

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

  return (
    <div className={styles["actions-list"]}>
      <ActionsFilter
        filterName={filterName}
        setFilterName={setFilterName}
        filterCompleted={filterCompleted}
        setFilterCompleted={setFilterCompleted}
      />
      <ul>
        {filteredActions.map((action) => (
          <ActionListItem
            key={action.id}
            id={action.id}
            title={action.title}
            completed={action.completed}
          />
        ))}
      </ul>
      <small>{stackId}</small>
    </div>
  );
}

export default ActionsList;

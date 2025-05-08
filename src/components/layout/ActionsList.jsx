import styles from "./ActionsList.module.css";
import ActionListItem from "./ActionListItem";
import { use, useEffect } from "react";

function ActionsList({ stackId, actions }) {
  useEffect(() => {
    console.log(actions);
  }, [actions]);

  return (
    <div className={styles["actions-list"]}>
      <ul>
        {actions.map((action) => (
          <ActionListItem
            key={action.id}
            id={action.id}
            title={action.title}
            completed={action.completed}
            priority={action.priority}
            createdAt={action.createdAt}
          />
        ))}
      </ul>
      <small>{stackId}</small>
    </div>
  );
}

export default ActionsList;

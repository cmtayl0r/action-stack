import styles from "./ActionsList.module.css";
import ActionListItem from "./ActionListItem";

function ActionsList({ stackId, actions }) {
  return (
    <div className={styles["actions-list"]}>
      <ul>
        {actions.map((action) => (
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

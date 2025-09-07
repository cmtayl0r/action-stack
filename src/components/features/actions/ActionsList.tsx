import styles from "./actions.module.css";
import ActionListItem from "./ActionListItem";
import { useEffect } from "react";
import { Action } from "@/types";

type ActionsListProps = {
  stackId: string;
  actions: Action[];
};

function ActionsList({ stackId, actions }: ActionsListProps) {
  useEffect(() => {
    console.log(actions);
  }, [actions]);

  return (
    <div className={styles["actions-list"]}>
      <ul>
        {actions.map((action) => (
          <ActionListItem key={action.id} action={action} />
        ))}
      </ul>
      <small>{stackId}</small>
    </div>
  );
}

export default ActionsList;

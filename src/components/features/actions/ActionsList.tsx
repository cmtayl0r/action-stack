import styles from "./actions.module.css";
import ActionListItem from "./ActionListItem";
import { applyFiltersToActions } from "@/hooks/data/useUrlFilters";
import type { Action, StackFilters } from "@/types/database";

type ActionsListProps = {
  stackId: number;
  actions: Action[];
  filters: StackFilters;
  emptyMessage?: string;
};

function ActionsList({
  stackId,
  actions,
  filters,
  emptyMessage = "No actions found",
}: ActionsListProps) {
  // 🔍 Apply filters to actions list
  const filteredActions = applyFiltersToActions(actions, filters);

  if (filteredActions.length === 0) {
    return (
      <div className="actions-list-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles["actions-list"]}>
      <ul role="list">
        {filteredActions.map((action) => (
          <ActionListItem key={action.id} action={action} stackId={stackId} />
        ))}
      </ul>
      <div className="actions-list-summary">
        <small>
          {actions.length} action{actions.length !== 1 ? "s" : ""}
          {" • "}
          {actions.filter((a) => a.completed).length} completed
          {" • "}
          {actions.filter((a) => !a.completed).length} remaining
        </small>
      </div>
    </div>
  );
}

export default ActionsList;

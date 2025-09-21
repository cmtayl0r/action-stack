import styles from "./actions.module.css";
import ActionListItem from "./ActionListItem";
import { applyFiltersToActions } from "@/lib/filters";
import type { Action } from "@/types/database";
import type { StackFilters } from "@/types/filters";

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
      <ul>
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

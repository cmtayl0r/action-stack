import styles from "./stacks.module.css";
import ActionListItem from "@/components/features/actions/ActionListItem";
import { applyFiltersToActions } from "@/lib/filters";
import type { Action } from "@/types/database";
import type { StackFilters } from "@/types/filters";

type StackListProps = {
  stackId: number;
  actions: Action[];
  filters: StackFilters;
  emptyMessage?: string;
};

function StackList({
  stackId,
  actions,
  filters,
  emptyMessage = "No actions found",
}: StackListProps) {
  // 🔍 Apply filters to actions list
  const filteredActions = applyFiltersToActions(actions, filters);

  if (filteredActions.length === 0) {
    return (
      <div className="stack-list__empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles["stack-list"]}>
      <ul className="stack stack--sm">
        {filteredActions.map((action) => (
          <ActionListItem key={action.id} action={action} stackId={stackId} />
        ))}
      </ul>
      <div className="stack-list__summary">
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

export default StackList;

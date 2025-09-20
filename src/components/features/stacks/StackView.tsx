import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import useActions from "@/hooks/data/useActions";
import useStacks from "@/hooks/data/useStacks";
import Header from "@/components/layout/header/Header";
import ActionsFilter from "../actions/ActionsFilter";
import { useUrlFilters } from "@/hooks/data/useUrlFilters";
import ActionsList from "../actions/ActionsList";
import styles from "./stacks.module.css";
import { getCurrentStackId } from "@/router/router";

function StackView() {
  // 🌐 App context
  const { state, toggleSidebar } = useAppContext();

  // 🧭 Get current stack ID from URL parameters
  const params = useParams();
  const stackId = getCurrentStackId(params);

  // 🔍 URL-based filters
  const { filters } = useUrlFilters();

  // 🪝 Get stacks
  const { stacks, isLoading: stackLoading, error: stackError } = useStacks();
  const {
    actions,
    isLoading: actionsLoading,
    error: actionsError,
  } = useActions(stackId);

  // Get current stack from stacks
  const currentStack = useMemo(
    () => stacks.find((s) => s.id === stackId),
    [stacks, stackId]
  );

  // Loading and error states
  if (stackLoading || actionsLoading) return <div>Loading...</div>;
  if (stackError || actionsError) return <div>Error loading data</div>;
  if (!currentStack) return <div>Stack not found</div>;

  return (
    <main className={styles["stack-view"]}>
      <Header
        appState={state}
        toggleSidebar={toggleSidebar}
        stackName={currentStack?.name}
      />
      <ActionsFilter filters={filters} />
      <ActionsList
        stackId={stackId}
        actions={actions}
        filters={filters}
        emptyMessage={`No actions in ${currentStack.name}`}
      />
    </main>
  );
}

export default StackView;

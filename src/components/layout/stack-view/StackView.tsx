import { useMemo } from "react";
import { useParams } from "react-router-dom";
// CONTEXT
import { useAppContext } from "@/context/app/AppContext";
// HOOKS
import useActions from "@/hooks/data/useActions";
import useStacks from "@/hooks/data/useStacks";
import { useUrlFilters } from "@/hooks/data/useUrlFilters";
// HELPERS
import { getCurrentStackId } from "@/router/router";
// COMPONENTS
import Header from "@/components/layout/header/Header";
import StackFilter from "@/components/features/stacks/StackFilter";
import StackList from "@/components/features/stacks/StackList";
import { LoadingSpinner } from "@/components";
// STYLES
import styles from "./StackView.module.css";
import { L } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

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
  if (stackLoading || actionsLoading) return <LoadingSpinner size="lg" />;
  if (stackError || actionsError) return <div>Error loading data</div>;
  if (!currentStack) return <div>Stack not found</div>;

  return (
    <main className={styles["stack-view"]}>
      <Header
        appState={state}
        toggleSidebar={toggleSidebar}
        stackName={currentStack?.name}
      />
      <StackFilter filters={filters} />
      <StackList
        stackId={stackId}
        actions={actions}
        filters={filters}
        emptyMessage={`No actions in ${currentStack.name}`}
      />
    </main>
  );
}

export default StackView;

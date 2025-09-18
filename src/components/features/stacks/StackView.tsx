import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import useActions from "@/hooks/data/useActions";
import Header from "@/components/layout/header/Header";
import ActionsFilter from "../actions/ActionsFilter";
import ActionsList from "../actions/ActionsList";
import { Action, Stack } from "@/types/database";
import styles from "./stacks.module.css";

function StackView() {
  // 🌐 App context
  const { state, toggleSidebar } = useAppContext();

  // Get the stack data from the loader
  const { stack } = useLoaderData() as { stack: Stack };
  const {
    actions,
    loading: actionsLoading,
    error: actionsError,
  } = useActions();

  const [filter, setFilter] = useState({
    name: "",
    completed: false,
    priority: "priority",
    sortDirection: "desc",
  });

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filterActions = useMemo(() => {
    const priorityOrder: Record<Action["priority"], number> = {
      high: 3,
      medium: 2,
      low: 1,
      none: 0,
    };
    return actions
      .filter((a) => a.stack_id === stack.id)
      .filter((a) => (filter.completed ? !a.completed : true))
      .filter((a) => a.name.toLowerCase().includes(filter.name.toLowerCase()))
      .sort((a, b) => {
        const direction = filter.sortDirection === "asc" ? 1 : -1;
        if (filter.priority === "priority") {
          const valA = priorityOrder[a.priority] || 0;
          const valB = priorityOrder[b.priority] || 0;
          return (valA - valB) * direction;
        } else {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return (dateA.getTime() - dateB.getTime()) * direction;
        }
      });
  }, [actions, filter, stack.id]);

  return (
    <main className={styles["stack-view"]}>
      <Header
        appState={state}
        stackName={stack.name}
        toggleSidebar={toggleSidebar}
      />
      <ActionsFilter filter={filter} onFilterChange={handleFilterChange} />
      {actionsLoading && <div>Loading actions...</div>}
      {actionsError && <div>Error loading actions: {actionsError.message}</div>}
      {!actionsLoading && !actionsError && (
        <ActionsList stackId={stack.id} actions={filterActions} />
      )}
    </main>
  );
}

export default StackView;

import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import { useActionsContext } from "@/context/actions/ActionsContext";
import Header from "@/components/layout/header/Header";
import ActionsFilter from "../actions/ActionsFilter";
import ActionsList from "../actions/ActionsList";
import { Action, Stack } from "@/types";

function StackView() {
  const { state, toggleSidebar } = useAppContext();
  const { stack } = useLoaderData() as { stack: Stack };
  const { actions } = useActionsContext();

  const [filter, setFilter] = useState({
    title: "",
    completed: false,
    priority: "priority",
    sortDirection: "asc",
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
    };
    return actions
      .filter((a) => a.stackId === stack.id)
      .filter((a) => (filter.completed ? !a.completed : true))
      .filter((a) => a.title.toLowerCase().includes(filter.title.toLowerCase()))
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
    <main className="stack-view">
      <Header
        appState={state}
        stackName={stack.name}
        toggleSidebar={toggleSidebar}
      />
      <ActionsFilter filter={filter} onFilterChange={handleFilterChange} />
      <ActionsList stackId={stack.id} actions={filterActions} />
    </main>
  );
}

export default StackView;

import { useAppContext } from "../../context/AppContext";
import { useLoaderData } from "react-router-dom";

// Context
import { useActionsContext } from "../../context/ActionsContext";

//  Components
import Header from "./Header";
import ActionsFilter from "./ActionsFilter";
import ActionsList from "./ActionsList";
import { useMemo, useState } from "react";

function StackView() {
  const { state, toggleSidebar } = useAppContext();
  // 1️⃣ Initial load from router loader
  const { stack } = useLoaderData();
  // 🔄 live action state updates from context
  const { actions } = useActionsContext();

  const [filter, setFilter] = useState({
    title: "",
    completed: false,
    priority: "priority",
    dateCreated: "date",
    sortDirection: "asc",
  });

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filterActions = useMemo(() => {
    return actions
      .filter((a) => a.stackId === stack.id)
      .filter((a) => (filter.completed ? !a.completed : true))
      .filter((a) => a.title.toLowerCase().includes(filter.title.toLowerCase()))
      .sort((a, b) => {
        const field =
          filter.priority === "priority" ? "priority" : "dateCreated";
        const valA = a[field];
        const valB = b[field];
        const direction = filter.sortDirection === "asc" ? 1 : -1;
        return valA > valB ? direction : valA < valB ? -direction : 0;
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
